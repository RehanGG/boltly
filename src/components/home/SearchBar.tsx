"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { categories } from "@/data/categories";
import { toolPath } from "@/lib/paths";
import type { SearchDoc, SearchIndexJson } from "@/lib/search";

type Searcher = (query: string) => SearchDoc[];

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export default function SearchBar({
  docs,
  index,
}: {
  docs: SearchDoc[];
  index: SearchIndexJson;
}) {
  const router = useRouter();
  // Fuse.js is only downloaded the first time the search bar gets focus.
  const [search, setSearch] = useState<Searcher | null>(null);
  const loading = useRef(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => (search ? search(query) : []), [search, query]);
  const showList = open && query.trim().length > 0;

  // "/" or Ctrl/Cmd+K focuses the search; the header icon links to /#search.
  useEffect(() => {
    function focusSearch() {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    function onKeyDown(e: globalThis.KeyboardEvent) {
      const slash = e.key === "/" && !isTyping(e.target);
      const ctrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (slash || ctrlK) {
        e.preventDefault();
        focusSearch();
      }
    }
    function onHash() {
      if (window.location.hash === "#search") focusSearch();
    }
    onHash();
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  function loadSearch() {
    if (loading.current) return;
    loading.current = true;
    import("@/lib/search").then((m) => {
      const searcher = m.createSearcher(docs, index);
      setSearch(() => searcher);
    });
  }

  function go(doc: SearchDoc) {
    setOpen(false);
    router.push(toolPath(doc));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) =>
        results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1,
      );
    } else if (e.key === "Enter") {
      const doc = results[active >= 0 ? active : 0];
      if (showList && doc) {
        e.preventDefault();
        go(doc);
      }
    } else if (e.key === "Escape") {
      if (showList) setOpen(false);
      else setQuery("");
    }
  }

  const ready = search !== null;
  const status = !showList
    ? ""
    : !ready
      ? "Loading search"
      : results.length === 0
      ? "No tools found"
      : `${results.length} ${results.length === 1 ? "result" : "results"} available`;

  return (
    <div
      className="relative mx-auto w-full max-w-tool"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label htmlFor="search" className="mb-2 block text-left text-sm font-medium text-text">
        Search tools
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="search"
          type="search"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search tools, e.g. EMI, word counter, QR code"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            setOpen(true);
            loadSearch();
          }}
          onKeyDown={onKeyDown}
          aria-expanded={showList && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className="h-14 w-full rounded-card border border-border bg-bg pl-12 pr-12 text-base text-text shadow-card placeholder:text-muted focus:border-primary"
        />
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 hidden h-6 -translate-y-1/2 items-center rounded border border-border px-2 text-sm text-muted md:flex"
        >
          /
        </kbd>

        <p role="status" aria-live="polite" className="sr-only">
          {status}
        </p>

        {showList && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-card border border-border bg-bg text-left shadow-lg">
            {!ready ? (
              <p className="px-4 py-3 text-muted">Loading…</p>
            ) : results.length === 0 ? (
              <p className="px-4 py-3 text-muted">
                No tools found. Try a different word.
              </p>
            ) : null}
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((doc, i) => {
                const category = categories.find((c) => c.slug === doc.category);
                return (
                  <li
                    key={doc.slug}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    className={i === active ? "bg-surface" : undefined}
                  >
                    <Link
                      href={toolPath(doc)}
                      tabIndex={-1}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center justify-between gap-4 px-4 py-2"
                    >
                      <span className="font-medium text-text">{doc.name}</span>
                      <span className="shrink-0 text-sm text-muted">
                        {category?.shortName}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
