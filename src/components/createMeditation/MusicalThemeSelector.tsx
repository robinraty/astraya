function MusicalThemeSelector() {
  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Musical Theme
        </p>

        <button
          type="button"
          aria-label="Toggle musical theme"
          className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
        >
          <span className="h-5 w-5 rounded-full bg-astraya-text" />
        </button>
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-between gap-4 rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 px-4 py-3 text-left transition hover:bg-astraya-surface-soft"
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