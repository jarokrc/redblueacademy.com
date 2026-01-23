import type { ReactNode } from "react";

const PageShell = ({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) => (
  <section className="space-y-6">
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {lead ? <p className="max-w-2xl text-slate-600">{lead}</p> : null}
    </header>
    {children}
  </section>
);

export default PageShell;
