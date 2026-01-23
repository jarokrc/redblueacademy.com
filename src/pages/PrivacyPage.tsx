import { useI18n } from "@/app/I18nProvider";
import { Link } from "react-router-dom";
import ProtectedEmail from "@/components/ProtectedEmail";

const ENCODED_EMAIL = [
  105, 110, 102, 111, 64, 114, 101, 100, 98, 108, 117, 101, 97, 99, 97, 100, 101, 109, 121, 46, 99, 111, 109,
];
const CONTROLLER_LINK_TOKEN = "{controller_link}";
const COOKIES_LINK_TOKEN = "{cookies_link}";

const PrivacyPage = () => {
  const { t } = useI18n();

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.privacy.title}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.privacyPage.title}</h1>
        <p className="max-w-3xl text-slate-600">{t.privacyPage.intro}</p>
      </header>

      <section id="privacy-controller" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{t.privacyPage.companyTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-900">{t.privacyPage.company.name}</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {t.privacyPage.company.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">{t.privacyPage.contact.title}</p>
          <ProtectedEmail encodedEmail={ENCODED_EMAIL} texts={t.privacyPage.contact} />
        </div>
      </section>

      <div className="space-y-8">
        {t.privacyPage.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
            {section.paragraphs.map((text, index) => {
              const key = `${section.heading}-p-${index}`;
              if (text.includes(COOKIES_LINK_TOKEN)) {
                const [prefix, suffix] = text.split(COOKIES_LINK_TOKEN);
                return (
                  <p key={key} className="text-sm text-slate-600">
                    {prefix}
                    <Link to="/cookies" className="font-semibold text-blue-600 hover:text-blue-700">
                      {t.privacyPage.cookiesLinkLabel}
                    </Link>
                    {suffix}
                  </p>
                );
              }
              if (!text.includes(CONTROLLER_LINK_TOKEN)) {
                return (
                  <p key={key} className="text-sm text-slate-600">
                    {text}
                  </p>
                );
              }
              const [prefix, suffix] = text.split(CONTROLLER_LINK_TOKEN);
              return (
                <p key={key} className="text-sm text-slate-600">
                  {prefix}
                  <a href="#privacy-controller" className="font-semibold text-blue-600 hover:text-blue-700">
                    {t.privacyPage.controllerLinkLabel}
                  </a>
                  {suffix}
                </p>
              );
            })}
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
          </section>
        ))}
      </div>

      <p className="text-sm text-slate-500">{t.privacyPage.effectiveDate}</p>
    </section>
  );
};

export default PrivacyPage;
