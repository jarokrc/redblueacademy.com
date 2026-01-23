import type { ReactElement } from "react";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import PricingPage from "@/pages/PricingPage";
import OrderPage from "@/pages/OrderPage";
import TechnicalRequirementsPage from "@/pages/TechnicalRequirementsPage";
import StudentWorkPage from "@/pages/StudentWorkPage";
import FaqPage from "@/pages/FaqPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import PythonPage from "@/pages/PythonPage";
import CsharpPage from "@/pages/CsharpPage";
import NotFoundPage from "@/pages/NotFoundPage";

export type AppRoute = {
  path: string;
  element: ReactElement;
};

export const appRoutes: AppRoute[] = [
  { path: "/", element: <HomePage /> },
  { path: "/sluzby", element: <ServicesPage /> },
  { path: "/sluzby/python", element: <PythonPage /> },
  { path: "/sluzby/csharp", element: <CsharpPage /> },
  { path: "/cennik", element: <PricingPage /> },
  { path: "/technicke-podmienky", element: <TechnicalRequirementsPage /> },
  { path: "/objednavka", element: <OrderPage /> },
  { path: "/prace-studentov", element: <StudentWorkPage /> },
  { path: "/faq", element: <FaqPage /> },
  { path: "/zasady-ochrany-osobnych-udajov", element: <PrivacyPage /> },
  { path: "/vseobecne-obchodne-podmienky", element: <TermsPage /> },
  { path: "/cookies", element: <CookiesPage /> },
  { path: "*", element: <NotFoundPage /> },
];
