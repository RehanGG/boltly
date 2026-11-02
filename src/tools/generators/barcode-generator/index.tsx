"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import NumberField from "@/components/ui/NumberField";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { parseNumber } from "@/lib/format";
import { canvasToBlob, downloadBlob } from "@/lib/image";
import { fieldError } from "@/lib/validate";
import { checkBarcodeStyle, FORMATS, normalizeBarcode, type BarcodeFormat, type BarcodeStyle } from "./calc";

export default function BarcodeGenerator() {
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [value, setValue] = useState("BOLTLY-2026");
  const [barWidth, setBarWidth] = useState("2");
  const [height, setHeight] = useState("100");
  const [showText, setShowText] = useState(true);
  const [renderError, setRenderError] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const code = normalizeBarcode(format, value);
  const style = checkBarcodeStyle({ barWidth: parseNumber(barWidth), height: parseNumber(height) });
  const text = code.ok ? code.value.value : null;
  const ready = text !== null && style.ok;

  // One string for everything that changes the picture, so the effect only runs when
  // something really changed (objects made during render are new on every render).
  const key = text !== null && style.ok ? JSON.stringify([text, style.value, format, showText]) : null;

  // jsbarcode is downloaded the first time a barcode is drawn.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (key === null) {
      svg.replaceChildren();
      return;
    }
    let cancelled = false;
    const [value, picture, kind, showNumber] = JSON.parse(key) as [string, BarcodeStyle, BarcodeFormat, boolean];
    (async () => {
      try {
        const JsBarcode = (await import("jsbarcode")).default;
        if (cancelled) return;
        let valid = true;
        svg.replaceChildren();
        JsBarcode(svg, value, {
          format: kind,
          width: picture.barWidth,
          height: picture.height,
          displayValue: showNumber,
          margin: 12,
          background: "#ffffff",
          lineColor: "#000000",
          valid: (ok) => {
            valid = ok;
          },
        });
        // Let the picture shrink to fit narrow screens.
        if (!svg.getAttribute("viewBox")) {
          svg.setAttribute("viewBox", `0 0 ${parseFloat(svg.getAttribute("width") ?? "0")} ${parseFloat(svg.getAttribute("height") ?? "0")}`);
        }
        setRenderError(valid ? "" : "These characters cannot be turned into this barcode type.");
      } catch {
        if (!cancelled) setRenderError("This barcode could not be drawn. Check the value and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  function downloadSvg() {
    const svg = svgRef.current;
    if (!svg) return;
    if (!svg.getAttribute("xmlns")) svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    downloadBlob(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }), `barcode-${format.toLowerCase()}.svg`);
  }

  async function downloadPng() {
    if (text === null || !style.ok) return;
    const JsBarcode = (await import("jsbarcode")).default;
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
      format,
      width: style.value.barWidth,
      height: style.value.height,
      displayValue: showText,
      margin: 12,
      background: "#ffffff",
      lineColor: "#000000",
    });
    downloadBlob(await canvasToBlob(canvas, "image/png"), `barcode-${format.toLowerCase()}.png`);
  }

  const hint = FORMATS.find((f) => f.value === format)?.hint;

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            id="format"
            label="Barcode type"
            value={format}
            onChange={(v) => {
              const next = v as BarcodeFormat;
              setFormat(next);
              setValue(next === "EAN13" ? "400638133393" : "BOLTLY-2026");
            }}
            options={FORMATS.map((f) => ({ value: f.value, label: f.label }))}
          />
          <div>
            <label htmlFor="value" className="mb-1 block text-sm font-medium text-text">
              {format === "EAN13" ? "Digits" : "Text or number"}
            </label>
            <input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              inputMode={format === "EAN13" ? "numeric" : "text"}
              aria-invalid={fieldError(code, "value") ? true : undefined}
              aria-describedby="value-help"
              className="h-12 w-full rounded-btn border border-border bg-bg px-3 text-base text-text"
            />
            <p id="value-help" className={`mt-1 text-sm ${fieldError(code, "value") ? "text-danger" : "text-muted"}`} role={fieldError(code, "value") ? "alert" : undefined}>
              {fieldError(code, "value") ?? (code.ok && code.value.note) ?? hint}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="bar-width" label="Bar width" suffix="px" value={barWidth} onChange={setBarWidth} error={fieldError(style, "barWidth")} />
            <NumberField id="height" label="Height" suffix="px" value={height} onChange={setHeight} error={fieldError(style, "height")} />
          </div>
          <CheckField id="show-text" label="Show the number under the bars" checked={showText} onChange={setShowText} />
        </>
      }
      result={
        <div className="rounded-card border border-border bg-bg p-4 sm:p-5" aria-live="polite">
          {!ready && <p className="text-muted">Fix the highlighted field to see your barcode.</p>}
          {renderError && ready && <p role="alert" className="text-danger">{renderError}</p>}
          <div className={ready && !renderError ? "overflow-x-auto" : "hidden"}>
            <svg ref={svgRef} role="img" aria-label={text ? `Barcode for ${text}` : "Barcode"} className="mx-auto h-auto max-w-full rounded-btn border border-border" />
          </div>
          {ready && !renderError && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button onClick={downloadPng}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PNG
              </Button>
              <Button variant="secondary" onClick={downloadSvg}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download SVG
              </Button>
            </div>
          )}
          <p className="mt-3 text-center text-sm text-muted">Scan it with a barcode reader to check it before you print.</p>
        </div>
      }
    />
  );
}
