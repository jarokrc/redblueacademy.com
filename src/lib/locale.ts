export type Locale = "sk" | "en" | "de";

const STORAGE_KEY = "rba-locale";

const isLocale = (value: string | null): value is Locale =>
  value === "sk" || value === "en" || value === "de";

const mapLangToLocale = (lang: string): Locale | null => {
  const value = (lang || "").toLowerCase();
  if (!value) return null;
  if (value.startsWith("sk") || value.startsWith("cs")) return "sk";
  if (value.startsWith("de") || value.includes("-at") || value.includes("-ch")) return "de";
  if (value.startsWith("en")) return "en";
  return null;
};

const readStoredLocale = (): Locale | null => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : null;
};

export const detectLocale = (): Locale => {
  const stored = readStoredLocale();
  if (stored) return stored;

  if (typeof navigator !== "undefined" && Array.isArray(navigator.languages)) {
    for (const lang of navigator.languages) {
      const mapped = mapLangToLocale(lang);
      if (mapped) return mapped;
    }
  }

  if (typeof navigator !== "undefined") {
    const primary = mapLangToLocale(navigator.language || "");
    if (primary) return primary;
  }

  return "sk";
};

export const saveLocale = (locale: Locale) => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
};
