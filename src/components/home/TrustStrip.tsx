import { Gift, LayoutGrid, ShieldCheck, Smartphone } from "lucide-react";
import { tools } from "@/data/tools";

// Four short facts that answer "why this site?" at a glance. Shared by the homepage
// and the category pages.
export default function TrustStrip({ className = "" }: { className?: string }) {
  const facts = [
    { Icon: LayoutGrid, title: `${tools.length} free tools`, text: "Money, text, images and more" },
    { Icon: Gift, title: "No sign-up", text: "Open a tool and start" },
    { Icon: ShieldCheck, title: "Private by design", text: "Files stay on your device" },
    { Icon: Smartphone, title: "Works anywhere", text: "Phone, tablet or computer" },
  ];
  return (
    <section aria-label="Why Boltly" className={`border-b border-border bg-surface ${className}`}>
      <ul className="mx-auto grid max-w-page grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 lg:grid-cols-4">
        {facts.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-text">{title}</span>
              <span className="block text-sm text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
