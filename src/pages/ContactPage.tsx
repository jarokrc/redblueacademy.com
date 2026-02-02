import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/app/I18nProvider";
import PageShell from "@/components/PageShell";
import ProtectedEmail from "@/components/ProtectedEmail";

const ENCODED_EMAIL = [
  115, 116, 117, 100, 101, 110, 116, 105, 64, 114, 101, 100, 98, 108, 117, 101, 46, 115, 107,
];

const ContactPage = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "consultation" ? "consultation" : "package";
  const packageKey = searchParams.get("package");

  const selectedPackage = useMemo(() => {
    if (!packageKey) return null;
    const packageKeys = ["doucovatel", "student", "profesional"] as const;
    const index = packageKeys.indexOf(packageKey as (typeof packageKeys)[number]);
    return index >= 0 ? t.pricingPage.packages[index]?.name || null : null;
  }, [packageKey, t.pricingPage.packages]);

  return (
    <PageShell title={t.contactPage.title} lead={t.contactPage.lead}>
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            {mode === "consultation"
              ? t.contactPage.consultationLabel
              : selectedPackage
                ? t.contactPage.packageLabel.replace("{package}", selectedPackage)
                : t.contactPage.packageFallback}
          </p>
          <p className="mt-2 text-sm text-slate-600">{t.contactPage.notice}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{t.contactPage.processTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {t.contactPage.processSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ProtectedEmail
            encodedEmail={ENCODED_EMAIL}
            texts={t.contactPage.contact}
            buttonClassName="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
            underline
          />
        </div>
      </section>
    </PageShell>
  );
};

export default ContactPage;
