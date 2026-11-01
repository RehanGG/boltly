"use client";

import { useSyncExternalStore } from "react";
import { todayIso } from "./dates";

const subscribe = () => () => {};

// Today's date in the visitor's time zone. It is "" while the static page is
// built and hydrated, so server and browser HTML always match; tools show their
// result once the real date is known.
export function useToday(): string {
  return useSyncExternalStore(subscribe, todayIso, () => "");
}
