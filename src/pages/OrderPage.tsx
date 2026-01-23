import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "@/app/I18nProvider";
import PageShell from "@/components/PageShell";

type PackageOption = {
  key: "doucovatel" | "student" | "profesional";
  label: string;
  minHours: number;
  maxHours: number;
  pricePerHour: number;
};

const PACKAGE_KEYS: PackageOption["key"][] = ["doucovatel", "student", "profesional"];

const getPackageForHours = (hours: number, options: PackageOption[]) => {
  if (hours >= 160) return options.find((option) => option.key === "profesional");
  if (hours >= 30) return options.find((option) => option.key === "student");
  return options.find((option) => option.key === "doucovatel");
};

const clampHours = (hours: number, option: PackageOption) => {
  if (hours < option.minHours) return option.minHours;
  if (hours > option.maxHours) return option.maxHours;
  return hours;
};

const formatCurrency = (amount: number, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

const renderConsentText = ({
  text,
  privacyLabel,
  termsLabel,
}: {
  text: string;
  privacyLabel: string;
  termsLabel: string;
}) => {
  const tokens = {
    "{privacy_link}": (
      <Link to="/zasady-ochrany-osobnych-udajov" className="font-semibold text-blue-700 hover:text-blue-800">
        {privacyLabel}
      </Link>
    ),
    "{terms_link}": (
      <Link to="/vseobecne-obchodne-podmienky" className="font-semibold text-blue-700 hover:text-blue-800">
        {termsLabel}
      </Link>
    ),
  } as const;

  return text.split(/(\{privacy_link\}|\{terms_link\})/g).map((part, index) => {
    const token = tokens[part as keyof typeof tokens];
    return token ? <span key={`token-${index}`}>{token}</span> : <span key={`text-${index}`}>{part}</span>;
  });
};

const OrderPage = () => {
  const { t, locale } = useI18n();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("type") === "consultation" ? "consultation" : "package";
  const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined)?.trim() ?? "";
  const recaptchaEnabled = Boolean(recaptchaSiteKey);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const packageOptions = useMemo<PackageOption[]>(() => {
    const labels = t.pricingPage.packages;
    return [
      {
        key: "doucovatel",
        label: labels[0]?.name ?? "Doučovateľ",
        minHours: 1,
        maxHours: 29,
        pricePerHour: 29,
      },
      {
        key: "student",
        label: labels[1]?.name ?? "Študent",
        minHours: 30,
        maxHours: 159,
        pricePerHour: 15,
      },
      {
        key: "profesional",
        label: labels[2]?.name ?? "Profesionál",
        minHours: 160,
        maxHours: Number.POSITIVE_INFINITY,
        pricePerHour: 12,
      },
    ];
  }, [t]);

  const packageParam = searchParams.get("package");
  const initialPackageKey = PACKAGE_KEYS.includes(packageParam as PackageOption["key"])
    ? (packageParam as PackageOption["key"])
    : PACKAGE_KEYS[0];
  const initialPackage =
    packageOptions.find((option) => option.key === initialPackageKey) ?? packageOptions[0];
  const hoursParam = Number.parseInt(searchParams.get("hours") ?? "", 10);
  const initialHours = Number.isFinite(hoursParam) && hoursParam > 0 ? hoursParam : initialPackage.minHours;

  const [hoursInput, setHoursInput] = useState(() => (mode === "package" ? String(initialHours) : ""));
  const [selectedPackageKey, setSelectedPackageKey] = useState<PackageOption["key"]>(initialPackage.key);
  const [baselinePackageKey, setBaselinePackageKey] = useState<PackageOption["key"]>(initialPackage.key);
  const [savingsAmount, setSavingsAmount] = useState<number | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formStartedAt = useMemo(() => Date.now(), []);

  const selectedPackage = packageOptions.find((option) => option.key === selectedPackageKey) ?? initialPackage;
  const baselinePackage = packageOptions.find((option) => option.key === baselinePackageKey) ?? initialPackage;
  const hours = Number.parseInt(hoursInput, 10);
  const validHours = Number.isFinite(hours) && hours > 0 ? hours : null;

  useEffect(() => {
    if (mode !== "package") return;
    if (!validHours) {
      setSavingsAmount(null);
      return;
    }
    const autoPackage = getPackageForHours(validHours, packageOptions);
    if (!autoPackage) return;
    if (autoPackage.key !== selectedPackageKey) {
      setSelectedPackageKey(autoPackage.key);
    }
    if (baselinePackage.pricePerHour > autoPackage.pricePerHour) {
      const savings = (baselinePackage.pricePerHour - autoPackage.pricePerHour) * validHours;
      setSavingsAmount(savings > 0 ? savings : null);
    } else {
      setSavingsAmount(null);
    }
  }, [baselinePackage.pricePerHour, baselinePackageKey, mode, packageOptions, selectedPackageKey, validHours]);

  const handlePackageChange = (value: PackageOption["key"]) => {
    setBaselinePackageKey(value);
    setSelectedPackageKey(value);
    setSavingsAmount(null);
    if (mode !== "package") return;
    const nextOption = packageOptions.find((option) => option.key === value);
    if (!nextOption) return;
    if (!validHours) {
      setHoursInput(String(nextOption.minHours));
      return;
    }
    const nextHours = clampHours(validHours, nextOption);
    setHoursInput(String(nextHours));
  };

  const maxHoursValue = selectedPackage.maxHours === Number.POSITIVE_INFINITY ? undefined : selectedPackage.maxHours;
  const savingsText = savingsAmount
    ? t.orderPage.savingsText
        .replace("{amount}", formatCurrency(savingsAmount, locale))
        .replace("{package}", selectedPackage.label)
    : null;
  const canSubmit = (!recaptchaEnabled || Boolean(recaptchaToken)) && consentChecked;

  useEffect(() => {
    if (!recaptchaEnabled) return;
    const scriptId = "recaptcha-script";
    const renderRecaptcha = () => {
      const grecaptcha = (window as unknown as { grecaptcha?: any }).grecaptcha;
      if (!grecaptcha || !recaptchaRef.current) return;
      if (recaptchaRef.current.childElementCount > 0) return;
      grecaptcha.render(recaptchaRef.current, {
        sitekey: recaptchaSiteKey,
        callback: (token: string) => setRecaptchaToken(token),
        "expired-callback": () => setRecaptchaToken(""),
        "error-callback": () => setRecaptchaToken(""),
      });
    };

    if (document.getElementById(scriptId)) {
      renderRecaptcha();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderRecaptcha;
    document.body.appendChild(script);
  }, [recaptchaEnabled, recaptchaSiteKey]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setFormError(null);
    if (honeypot.trim()) {
      event.preventDefault();
      setFormError(t.orderPage.errors.spam);
      return;
    }
    if (mode === "package" && !validHours) {
      event.preventDefault();
      setFormError(t.orderPage.errors.hoursRequired);
      return;
    }
    if (!consentChecked) {
      event.preventDefault();
      setFormError(t.orderPage.errors.consentRequired);
      return;
    }
    if (recaptchaEnabled && !recaptchaToken) {
      event.preventDefault();
      setFormError(t.orderPage.errors.recaptcha);
      return;
    }
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      setFormError(t.orderPage.errors.requiredFields);
      form.reportValidity();
    }
  };

  return (
    <PageShell title={t.pages.order.title} lead={t.orderPage.intro}>
      <form className="space-y-6" method="post" onSubmit={handleSubmit}>
        <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">{t.orderPage.honeypotLabel}</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>
        <input type="hidden" name="formStartedAt" value={formStartedAt} />
        {recaptchaEnabled ? <input type="hidden" name="recaptchaToken" value={recaptchaToken} /> : null}

        {mode === "consultation" ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-700">{t.orderPage.consultTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{t.orderPage.consultDuration}</p>
            <input type="hidden" name="orderType" value="consultation" />
            <input type="hidden" name="package" value={t.orderPage.consultPackageValue} />
            <input type="hidden" name="durationMinutes" value="15" />
          </div>
        ) : (
          <>
            <input type="hidden" name="orderType" value="package" />
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="package" className="text-sm font-semibold text-slate-900">
                  {t.orderPage.packageLabel}
                </label>
                <select
                  id="package"
                  name="packageKey"
                  value={selectedPackageKey}
                  onChange={(event) => handlePackageChange(event.target.value as PackageOption["key"])}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {packageOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">{t.orderPage.packageHint}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="hours" className="text-sm font-semibold text-slate-900">
                  {t.orderPage.hoursLabel}
                </label>
                <input
                  id="hours"
                  name="hours"
                  type="number"
                  min={selectedPackage.minHours}
                  max={maxHoursValue}
                  step={1}
                  value={hoursInput}
                  onChange={(event) => setHoursInput(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-slate-500">{t.orderPage.hoursHint}</p>
              </div>
            </div>
          </>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">
            {mode === "consultation" ? t.orderPage.consultProcessTitle : t.orderPage.processTitle}
          </p>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            {(mode === "consultation" ? t.orderPage.consultProcessSteps : t.orderPage.processSteps).map((step) => (
              <li key={step} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {savingsText ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {savingsText}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-semibold text-slate-900">
              {t.orderPage.firstNameLabel}
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-semibold text-slate-900">
              {t.orderPage.lastNameLabel}
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-900">
            {t.orderPage.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-slate-900">
            {t.orderPage.phoneLabel}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-semibold text-slate-900">
            {t.orderPage.addressLabel}
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            autoComplete="street-address"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-semibold text-slate-900">
            {t.orderPage.notesLabel}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={5}
            placeholder={t.orderPage.notesPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {recaptchaEnabled ? <div ref={recaptchaRef} className="min-h-[78px]" /> : null}
        {formError ? (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        ) : null}

        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={consentChecked}
            onChange={(event) => setConsentChecked(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            {renderConsentText({
              text: t.orderPage.consentText,
              privacyLabel: t.orderPage.privacyLinkLabel,
              termsLabel: t.orderPage.termsLinkLabel,
            })}
          </span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "consultation" ? t.orderPage.submitConsultation : t.orderPage.submitOrder}
        </button>
      </form>
    </PageShell>
  );
};

export default OrderPage;
