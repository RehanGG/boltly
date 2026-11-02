"use client";

import { useRef, useSyncExternalStore } from "react";

const subscribe = () => () => {};

// A value that can only be made in the browser, such as a random password.
// The static page and the first browser render both use `fallback`, so they match;
// the value is created once, right after that, and stays the same until replaced.
export function useClientValue<T>(compute: () => T, fallback: T): T {
  const cache = useRef<{ value: T } | null>(null);
  return useSyncExternalStore(
    subscribe,
    () => {
      if (cache.current === null) cache.current = { value: compute() };
      return cache.current.value;
    },
    () => fallback,
  );
}
