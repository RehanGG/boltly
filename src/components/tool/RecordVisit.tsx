"use client";

import { useEffect } from "react";
import { recordRecent } from "@/lib/recent";

// Remembers the last tools opened, for the homepage "Recently used" row.
export default function RecordVisit({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecent(slug);
  }, [slug]);
  return null;
}
