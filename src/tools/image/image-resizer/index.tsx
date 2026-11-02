"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import FileDropzone from "@/components/ui/FileDropzone";
import NumberField from "@/components/ui/NumberField";
import RangeField from "@/components/ui/RangeField";
import SelectField from "@/components/ui/SelectField";
import { ANY_IMAGE_TYPES, checkImageFile, extensionFor, formatBytes, suffixedName, typeOf } from "@/lib/files";
import { canvasToBlob, decodeImage, downloadBlob, drawToCanvas, errorMessage, releaseCanvas } from "@/lib/image";
import { parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateResize, linkedDimension, outputType, type OutputChoice, type ResizeMode } from "./calc";

interface Output {
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [orig, setOrig] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percent, setPercent] = useState("50");
  const [lock, setLock] = useState(true);
  const [choice, setChoice] = useState<OutputChoice>("original");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState<Output | null>(null);

  async function choose(files: File[]) {
    const picked = files[0];
    const problem = checkImageFile(picked, ANY_IMAGE_TYPES);
    setOutput(null);
    if (problem) {
      setMessage(problem);
      return;
    }
    setMessage("");
    try {
      const bitmap = await decodeImage(picked);
      setOrig({ width: bitmap.width, height: bitmap.height });
      setWidth(String(bitmap.width));
      setHeight(String(bitmap.height));
      bitmap.close();
      setFile(picked);
    } catch (e) {
      setMessage(errorMessage(e));
    }
  }

  function changeWidth(value: string) {
    setWidth(value);
    if (lock) {
      const linked = linkedDimension("width", parseNumber(value), orig.width, orig.height);
      setHeight(Number.isNaN(linked) ? "" : String(linked));
    }
  }

  function changeHeight(value: string) {
    setHeight(value);
    if (lock) {
      const linked = linkedDimension("height", parseNumber(value), orig.width, orig.height);
      setWidth(Number.isNaN(linked) ? "" : String(linked));
    }
  }

  const target = calculateResize({
    mode,
    origWidth: orig.width,
    origHeight: orig.height,
    width: parseNumber(width),
    height: parseNumber(height),
    percent: parseNumber(percent),
  });
  const type = file ? outputType(typeOf(file), choice) : "image/png";
  const lossy = type !== "image/png";

  async function resize() {
    if (!file || !target.ok) return;
    setBusy(true);
    setMessage("");
    setOutput(null);
    try {
      const { width: w, height: h } = target.value;
      const bitmap = await decodeImage(file, { width: w, height: h });
      const canvas = drawToCanvas(bitmap, w, h, type === "image/jpeg" ? "#ffffff" : undefined);
      bitmap.close();
      const blob = await canvasToBlob(canvas, type, lossy ? quality / 100 : undefined);
      releaseCanvas(canvas);
      if (blob.type !== type) {
        throw new Error("Your browser can't save this format. Choose JPG or PNG instead.");
      }
      setOutput({ blob, name: suffixedName(file.name, `${w}x${h}`, extensionFor(type)), width: w, height: h });
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <FileDropzone
        id="file"
        label={file ? `Selected: ${file.name}` : "Choose an image or drop it here"}
        hint={file ? `${orig.width} × ${orig.height} px · ${formatBytes(file.size)} · choose another to replace it` : "JPG, PNG or WebP · up to 50 MB"}
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        onFiles={choose}
      />

      {message && <p role="alert" className="text-sm text-danger">{message}</p>}

      {file && (
        <>
          <SelectField
            id="mode"
            label="Resize by"
            value={mode}
            onChange={(v) => setMode(v as ResizeMode)}
            options={[
              { value: "pixels", label: "Width and height (pixels)" },
              { value: "percent", label: "Percent of the original" },
            ]}
          />

          {mode === "pixels" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField id="width" label="Width" suffix="px" value={width} onChange={changeWidth} error={fieldError(target, "width")} />
                <NumberField id="height" label="Height" suffix="px" value={height} onChange={changeHeight} error={fieldError(target, "height")} />
              </div>
              <CheckField id="lock" label="Lock aspect ratio" checked={lock} onChange={setLock} />
            </>
          ) : (
            <NumberField id="percent" label="Scale" suffix="%" value={percent} onChange={setPercent} error={fieldError(target, "percent")} />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="format"
              label="Save as"
              value={choice}
              onChange={(v) => setChoice(v as OutputChoice)}
              options={[
                { value: "original", label: "Same as original" },
                { value: "image/jpeg", label: "JPG" },
                { value: "image/png", label: "PNG" },
                { value: "image/webp", label: "WebP" },
              ]}
            />
            {lossy && <RangeField id="quality" label="Quality" value={quality} min={10} max={100} step={5} unit="%" onChange={setQuality} />}
          </div>

          <p className="text-sm text-muted">
            New size: {target.ok ? `${target.value.width} × ${target.value.height} px` : "–"}
          </p>
          <Button onClick={resize} disabled={busy || !target.ok}>
            {busy ? "Resizing…" : "Resize image"}
          </Button>
        </>
      )}

      {output && file && (
        <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-bg p-4">
          <div>
            <p className="font-medium text-text">{output.name}</p>
            <p className="text-sm text-muted">
              {orig.width} × {orig.height} px · {formatBytes(file.size)} → <strong className="text-text">{output.width} × {output.height} px · {formatBytes(output.blob.size)}</strong>
            </p>
          </div>
          <Button variant="secondary" onClick={() => downloadBlob(output.blob, output.name)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
}
