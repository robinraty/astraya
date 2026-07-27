function MusicalThemeSelector() {
  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-5 shadow-astraya-card">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Musical Theme
        </p>

        <p className="mt-2 text-sm text-astraya-muted">
          Choose a musical layer
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 px-4 py-4 text-left transition hover:bg-astraya-surface-soft"
      >
        <div>
          <p className="text-sm font-medium text-astraya-text">
            Moon Piano
          </p>

          <p className="mt-1 text-xs text-astraya-muted">
            Soft and minimal piano phrases
          </p>
        </div>

        <span className="text-xl text-astraya-accent-light">
          ›
        </span>
      </button>
    </section>
  );
}

export default MusicalThemeSelector;