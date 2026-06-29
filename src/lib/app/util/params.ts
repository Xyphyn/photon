export const urlParam = {
  bool: (url: URL, key: string, def = false) =>
    (url.searchParams.get(key) ?? String(def)) === 'true',
  string: <T extends string>(url: URL, key: string, def: T) =>
    (url.searchParams.get(key) as T | null) ?? def,
  number: (url: URL, key: string) => Number(url.searchParams.get(key)) || undefined,
  optional: <T extends string>(url: URL, key: string) =>
    (url.searchParams.get(key) as T | null) ?? undefined,
}
