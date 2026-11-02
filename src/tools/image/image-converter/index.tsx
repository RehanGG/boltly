"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FileDropzone from "@/components/ui/FileDropzone";
import RangeField from "@/components/ui/RangeField";
import SelectField from "@/components/ui/SelectField";
import { ANY_IMAGE_TYPES, checkImageFile, formatBytes, limitFiles, MAX_FILES, replaceExtension } from "@/lib/files";
import { canvasToBlob, decodeImage, downloadBlob, drawToCanvas, errorMessage, releaseCanvas, yieldToBrowser } from "@/lib/image";
import { planConversion, TARGETS, type TargetFormat } from "./calc";

interface Item {
  id: number;
  file: File;
  status: "waiting" | "working" | "done" | "error";
  blob?: Blob;
  outputName?: string;
  error?: string;
}

let nextId = 1;

export default function ImageConverter() {
  const [items, setItems] = useState<Item[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [target, setTarget] = useState<TargetFormat>("image/webp");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);

  const plan = planConversion(target, quality);

  function patch(id: number, changes: Partial<Item>) {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

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
    setItems((list) => [...list, ...accepted.map((file): Item => ({ id: nextId++, file, status: "waiting" }))]);
  }

  async function convertAll() {
    if (!plan.ok) return;
    setBusy(true);
    for (const item of items) {
      patch(item.id, { status: "working", error: undefined });
      try {
        const bitmap = await decodeImage(item.file);
        const canvas = drawToCanvas(bitmap, bitmap.width, bitmap.height, plan.value.background);
        bitmap.close();
        const blob = await canvasToBlob(canvas, plan.value.type, plan.value.quality);
        releaseCanvas(canvas);
        if (blob.type !== plan.value.type) {
          throw new Error(`Your browser can't save ${TARGETS.find((t) => t.value === target)?.label}. Choose another format.`);
        }
        patch(item.id, { status: "done", blob, outputName: replaceExtension(item.file.name, plan.value.ext) });
      } catch (e) {
        patch(item.id, { status: "error", error: errorMessage(e) });
      }
      await yieldToBrowser();
    }
    setBusy(false);
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

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="target"
          label="Convert to"
          value={target}
          onChange={(v) => setTarget(v as TargetFormat)}
          options={TARGETS.map((t) => ({ value: t.value, label: t.label }))}
        />
        {target !== "image/png" && <RangeField id="quality" label="Quality" value={quality} min={10} max={100} step={5} unit="%" onChange={setQuality} />}
      </div>
      {target === "image/jpeg" && <p className="text-sm text-muted">JPG cannot be transparent, so transparent areas become white.</p>}

      <div className="flex flex-wrap gap-2">
        <Button onClick={convertAll} disabled={busy || items.length === 0 || !plan.ok}>
          {busy ? "Converting…" : items.length === 1 ? "Convert image" : items.length > 1 ? `Convert ${items.length} images` : "Convert images"}
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
                  {item.status === "working" && "Converting…"}
                  {item.status === "error" && <span className="text-danger">{item.error}</span>}
                  {item.status === "done" && item.blob && (
                    <>
                      {formatBytes(item.file.size)} → <strong className="text-text">{formatBytes(item.blob.size)}</strong> · {item.outputName}
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
    </div>
  );
}
