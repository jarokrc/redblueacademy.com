import { useI18n } from "@/app/I18nProvider";
import Picture from "@/components/Picture";
import doucovatelImageWebp from "@/assets/pictures_webp/prices/doucovatel.webp";
import studentImageWebp from "@/assets/pictures_webp/prices/student.webp";
import profesionalImageWebp from "@/assets/pictures_webp/prices/profesional.webp";
import doucovatelImage from "@/assets/pictures/prices/doucovatel.jpg";
import studentImage from "@/assets/pictures/prices/student.jpg";
import profesionalImage from "@/assets/pictures/prices/profesional.jpg";

const PricingPage = () => {
  const { t } = useI18n();
  const packageImagesWebp = [doucovatelImageWebp, studentImageWebp, profesionalImageWebp];
  const packageImagesFallback = [doucovatelImage, studentImage, profesionalImage];
  const packages = t.pricingPage.packages.map((item, index) => ({
    ...item,
    imageWebp: packageImagesWebp[index] ?? packageImagesWebp[0],
    imageFallback: packageImagesFallback[index] ?? packageImagesFallback[0],
  }));

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pages.pricing.title}
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{t.pricingPage.introTitle}</h2>
        <p className="max-w-3xl text-slate-600">{t.pricingPage.introText}</p>
      </header>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {t.pricingPage.ruleTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-700">{t.pricingPage.ruleText}</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">{t.pricingPage.packagesTitle}</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pack) => (
            <article
              key={pack.name}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Picture
                  webpSrc={pack.imageWebp}
                  fallbackSrc={pack.imageFallback}
                  alt={pack.imageAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex h-full flex-col gap-4 p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{pack.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-slate-900">{pack.price}</span>
                    <span className="text-sm text-slate-500">{pack.priceNote}</span>
                  </div>
                  <p className="text-sm text-slate-600">{pack.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  {pack.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600/70" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-slate-700">{pack.note}</p>
                <button
                  type="button"
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {pack.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{t.pricingPage.roiTitle}</h2>
        <p className="mt-2 text-slate-600">{t.pricingPage.roiText}</p>
        <p className="mt-4 text-sm font-medium text-slate-700">{t.pricingPage.roiNote}</p>
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {t.pricingPage.consultCta}
        </button>
      </section>
    </section>
  );
};

export default PricingPage;
