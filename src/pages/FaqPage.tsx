import { useI18n } from "@/app/I18nProvider";
import PageShell from "@/components/PageShell";

const FaqPage = () => {
  const { t } = useI18n();

  return (
    <PageShell title={t.pages.faq.title}>
      <section className="space-y-10">
        <p className="max-w-3xl text-slate-600">{t.faqPage.introText}</p>

        <div className="space-y-4">
          {t.faqPage.items.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Otázka {index + 1}
                  </p>
                  <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                </div>
                <span
                  className="mt-2 text-sm text-slate-400 transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default FaqPage;
