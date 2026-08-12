export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function resolveSupabaseConfig(rawUrl: unknown, rawAnonKey: unknown): SupabaseConfig | null {
  if (typeof rawUrl !== "string" || typeof rawAnonKey !== "string") return null;

  const url = rawUrl.trim();
  const anonKey = rawAnonKey.trim();
  if (!url || !anonKey) return null;

  try {
    const parsedUrl = new URL(url);
    if ((parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") || !parsedUrl.hostname) {
      return null;
    }
  } catch {
    return null;
  }

  return { url, anonKey };
}
