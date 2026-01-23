import { useI18n } from "@/app/I18nProvider";

const StudentWorkPage = () => {
  const { t } = useI18n();
  const embedBase = "https://www.youtube-nocookie.com/embed/";

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.studentWork.title}
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{t.studentWorkPage.introTitle}</h2>
        <p className="max-w-3xl text-slate-600">{t.studentWorkPage.introText}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {t.studentWorkPage.videos.map((item) => (
          <article key={item.videoId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video w-full bg-slate-100">
              <iframe
                className="h-full w-full"
                src={`${embedBase}${item.videoId}`}
                title={`${item.name} video`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{item.subtitle}</p>
              <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
};

export default StudentWorkPage;
