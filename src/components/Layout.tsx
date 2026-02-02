import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useI18n } from "@/app/I18nProvider";
import type { Locale } from "@/lib/locale";
import BackToTopButton from "@/components/BackToTopButton";
import Seo from "@/components/Seo";
import CookieBanner from "@/components/CookieBanner";
import logoWebp from "@/assets/logo/academy.webp";
import logoPng from "@/assets/logo/academy.png";
import Picture from "@/components/Picture";

const Layout = ({ children }: { children: ReactNode }) => {
  const { t, locale, setLocale } = useI18n();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const navItems = [
    { to: "/home", label: t.nav.home },
    { to: "/sluzby", label: t.nav.services },
    { to: "/cennik", label: t.nav.pricing },
    { to: "/prace-studentov", label: t.nav.studentWork },
    { to: "/faq", label: t.nav.faq },
  ];

  const languageOptions = [
    { value: "sk" as Locale, label: "SK" },
    { value: "en" as Locale, label: "EN" },
    { value: "de" as Locale, label: "DE" },
  ];

  const seoMap = [
    { path: "/home", title: t.pages.home.title, description: t.pages.home.lead },
    { path: "/sluzby", title: t.pages.services.title, description: t.pages.services.lead },
    { path: "/cennik", title: t.pages.pricing.title, description: t.pages.pricing.lead },
    { path: "/technicke-podmienky", title: t.pages.tech.title, description: t.pages.tech.lead },
    { path: "/kontakt", title: t.pages.order.title, description: t.pages.order.lead },
    { path: "/objednavka", title: t.pages.order.title, description: t.pages.order.lead },
    { path: "/prace-studentov", title: t.pages.studentWork.title, description: t.pages.studentWork.lead },
    { path: "/faq", title: t.pages.faq.title, description: t.pages.faq.lead },
    { path: "/zasady-ochrany-osobnych-udajov", title: t.pages.privacy.title, description: t.pages.privacy.lead },
    { path: "/vseobecne-obchodne-podmienky", title: t.pages.terms.title, description: t.pages.terms.lead },
    { path: "/cookies", title: t.pages.cookies.title, description: t.pages.cookies.lead },
    { path: "/sluzby/python", title: t.pages.python.title, description: t.pages.python.lead },
    { path: "/sluzby/csharp", title: t.pages.csharp.title, description: t.pages.csharp.lead },
  ];

  const currentSeo = seoMap.find((item) => item.path === location.pathname);
  const defaultTitle = t.meta.title;
  const defaultDescription = t.meta.description;
  const pageTitle = currentSeo
    ? currentSeo.path === "/"
      ? defaultTitle
      : `${currentSeo.title} | ${defaultTitle}`
    : defaultTitle;
  const pageDescription = currentSeo?.description || defaultDescription;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-1 py-1 text-sm font-medium text-slate-800 transition hover:text-blue-700 hover:underline hover:underline-offset-8 ${
      isActive ? "text-blue-700 underline underline-offset-8" : ""
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-slate-100 text-blue-700" : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
    }`;

  const LanguagePicker = ({ fullWidth = false }: { fullWidth?: boolean }) => {
    const [open, setOpen] = useState(false);
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!open) return;
      const handleClick = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      const handleKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
      return () => {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleKey);
      };
    }, [open]);

    const active = languageOptions.find((option) => option.value === locale) ?? languageOptions[0];
    const buttonClass = fullWidth
      ? "flex w-full items-center justify-between rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-sm font-semibold leading-none text-slate-900 shadow-md"
      : "inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-sm font-semibold leading-none text-slate-900 shadow-md";
    const listClass = fullWidth
      ? "absolute left-0 top-full z-20 mt-2 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
      : "absolute right-0 top-full z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg";

    return (
      <div ref={containerRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-expanded={open}
          aria-label="Select language"
          onClick={() => setOpen((prev) => !prev)}
          className={buttonClass}
        >
          <span>{active.label}</span>
        </button>

        {open ? (
          <ul id={listId} role="listbox" className={listClass}>
            {languageOptions.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === locale}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-sm transition ${
                    option.value === locale ? "bg-slate-100 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Seo title={pageTitle} description={pageDescription} path={location.pathname} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center gap-6">
            <Link to="/home" className="flex items-center gap-3">
              <Picture
                webpSrc={logoWebp}
                fallbackSrc={logoPng}
                alt="RedBlue Academy logo"
                className="h-10 w-auto"
              />
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 lg:inline whitespace-nowrap">
                Think Forward. Think Beyond Code.
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-6 md:flex" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto hidden items-center gap-2 md:flex">
              <LanguagePicker />
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="ml-auto inline-flex items-center justify-center rounded border border-slate-300 bg-white p-2 text-slate-700 md:hidden"
            >
              <span className="sr-only">Menu</span>
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="h-0.5 w-6 bg-slate-700" />
                <span className="h-0.5 w-6 bg-slate-700" />
                <span className="h-0.5 w-6 bg-slate-700" />
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
            <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-slate-200 px-6 py-4">
              <LanguagePicker />
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div className="order-1 flex flex-wrap items-center gap-x-4 gap-y-2 md:order-2 md:justify-end">
              <Link to="/zasady-ochrany-osobnych-udajov" className="hover:text-blue-700">
                {t.footer.privacy}
              </Link>
              <Link to="/vseobecne-obchodne-podmienky" className="hover:text-blue-700">
                {t.footer.terms}
              </Link>
              <Link to="/cookies" className="hover:text-blue-700">
                {t.footer.cookies}
              </Link>
            </div>
            <div className="order-last w-full flex flex-col-reverse gap-1 md:order-1 md:w-auto md:flex-row md:items-center md:gap-3">
              <p>{"\u00A9"} 2026 academy.redblue.sk</p>
              <a
                href="https://www.redblue.sk"
                className="inline-flex font-medium text-slate-600 hover:text-blue-700"
                target="_blank"
                rel="noreferrer"
              >
                www.redblue.sk
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
      <BackToTopButton />
    </div>
  );
};

export default Layout;
