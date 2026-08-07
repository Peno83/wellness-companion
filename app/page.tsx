const disabledCapabilities = [
  "External connectors",
  "AI",
  "Scoring",
  "Personal health data",
];

export default function PlatformStatusPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-semibold tracking-widest text-cyan-800 uppercase">
          Phase 2A.1
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Synthetic platform foundation
        </h1>
        <p className="max-w-2xl text-lg text-neutral-600">
          The governance-first modular foundation is running. This environment
          accepts synthetic fixtures only and has no live health-platform
          connections.
        </p>
      </header>

      <section
        className="rounded-xl border bg-white p-6 shadow-sm"
        aria-labelledby="status-heading"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="status-heading" className="text-xl font-medium">
            Platform status
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Operational
          </span>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-neutral-500">Data mode</dt>
            <dd className="font-medium">Synthetic only</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Health endpoint</dt>
            <dd>
              <a
                className="font-medium text-cyan-800 underline"
                href="/api/health"
              >
                /api/health
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="disabled-heading">
        <h2 id="disabled-heading" className="text-lg font-medium">
          Intentionally disabled
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {disabledCapabilities.map((capability) => (
            <li
              className="rounded-lg border bg-white px-4 py-3 text-neutral-700"
              key={capability}
            >
              {capability}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
