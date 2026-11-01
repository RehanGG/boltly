import Link from "next/link";
import { toolPath } from "@/data/tools";
import Icon from "@/components/ui/Icon";
import type { Tool } from "@/types";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={toolPath(tool)}
      className="group flex min-h-11 gap-3 rounded-card border border-border bg-surface p-4 shadow-card transition duration-150 motion-safe:hover:-translate-y-0.5 hover:border-primary"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
        <Icon name={tool.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-text">{tool.name}</span>
        <span className="block text-sm text-muted">{tool.shortDescription}</span>
      </span>
    </Link>
  );
}
