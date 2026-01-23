import { Link } from "react-router-dom";
import { useI18n } from "@/app/I18nProvider";
import PageShell from "@/components/PageShell";

const NotFoundPage = () => {
  const { t } = useI18n();
  return (
    <PageShell title={t.pages.notFound.title} lead={t.pages.notFound.lead}>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        {t.pages.notFound.back}
      </Link>
    </PageShell>
  );
};

export default NotFoundPage;
