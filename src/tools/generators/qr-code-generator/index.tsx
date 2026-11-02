"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import NumberField from "@/components/ui/NumberField";
import SelectField from "@/components/ui/SelectField";
import TextArea from "@/components/ui/TextArea";
import ToolLayout from "@/components/ui/ToolLayout";
import { downloadBlob } from "@/lib/image";
import { parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import {
  checkStyle,
  qrContent,
  scanWarning,
  type ErrorLevel,
  type QrMode,
  type QrStyle,
  type WifiSecurity,
} from "./calc";

interface Rendered {
  key: string;
  png: string;
  svg: string;
}

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full cursor-pointer rounded-btn border border-border bg-bg p-1"
      />
    </div>
  );
}

export default function QrCodeGenerator() {
  const [mode, setMode] = useState<QrMode>("text");
  const [text, setText] = useState("https://boltly.io");
  const [ssid, setSsid] = useState("HomeNetwork");
  const [wifiPassword, setWifiPassword] = useState("changeme123");
  const [security, setSecurity] = useState<WifiSecurity>("WPA");
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState("512");
  const [margin, setMargin] = useState("2");
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [rendered, setRendered] = useState<Rendered | null>(null);
  const [renderError, setRenderError] = useState("");

  const content = qrContent({ mode, text, wifi: { ssid, password: wifiPassword, security, hidden } });
  const style = checkStyle({ size: parseNumber(size), margin: parseNumber(margin), dark, light, errorLevel });
  const warning = scanWarning(dark, light);

  // Everything that changes the picture, as one string. The effect below depends on this
  // string only: objects made during render are new every time and would restart it
  // endlessly. The qrcode library is downloaded the first time this runs, so other pages
  // never load it.
  const key = style.ok && content.ok ? JSON.stringify([content.value, style.value]) : null;

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    const [text2, picture] = JSON.parse(key) as [string, QrStyle];
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const options = {
          errorCorrectionLevel: picture.errorLevel,
          margin: picture.margin,
          width: picture.size,
          color: { dark: picture.dark, light: picture.light },
        };
        const [png, svg] = await Promise.all([
          QRCode.toDataURL(text2, options),
          QRCode.toString(text2, { ...options, type: "svg" }),
        ]);
        if (!cancelled) {
          setRendered({ key, png, svg });
          setRenderError("");
        }
      } catch {
        if (!cancelled) {
          setRenderError("That is too much data for a QR code. Shorten the text or lower the error correction.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  const ready = rendered !== null && rendered.key === key;
  const baseName = mode === "wifi" ? "wifi-qr-code" : "qr-code";

  async function downloadPng() {
    if (!rendered) return;
    downloadBlob(await (await fetch(rendered.png)).blob(), `${baseName}.png`);
  }

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            id="mode"
            label="QR code for"
            value={mode}
            onChange={(v) => setMode(v as QrMode)}
            options={[
              { value: "text", label: "Link or text" },
              { value: "wifi", label: "Wi-Fi network" },
            ]}
          />

          {mode === "text" ? (
            <TextArea id="text" label="Link or text" value={text} onChange={setText} rows={3} error={fieldError(content, "text")} />
          ) : (
            <>
              <div>
                <label htmlFor="ssid" className="mb-1 block text-sm font-medium text-text">Network name (SSID)</label>
                <input
                  id="ssid"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  autoComplete="off"
                  aria-invalid={fieldError(content, "ssid") ? true : undefined}
                  className="h-12 w-full rounded-btn border border-border bg-bg px-3 text-base text-text"
                />
                {fieldError(content, "ssid") && <p role="alert" className="mt-1 text-sm text-danger">{fieldError(content, "ssid")}</p>}
              </div>
              <SelectField
                id="security"
                label="Security"
                value={security}
                onChange={(v) => setSecurity(v as WifiSecurity)}
                options={[
                  { value: "WPA", label: "WPA / WPA2 / WPA3" },
                  { value: "WEP", label: "WEP" },
                  { value: "nopass", label: "No password" },
                ]}
              />
              {security !== "nopass" && (
                <div>
                  <label htmlFor="wifi-password" className="mb-1 block text-sm font-medium text-text">Wi-Fi password</label>
                  <input
                    id="wifi-password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    autoComplete="off"
                    aria-invalid={fieldError(content, "password") ? true : undefined}
                    className="h-12 w-full rounded-btn border border-border bg-bg px-3 text-base text-text"
                  />
                  {fieldError(content, "password") && <p role="alert" className="mt-1 text-sm text-danger">{fieldError(content, "password")}</p>}
                </div>
              )}
              <CheckField id="hidden" label="Hidden network" checked={hidden} onChange={setHidden} />
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <NumberField id="size" label="Size (PNG)" suffix="px" value={size} onChange={setSize} error={fieldError(style, "size")} />
            <NumberField id="margin" label="Margin" suffix="blocks" value={margin} onChange={setMargin} error={fieldError(style, "margin")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ColorField id="dark" label="Code color" value={dark} onChange={setDark} />
            <ColorField id="light" label="Background" value={light} onChange={setLight} />
          </div>
          {warning && <p role="alert" className="text-sm text-danger">{warning}</p>}
          <SelectField
            id="level"
            label="Error correction"
            value={errorLevel}
            onChange={(v) => setErrorLevel(v as ErrorLevel)}
            options={[
              { value: "L", label: "Low (7%) – smallest code" },
              { value: "M", label: "Medium (15%)" },
              { value: "Q", label: "Quartile (25%)" },
              { value: "H", label: "High (30%) – best if printed" },
            ]}
          />
        </>
      }
      result={
        <div className="rounded-card border border-border bg-bg p-4 sm:p-5" aria-live="polite">
          {!content.ok || !style.ok ? (
            <p className="text-muted">Fix the highlighted field to see your QR code.</p>
          ) : renderError ? (
            <p role="alert" className="text-danger">{renderError}</p>
          ) : rendered ? (
            <div className={ready ? "" : "opacity-50"}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a generated data URL */}
              <img
                src={rendered.png}
                alt="Your QR code"
                width={280}
                height={280}
                className="mx-auto h-auto w-full max-w-[280px] rounded-btn border border-border"
                style={{ imageRendering: "pixelated" }}
              />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button onClick={downloadPng} disabled={!ready}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download PNG
                </Button>
                <Button variant="secondary" disabled={!ready} onClick={() => downloadBlob(new Blob([rendered.svg], { type: "image/svg+xml" }), `${baseName}.svg`)}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download SVG
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-muted">Making your QR code…</div>
          )}
          <p className="mt-3 text-center text-sm text-muted">Test the code with your phone before you print it.</p>
        </div>
      }
    />
  );
}
