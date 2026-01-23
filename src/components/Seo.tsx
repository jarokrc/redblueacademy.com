import { Helmet } from "react-helmet-async";
import { useI18n } from "@/app/I18nProvider";
import type { Locale } from "@/lib/locale";
import ogImage from "@/assets/pictures/pic5.jpg";

const SITE_URL = "https://www.redblueacademy.com";
const SUPPORTED_LOCALES: Locale[] = ["sk", "en", "de"];

type SeoProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

const normalizePath = (path: string) => {
  if (!path) return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (withSlash === "/") return "/";
  return withSlash.replace(/\/+$/, "");
};

const Seo = ({ title, description, path, noindex = false }: SeoProps) => {
  const { locale } = useI18n();
  const normalizedPath = normalizePath(path);
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const robots = noindex ? "noindex,nofollow" : "index,follow";

  const alternates = SUPPORTED_LOCALES.map((lng) => ({
    hrefLang: lng,
    href: `${SITE_URL}${normalizedPath}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RedBlue Academy",
    url: SITE_URL,
    logo: `${SITE_URL}${ogImage}`,
    image: `${SITE_URL}${ogImage}`,
  };

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robots} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="RedBlue Academy" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />

      {alternates.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default Seo;
