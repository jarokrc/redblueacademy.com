import skCommon from "./sk/common";
import skHome from "./sk/home";
import skServices from "./sk/services";
import skPython from "./sk/python";
import skCsharp from "./sk/csharp";
import skPricing from "./sk/pricing";
import skTech from "./sk/tech";
import skStudentWork from "./sk/studentWork";
import skFaq from "./sk/faq";
import skPrivacy from "./sk/privacy";
import skTerms from "./sk/terms";
import skCookies from "./sk/cookies";
import skNotFound from "./sk/notFound";
import enCommon from "./en/common";
import enHome from "./en/home";
import enServices from "./en/services";
import enPython from "./en/python";
import enCsharp from "./en/csharp";
import enPricing from "./en/pricing";
import enTech from "./en/tech";
import enStudentWork from "./en/studentWork";
import enFaq from "./en/faq";
import enPrivacy from "./en/privacy";
import enTerms from "./en/terms";
import enCookies from "./en/cookies";
import enNotFound from "./en/notFound";
import deCommon from "./de/common";
import deHome from "./de/home";
import deServices from "./de/services";
import dePython from "./de/python";
import deCsharp from "./de/csharp";
import dePricing from "./de/pricing";
import deTech from "./de/tech";
import deStudentWork from "./de/studentWork";
import deFaq from "./de/faq";
import dePrivacy from "./de/privacy";
import deTerms from "./de/terms";
import deCookies from "./de/cookies";
import deNotFound from "./de/notFound";
import type { Translation } from "./types";

type AnyRecord = Record<string, unknown>;

const isObject = (value: unknown): value is AnyRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepMerge = (target: AnyRecord, source: AnyRecord) => {
  const result: AnyRecord = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = result[key];
    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  });
  return result;
};

const merge = (...parts: AnyRecord[]) => parts.reduce((acc, part) => deepMerge(acc, part), {} as AnyRecord);

export const translations: Record<string, Translation> = {
  sk: merge(
    skCommon,
    skHome,
    skServices,
    skPython,
    skCsharp,
    skPricing,
    skTech,
    skStudentWork,
    skFaq,
    skPrivacy,
    skTerms,
    skCookies,
    skNotFound
  ) as Translation,
  en: merge(
    enCommon,
    enHome,
    enServices,
    enPython,
    enCsharp,
    enPricing,
    enTech,
    enStudentWork,
    enFaq,
    enPrivacy,
    enTerms,
    enCookies,
    enNotFound
  ) as Translation,
  de: merge(
    deCommon,
    deHome,
    deServices,
    dePython,
    deCsharp,
    dePricing,
    deTech,
    deStudentWork,
    deFaq,
    dePrivacy,
    deTerms,
    deCookies,
    deNotFound
  ) as Translation,
};
