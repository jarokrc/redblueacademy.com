import { useI18n } from "@/app/I18nProvider";
import unityVideoWebm from "@/assets/videos_webm/Csharp_video/unity.webm";
import pokemonVideoWebm from "@/assets/videos_webm/Csharp_video/pokemon.webm";
import kerbalVideoWebm from "@/assets/videos_webm/Csharp_video/Kerbal Space Program.webm";
import amongUsVideoWebm from "@/assets/videos_webm/Csharp_video/Among Us.webm";
import holoLensVideoWebm from "@/assets/videos_webm/Csharp_video/HoloLens.webm";
import unityVideoMp4 from "@/assets/videos_mp4/Csharp_video/unity.mp4";
import pokemonVideoMp4 from "@/assets/videos_mp4/Csharp_video/pokemon.mp4";
import kerbalVideoMp4 from "@/assets/videos_mp4/Csharp_video/Kerbal Space Program.mp4";
import amongUsVideoMp4 from "@/assets/videos_mp4/Csharp_video/Among Us.mp4";
import holoLensVideoMp4 from "@/assets/videos_mp4/Csharp_video/HoloLens.mp4";

const CsharpPage = () => {
  const { t } = useI18n();
  const projectVideos = [
    { webm: unityVideoWebm, mp4: unityVideoMp4 },
    { webm: pokemonVideoWebm, mp4: pokemonVideoMp4 },
    { webm: kerbalVideoWebm, mp4: kerbalVideoMp4 },
    { webm: amongUsVideoWebm, mp4: amongUsVideoMp4 },
    { webm: holoLensVideoWebm, mp4: holoLensVideoMp4 },
  ];

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.csharp.title}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.csharpPage.title}</h1>
        <p className="max-w-3xl text-slate-600">{t.csharpPage.lead}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {t.csharpPage.sections.map((section) => (
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
          <h2 className="text-2xl font-semibold text-slate-900">{t.csharpPage.timelineTitle}</h2>
          <p className="text-sm text-slate-600">{t.csharpPage.timelineNote}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {t.csharpPage.timeline.map((block) => (
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
        <h2 className="text-2xl font-semibold text-slate-900">{t.csharpPage.projectsTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.csharpPage.projects.map((project, index) => (
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

export default CsharpPage;
