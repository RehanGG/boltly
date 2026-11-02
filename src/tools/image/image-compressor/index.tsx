"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FileDropzone from "@/components/ui/FileDropzone";
import RangeField from "@/components/ui/RangeField";
import SelectField from "@/components/ui/SelectField";
import {
  checkImageFile,
  extensionFor,
  formatBytes,
  limitFiles,
  MAX_FILES,
  percentSaved,
  suffixedName,
  WEB_IMAGE_TYPES,
} from "@/lib/files";
import { downloadBlob, errorMessage, yieldToBrowser } from "@/lib/image";
import { DIMENSION_CHOICES, compressOptions, summarizeCompression, type CompressSettings } from "./calc";

interface Item {
  id: number;
  file: File;
  status: "waiting" | "working" | "done" | "error";
  progress: number;
  blob?: Blob;
  outputName?: string;
  after?: number;
  keptOriginal?: boolean;
  error?: string;
}

let nextId = 1;

export default function ImageCompressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [quality, setQuality] = useState(75);
  const [maxDimension, setMaxDimension] = useState(0);
  const [format, setFormat] = useState<CompressSettings["format"]>("original");

  function patch(id: number, changes: Partial<Item>) {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function addFiles(files: File[]) {
    const messages: string[] = [];
    const valid: File[] = [];
    for (const file of files) {
      const problem = checkImageFile(file, WEB_IMAGE_TYPES);
      if (problem) messages.push(problem);
      else valid.push(file);
    }
    const { accepted, skipped } = limitFiles(valid, items.length);
    if (skipped > 0) messages.push(`Only ${MAX_FILES} images can be added at once. ${skipped} skipped.`);
    setProblems(messages);
    setItems((list) => [
      ...list,
      ...accepted.map((file): Item => ({ id: nextId++, file, status: "waiting", progress: 0 })),
    ]);
  }

  async function compressAll() {
    const options = compressOptions({ quality, maxDimension, format });
    if (!options.ok || items.length === 0) return;
    setBusy(true);
    try {
      // The library is only downloaded when someone clicks Compress.
      const { default: imageCompression } = await import("browser-image-compression");
      for (const item of items) {
        patch(item.id, { status: "working", progress: 0, error: undefined });
        try {
          const out = await imageCompression(item.file, {
            ...options.value,
            onProgress: (p) => patch(item.id, { progress: Math.round(p) }),
          });
          const summary = summarizeCompression(item.file.size, out.size);
          const type = summary.keptOriginal ? item.file.type : out.type;
          patch(item.id, {
            status: "done",
            progress: 100,
            blob: summary.keptOriginal ? item.file : out,
            after: summary.finalSize,
            keptOriginal: summary.keptOriginal,
            outputName: summary.keptOriginal
              ? item.file.name
              : suffixedName(item.file.name, "compressed", extensionFor(type)),
          });
        } catch (e) {
          patch(item.id, { status: "error", error: errorMessage(e) });
        }
        await yieldToBrowser();
      }
    } catch {
      setProblems(["The compression tool could not be loaded. Check your connection and try again."]);
    } finally {
      setBusy(false);
    }
  }

  const done = items.filter((i) => i.status === "done");
  const totalBefore = done.reduce((s, i) => s + i.file.size, 0);
  const totalAfter = done.reduce((s, i) => s + (i.after ?? 0), 0);

  return (
    <div className="space-y-4">
      <FileDropzone
        id="files"
        label="Choose images or drop them here"
        hint={`JPG, PNG or WebP · up to ${MAX_FILES} images · 50 MB each`}
        accept="image/jpeg,image/png,image/webp"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <RangeField id="quality" label="Quality" value={quality} min={10} max={100} step={5} unit="%" onChange={setQuality} />
        <SelectField
          id="max-dimension"
          label="Maximum width or height"
          value={String(maxDimension)}
          onChange={(v) => setMaxDimension(Number(v))}
          options={DIMENSION_CHOICES.map((d) => ({ value: String(d), label: d === 0 ? "Keep original size" : `${d} px` }))}
        />
        <SelectField
          id="format"
          label="Output format"
          value={format}
          onChange={(v) => setFormat(v as CompressSettings["format"])}
          options={[
            { value: "original", label: "Same as original" },
            { value: "webp", label: "WebP (smallest)" },
          ]}
        />
      </div>
      <p className="text-sm text-muted">
        Quality applies to JPG and WebP. PNG files keep full quality, so they shrink less. Choose WebP to save more.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button onClick={compressAll} disabled={busy || items.length === 0}>
          {busy ? "Compressing…" : items.length === 1 ? "Compress image" : items.length > 1 ? `Compress ${items.length} images` : "Compress images"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setItems([]);
            setProblems([]);
          }}
          disabled={busy || items.length === 0}
        >
          Clear all
        </Button>
      </div>

      {items.length > 0 && (
        <ul aria-live="polite" className="divide-y divide-border rounded-card border border-border bg-bg">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text">{item.file.name}</p>
                <p className="text-sm text-muted">
                  {item.status === "waiting" && `${formatBytes(item.file.size)} · waiting`}
                  {item.status === "working" && `${formatBytes(item.file.size)} · compressing… ${item.progress}%`}
                  {item.status === "error" && <span className="text-danger">{item.error}</span>}
                  {item.status === "done" && item.after !== undefined && (
                    <>
                      {formatBytes(item.file.size)} → <strong className="text-text">{formatBytes(item.after)}</strong>
                      {item.keptOriginal
                        ? " · already well compressed, original kept"
                        : ` · saved ${Math.round(percentSaved(item.file.size, item.after))}%`}
                    </>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                {item.status === "done" && item.blob && item.outputName && (
                  <Button variant="secondary" onClick={() => downloadBlob(item.blob!, item.outputName!)}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                  </Button>
                )}
                <Button
                  variant="secondary"
                  aria-label={`Remove ${item.file.name}`}
                  disabled={busy}
                  onClick={() => setItems((list) => list.filter((i) => i.id !== item.id))}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {done.length > 1 && (
        <p className="rounded-btn border border-border bg-bg p-3 text-text">
          Total: {formatBytes(totalBefore)} → <strong>{formatBytes(totalAfter)}</strong> · saved{" "}
          {Math.round(percentSaved(totalBefore, totalAfter))}%
        </p>
      )}
    </div>
  );
}
