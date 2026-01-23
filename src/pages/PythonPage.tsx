import { useI18n } from "@/app/I18nProvider";
import instagramVideoWebm from "@/assets/videos_webm/python_video/instagram.webm";
import youtubeVideoWebm from "@/assets/videos_webm/python_video/youtube.webm";
import spotifyVideoWebm from "@/assets/videos_webm/python_video/spotify.webm";
import telescopeVideoWebm from "@/assets/videos_webm/python_video/telescope.webm";
import medicVideoWebm from "@/assets/videos_webm/python_video/medic.webm";
import instagramVideoMp4 from "@/assets/videos_mp4/python_video/instagram.mp4";
import youtubeVideoMp4 from "@/assets/videos_mp4/python_video/youtube.mp4";
import spotifyVideoMp4 from "@/assets/videos_mp4/python_video/spotify.mp4";
import telescopeVideoMp4 from "@/assets/videos_mp4/python_video/telescope.mp4";
import medicVideoMp4 from "@/assets/videos_mp4/python_video/medic.mp4";

const PythonPage = () => {
  const { t } = useI18n();
  const projectVideos = [
    { webm: instagramVideoWebm, mp4: instagramVideoMp4 },
    { webm: youtubeVideoWebm, mp4: youtubeVideoMp4 },
    { webm: spotifyVideoWebm, mp4: spotifyVideoMp4 },
    { webm: telescopeVideoWebm, mp4: telescopeVideoMp4 },
    { webm: medicVideoWebm, mp4: medicVideoMp4 },
  ];

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.python.title}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.pythonPage.title}</h1>
        <p className="max-w-3xl text-slate-600">{t.pythonPage.lead}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {t.pythonPage.sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">{t.pythonPage.timelineTitle}</h2>
          <p className="text-sm text-slate-600">{t.pythonPage.timelineNote}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {t.pythonPage.timeline.map((block) => (
            <article key={block.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">{block.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {block.duration}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">{t.pythonPage.projectsTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.pythonPage.projects.map((project, index) => (
            <article key={project.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <video
                className="h-44 w-full object-cover sm:h-48"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={projectVideos[index].webm} type="video/webm" />
                <source src={projectVideos[index].mp4} type="video/mp4" />
              </video>
              <div className="p-5">
                <h3 className="text-base font-semibold text-slate-900">{project.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{project.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default PythonPage;
