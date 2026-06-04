export function SettingsPage() {
  return (
    <section>
      <p className="text-sm font-medium text-ink-muted">Settings</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Settings
      </h1>
      <div className="mt-6 rounded-2xl border border-structure bg-surface p-5">
        <h2 className="text-lg font-semibold text-ink">Privacy mode</h2>
        <p className="mt-2 text-sm text-ink-muted">
          MoneyMapper currently runs as a single-user local backend workspace.
          Keep database credentials in user secrets or environment variables.
        </p>
      </div>
    </section>
  );
}
