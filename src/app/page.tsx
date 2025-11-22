import Link from 'next/link';

export default function Home() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 px-4 py-20 text-center">
        <span className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Real Estate Solutions
        </span>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Real Estate Property Management & Sharing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Empower your internal realty teams to upload, manage, and share property portfolios with clients in seconds.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/login" className="btn-primary px-8 py-3 text-base">
            Login to Dashboard
          </Link>
          <a
            href="https://github.com/Deepsen7744/Real-Estate-Property-Management-Sharing-Tool_1"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-8 py-3 text-base"
          >
            View GitHub Repo
          </a>
        </div>
        {/* <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-soft md:grid-cols-3">
          {[
            { title: 'Role-aware access', body: 'Admin, residential, and commercial employee flows.' },
            { title: 'Instant share links', body: 'Public pages hosted at /p/:id for quick client sharing.' },
            { title: 'Insights ready', body: 'Dashboard cards, filters, and analytics-friendly APIs.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-500">{item.body}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
