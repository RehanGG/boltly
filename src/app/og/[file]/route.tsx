import { ImageResponse } from "next/og";
import { categories } from "@/data/categories";
import { tools } from "@/data/tools";

// One 1200 x 630 social preview per tool and per category, drawn once at build time and
// saved as /og/<slug>.png and /og/category-<slug>.png. Brand colours only.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...tools.map((t) => ({ file: `${t.slug}.png` })),
    ...categories.map((c) => ({ file: `category-${c.slug}.png` })),
  ];
}

function card(label: string, title: string, text: string) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff" }}>
      <div style={{ width: 16, height: "100%", background: "#f59e0b" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 600, color: "#0f172a", marginLeft: 14 }}>Boltly</div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 28,
              color: "#1d4ed8",
              background: "#e8eefb",
              borderRadius: 999,
              padding: "8px 24px",
            }}
          >
            {label}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 24 ? 68 : 80, fontWeight: 600, color: "#0f172a", lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 36, color: "#64748b", marginTop: 24, lineHeight: 1.35 }}>{text}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#1d4ed8" }}>
          Free · No sign-up · Works in your browser · boltly.io
        </div>
      </div>
    </div>
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.png$/, "");
  const size = { width: 1200, height: 630 };

  if (slug.startsWith("category-")) {
    const category = categories.find((c) => `category-${c.slug}` === slug);
    if (!category) return new Response("Not found", { status: 404 });
    const count = tools.filter((t) => t.category === category.slug).length;
    return new ImageResponse(card(`${count} free tools`, category.name, category.description), size);
  }

  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return new Response("Not found", { status: 404 });
  const category = categories.find((c) => c.slug === tool.category);
  return new ImageResponse(card(category?.name ?? "Free tool", tool.name, tool.shortDescription), size);
}
