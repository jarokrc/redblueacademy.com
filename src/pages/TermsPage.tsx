import { useI18n } from "@/app/I18nProvider";
import ProtectedEmail from "@/components/ProtectedEmail";

const EMAIL_TOKEN = "{email}";
const ENCODED_EMAIL = [
  105, 110, 102, 111, 64, 114, 101, 100, 98, 108, 117, 101, 97, 99, 97, 100, 101, 109, 121, 46, 99, 111, 109,
];

const TermsPage = () => {
  const { t } = useI18n();

  const renderParagraph = (text: string, key: string) => {
    if (!text.includes(EMAIL_TOKEN)) {
      return (
        <p key={key} className="text-sm text-slate-600">
          {text}
        </p>
      );
    }

    const [prefix, suffix] = text.split(EMAIL_TOKEN);
    return (
      <div key={key} className="space-y-2 text-sm text-slate-600">
        {prefix ? <p>{prefix.trimEnd()}</p> : null}
        <ProtectedEmail encodedEmail={ENCODED_EMAIL} texts={t.termsPage.contact} underline />
        {suffix ? <p>{suffix.trimStart()}</p> : null}
      </div>
    );
  };

  const renderListItem = (text: string, key: string) => {
    if (!text.includes(EMAIL_TOKEN)) {
      return (
        <li key={key} className="flex items-start gap-3">
          <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
          <span>{text}</span>
        </li>
      );
    }

    const [prefix, suffix] = text.split(EMAIL_TOKEN);
    return (
      <li key={key} className="flex items-start gap-3">
        <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
        <div className="space-y-2">
          {prefix ? <p>{prefix.trimEnd()}</p> : null}
          <ProtectedEmail encodedEmail={ENCODED_EMAIL} texts={t.termsPage.contact} underline />
          {suffix ? <p>{suffix.trimStart()}</p> : null}
        </div>
      </li>
    );
  };

  const renderDetailItem = (text: string, key: string) => {
    if (!text.includes(EMAIL_TOKEN)) {
      return <li key={key}>{text}</li>;
    }

    const [prefix, suffix] = text.split(EMAIL_TOKEN);
    return (
      <li key={key} className="space-y-2">
        {prefix ? <p>{prefix.trimEnd()}</p> : null}
        <ProtectedEmail encodedEmail={ENCODED_EMAIL} texts={t.termsPage.contact} underline />
        {suffix ? <p>{suffix.trimStart()}</p> : null}
      </li>
    );
  };

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.terms.title}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.termsPage.title}</h1>
        <p className="max-w-3xl text-slate-600">{t.termsPage.intro}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{t.termsPage.companyTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-900">{t.termsPage.company.name}</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {t.termsPage.company.details.map((line, index) =>
            renderDetailItem(line, `${line}-${index}`)
          )}
        </ul>
      </section>

      <div className="space-y-8">
        {t.termsPage.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
            {section.paragraphs.map((text, index) =>
              renderParagraph(text, `${section.heading}-p-${index}`)
            )}
            {section.list ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {section.list.map((item, index) =>
                  renderListItem(item, `${section.heading}-l-${index}`)
                )}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <p className="text-sm text-slate-500">{t.termsPage.effectiveDate}</p>
    </section>
  );
};

export default TermsPage;
