import { useI18n } from "@/app/I18nProvider";
import ProtectedEmail from "@/components/ProtectedEmail";

const ENCODED_EMAIL = [
  105, 110, 102, 111, 64, 114, 101, 100, 98, 108, 117, 101, 97, 99, 97, 100, 101, 109, 121, 46, 99, 111, 109,
];
const OPEN_PREFERENCES_EVENT = "rb-open-cookie-preferences";

const CookiesPage = () => {
  const { t } = useI18n();
  const [introSection, ...restSections] = t.cookiesPage.sections;

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.cookies.title}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.cookiesPage.title}</h1>
        {t.cookiesPage.intro ? <p className="max-w-3xl text-slate-600">{t.cookiesPage.intro}</p> : null}
      </header>

      <div className="space-y-8">
        {introSection ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{introSection.heading}</h2>
            {introSection.paragraphs.map((text, index) => (
              <p key={`${introSection.heading}-p-${index}`} className="text-sm text-slate-600">
                {text}
              </p>
            ))}
            {introSection.list ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {introSection.list.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}
      </div>

      <section id="cookies-controller" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{t.cookiesPage.companyTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-900">{t.cookiesPage.company.name}</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {t.cookiesPage.company.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">{t.cookiesPage.contact.title}</p>
          <ProtectedEmail encodedEmail={ENCODED_EMAIL} texts={t.cookiesPage.contact} />
        </div>
      </section>

      <div className="space-y-8">
        {restSections.map((section) => {
          const isConsentSection = section.heading.trim().startsWith("5.");
          return (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
            {section.paragraphs.map((text, index) => (
              <p key={`${section.heading}-p-${index}`} className="text-sm text-slate-600">
                {text}
              </p>
            ))}
            {section.list ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {isConsentSection ? (
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
                  }
                }}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {t.cookiesPage.preferencesCta}
              </button>
            ) : null}
          </section>
          );
        })}
      </div>

      <p className="text-sm text-slate-500">{t.cookiesPage.effectiveDate}</p>
    </section>
  );
};

export default CookiesPage;
