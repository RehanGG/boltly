// localStorage can throw (private mode, blocked storage), so never call it directly.
export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(`boltly:${key}`);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(`boltly:${key}`, value);
  } catch {
    // Ignore: the setting just won't persist.
  }
}
