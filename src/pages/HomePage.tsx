import { useI18n } from "@/app/I18nProvider";
import introVideoWebm from "@/assets/intro/intro1.webm";
import introVideoMp4 from "@/assets/intro/intro1.mp4";
import spotlightImageWebp from "@/assets/pictures_webp/pic5.webp";
import spotlightImage from "@/assets/pictures/pic5.jpg";
import Picture from "@/components/Picture";

const HomePage = () => {
  const { t } = useI18n();

  return (
    <>
      <section className="space-y-16">
        <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-10 w-screen overflow-hidden bg-slate-900">
        <div className="absolute inset-0" aria-hidden="true">
          <video
            className="h-full w-full object-cover object-[70%_50%] md:object-[50%_25%] xl:object-[50%_20%] 2xl:object-[50%_15%]"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={introVideoWebm} type="video/webm" />
            <source src={introVideoMp4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center text-white sm:py-24 md:min-h-[75vh] md:justify-center md:py-0 lg:min-h-[85vh]">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t.home.heading}
          </h1>

          <ul className="mt-6 space-y-2 text-sm sm:text-base">
            {t.home.bullets.map((item) => (
              <li key={item} className="flex items-center justify-center gap-3">
                <span className="h-2 w-2 rounded-full bg-white/80" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid w-full gap-4 text-left md:grid-cols-3">
            {t.home.cards.map((card) => (
              <article key={card.title} className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-white/80">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {t.home.spotlight.title}
            </h2>
            <p className="text-slate-600">{t.home.spotlight.lead}</p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              {t.home.spotlight.communityTitle}
            </h3>
            <p className="text-sm text-slate-600">{t.home.spotlight.communityText}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              {t.home.spotlight.reasonsTitle}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {t.home.spotlight.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-lg">
          <Picture
            webpSrc={spotlightImageWebp}
            fallbackSrc={spotlightImage}
            alt={t.home.spotlight.imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>
      </section>
    </>
  );
};

export default HomePage;
