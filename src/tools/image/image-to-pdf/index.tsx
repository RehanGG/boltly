"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Download, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FileDropzone from "@/components/ui/FileDropzone";
import SelectField from "@/components/ui/SelectField";
import { ANY_IMAGE_TYPES, checkImageFile, formatBytes, limitFiles, MAX_FILES, typeOf } from "@/lib/files";
import { canvasToBlob, decodeImage, downloadBlob, drawToCanvas, errorMessage, releaseCanvas, yieldToBrowser } from "@/lib/image";
import {
  layoutPage,
  moveItem,
  prepareSettings,
  scaledSize,
  type Margin,
  type Orientation,
  type PageSize,
  type PdfQuality,
} from "./calc";

interface Item {
  id: number;
  file: File;
}

let nextId = 1;

export default function ImageToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [size, setSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<Margin>("small");
  const [quality, setQuality] = useState<PdfQuality>("small");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [pdf, setPdf] = useState<{ blob: Blob; pages: number } | null>(null);

  function addFiles(files: File[]) {
    const messages: string[] = [];
    const valid: File[] = [];
    for (const file of files) {
      const problem = checkImageFile(file, ANY_IMAGE_TYPES);
      if (problem) messages.push(problem);
      else valid.push(file);
    }
    const { accepted, skipped } = limitFiles(valid, items.length);
    if (skipped > 0) messages.push(`Only ${MAX_FILES} images can be added at once. ${skipped} skipped.`);
    setProblems(messages);
    setPdf(null);
    setItems((list) => [...list, ...accepted.map((file): Item => ({ id: nextId++, file }))]);
  }

  async function createPdf() {
    if (items.length === 0) return;
    setBusy(true);
    setPdf(null);
    setProblems([]);
    try {
      // pdf-lib is only downloaded when someone clicks Create PDF.
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const prep = prepareSettings(quality);

      for (let i = 0; i < items.length; i++) {
        const { file } = items[i];
        setProgress(`Adding image ${i + 1} of ${items.length}…`);
        await yieldToBrowser();

        // Decoding through the browser applies photo rotation (EXIF) and handles WebP, GIF and BMP.
        const bitmap = await decodeImage(file);
        const target = scaledSize(bitmap.width, bitmap.height, prep.maxSide);
        const isPng = typeOf(file) === "image/png";
        const canvas = drawToCanvas(bitmap, target.width, target.height, isPng ? undefined : "#ffffff");
        bitmap.close();
        const blob = await canvasToBlob(canvas, isPng ? "image/png" : "image/jpeg", isPng ? undefined : prep.jpegQuality);
        releaseCanvas(canvas);

        const bytes = new Uint8Array(await blob.arrayBuffer());
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const layout = layoutPage({ size, orientation, margin, imageWidth: image.width, imageHeight: image.height });
        if (!layout.ok) throw new Error(layout.error);
        const page = doc.addPage([layout.value.pageWidth, layout.value.pageHeight]);
        page.drawImage(image, { x: layout.value.x, y: layout.value.y, width: layout.value.width, height: layout.value.height });
      }

      setProgress("Saving the PDF…");
      await yieldToBrowser();
      const saved = await doc.save();
      setPdf({ blob: new Blob([new Uint8Array(saved)], { type: "application/pdf" }), pages: items.length });
    } catch (e) {
      setProblems([errorMessage(e)]);
    } finally {
      setProgress("");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <FileDropzone
        id="files"
        label="Choose images or drop them here"
        hint={`JPG, PNG, WebP, GIF or BMP · up to ${MAX_FILES} images · 50 MB each`}
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        multiple
        onFiles={addFiles}
      />

      {problems.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-danger">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <>
          <p className="text-sm text-muted">Each image becomes one page, in this order.</p>
          <ol className="divide-y divide-border rounded-card border border-border bg-bg">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text">
                    {index + 1}. {item.file.name}
                  </p>
                  <p className="text-sm text-muted">{formatBytes(item.file.size)}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="secondary" aria-label={`Move ${item.file.name} up`} disabled={busy || index === 0} onClick={() => setItems((l) => moveItem(l, index, -1))}>
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="secondary" aria-label={`Move ${item.file.name} down`} disabled={busy || index === items.length - 1} onClick={() => setItems((l) => moveItem(l, index, 1))}>
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="secondary" aria-label={`Remove ${item.file.name}`} disabled={busy} onClick={() => setItems((l) => l.filter((i) => i.id !== item.id))}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="size"
          label="Page size"
          value={size}
          onChange={(v) => setSize(v as PageSize)}
          options={[
            { value: "a4", label: "A4" },
            { value: "letter", label: "US Letter" },
            { value: "legal", label: "US Legal" },
            { value: "a3", label: "A3" },
            { value: "fit", label: "Same size as the image" },
          ]}
        />
        <SelectField
          id="orientation"
          label="Orientation"
          value={size === "fit" ? "auto" : orientation}
          onChange={(v) => setOrientation(v as Orientation)}
          options={[
            { value: "auto", label: size === "fit" ? "Matches the image" : "Automatic (match each image)" },
            { value: "portrait", label: "Portrait" },
            { value: "landscape", label: "Landscape" },
          ]}
        />
        <SelectField
          id="margin"
          label="Margin"
          value={margin}
          onChange={(v) => setMargin(v as Margin)}
          options={[
            { value: "none", label: "None" },
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
          ]}
        />
        <SelectField
          id="quality"
          label="Image quality"
          value={quality}
          onChange={(v) => setQuality(v as PdfQuality)}
          options={[
            { value: "small", label: "Smaller file (max 2000 px)" },
            { value: "high", label: "Original size" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={createPdf} disabled={busy || items.length === 0}>
          {busy ? "Creating PDF…" : "Create PDF"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setItems([]);
            setPdf(null);
            setProblems([]);
          }}
          disabled={busy || items.length === 0}
        >
          Clear all
        </Button>
        <span aria-live="polite" className="text-sm text-muted">{progress}</span>
      </div>

      {pdf && (
        <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-bg p-4">
          <div>
            <p className="font-medium text-text">images.pdf</p>
            <p className="text-sm text-muted">
              {pdf.pages} {pdf.pages === 1 ? "page" : "pages"} · <strong className="text-text">{formatBytes(pdf.blob.size)}</strong>
            </p>
          </div>
          <Button variant="secondary" onClick={() => downloadBlob(pdf.blob, "images.pdf")}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
}
