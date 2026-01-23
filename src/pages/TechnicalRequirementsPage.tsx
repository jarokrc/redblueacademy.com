import { useI18n } from "@/app/I18nProvider";
import PageShell from "@/components/PageShell";

const TechnicalRequirementsPage = () => {
  const { t } = useI18n();

  return (
    <PageShell title={t.pages.tech.title} lead={t.pages.tech.lead}>
      <div className="space-y-6">
        {t.techPage.sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-slate-700">{t.techPage.note}</p>
        </section>
      </div>
    </PageShell>
  );
};

export default TechnicalRequirementsPage;
