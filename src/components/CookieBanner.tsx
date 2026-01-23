import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/app/I18nProvider";

const STORAGE_KEY = "rb-cookie-consent";
const OPEN_PREFERENCES_EVENT = "rb-open-cookie-preferences";

type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const readConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed && typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
      return {
        essential: true,
        analytics: parsed.analytics,
        marketing: parsed.marketing,
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
};

const writeConsent = (consent: CookieConsent) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // If storage fails, just keep the banner hidden for this session.
  }
};

const CookieBanner = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draft, setDraft] = useState(() => {
    const existing = readConsent();
    return existing
      ? { analytics: existing.analytics, marketing: existing.marketing }
      : { analytics: true, marketing: true };
  });

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
      return;
    }
    setDraft({ analytics: existing.analytics, marketing: existing.marketing });
  }, []);

  const openPreferences = () => {
    const existing = readConsent();
    setDraft(existing ? { analytics: existing.analytics, marketing: existing.marketing } : { analytics: true, marketing: true });
    setVisible(true);
    setPreferencesOpen(true);
  };

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    writeConsent({
      essential: true,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    });
    setVisible(false);
    setPreferencesOpen(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => openPreferences();
    window.addEventListener(OPEN_PREFERENCES_EVENT, handler);
    return () => {
      window.removeEventListener(OPEN_PREFERENCES_EVENT, handler);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            {t.cookieBanner.message}{" "}
            <Link to="/cookies" className="font-semibold text-blue-600 hover:text-blue-700">
              {t.cookieBanner.policyLinkLabel}
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => saveConsent(true, true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t.cookieBanner.acceptAll}
            </button>
            <button
              type="button"
              onClick={() => saveConsent(false, false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              {t.cookieBanner.rejectOptional}
            </button>
            <button
              type="button"
              aria-expanded={preferencesOpen}
              onClick={() => setPreferencesOpen((prev) => !prev)}
              className="px-2 py-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              {t.cookieBanner.preferences}
            </button>
          </div>
        </div>

        {preferencesOpen ? (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{t.cookieBanner.preferencesTitle}</p>
              <p className="text-xs text-slate-500">{t.cookieBanner.preferencesDescription}</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.cookieBanner.essentialLabel}</p>
                  <p className="text-xs text-slate-500">{t.cookieBanner.essentialDescription}</p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 accent-blue-600"
                  aria-label={t.cookieBanner.essentialLabel}
                />
              </label>
              <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.cookieBanner.analyticsLabel}</p>
                  <p className="text-xs text-slate-500">{t.cookieBanner.analyticsDescription}</p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(event) => setDraft((prev) => ({ ...prev, analytics: event.target.checked }))}
                  className="mt-1 h-4 w-4 accent-blue-600"
                  aria-label={t.cookieBanner.analyticsLabel}
                />
              </label>
              <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.cookieBanner.marketingLabel}</p>
                  <p className="text-xs text-slate-500">{t.cookieBanner.marketingDescription}</p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.marketing}
                  onChange={(event) => setDraft((prev) => ({ ...prev, marketing: event.target.checked }))}
                  className="mt-1 h-4 w-4 accent-blue-600"
                  aria-label={t.cookieBanner.marketingLabel}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => saveConsent(draft.analytics, draft.marketing)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {t.cookieBanner.savePreferences}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CookieBanner;
