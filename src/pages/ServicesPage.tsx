import { useI18n } from "@/app/I18nProvider";
import { Link } from "react-router-dom";
import pythonImageWebp from "@/assets/pictures_webp/services/python.webp";
import csharpImageWebp from "@/assets/pictures_webp/services/csharp.webp";
import pythonImage from "@/assets/pictures/services/python.jpg";
import csharpImage from "@/assets/pictures/services/csharp.jpg";
import Picture from "@/components/Picture";

const ServicesPage = () => {
  const { t } = useI18n();
  const tracks = t.servicesPage.tracks.map((track, index) => ({
    ...track,
    imageWebp: index === 0 ? pythonImageWebp : csharpImageWebp,
    imageFallback: index === 0 ? pythonImage : csharpImage,
    href: index === 0 ? "/sluzby/python" : "/sluzby/csharp",
  }));

  return (
    <section className="space-y-16">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.services.title}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.servicesPage.title}</h1>
        <p className="max-w-3xl text-slate-600">{t.servicesPage.lead}</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">{t.servicesPage.mentorTitle}</h2>
          <p className="text-slate-600">{t.servicesPage.mentorText}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">{t.servicesPage.highlightsTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {t.servicesPage.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-slate-900">{t.servicesPage.tracksTitle}</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {tracks.map((track) => (
            <article key={track.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Picture
                webpSrc={track.imageWebp}
                fallbackSrc={track.imageFallback}
                alt={track.imageAlt}
                className="h-64 w-full object-cover sm:h-72 lg:h-80"
                loading="lazy"
                decoding="async"
              />
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{track.title}</h3>
                  <p className="text-sm text-slate-600">{track.subtitle}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  {track.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={track.href}
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {t.servicesPage.moreInfo}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <figure className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <blockquote className="text-lg font-medium text-slate-700">{t.servicesPage.quote.text}</blockquote>
        <figcaption className="mt-3 text-sm text-slate-500">
          {t.servicesPage.quote.author} · {t.servicesPage.quote.role}
        </figcaption>
      </figure>
    </section>
  );
};

export default ServicesPage;
