function AtmosphereSelector() {
  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-5 shadow-astraya-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
            Atmosphere
          </p>

          <p className="mt-2 text-sm text-astraya-muted">
            Choose the foundation of your sound
          </p>
        </div>

        <button
          type="button"
          aria-label="Toggle atmosphere"
          className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
        >
          <span className="h-5 w-5 rounded-full bg-astraya-text" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-astraya-control border border-astraya-border">
        <button
          type="button"
          className="border-r border-astraya-border px-4 py-4 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
        >
          Deep
        </button>

        <button
          type="button"
          className="bg-astraya-accent/10 px-4 py-4 text-astraya-text"
        >
          Airy
        </button>
      </div>
    </section>
  );
}

export default AtmosphereSelector;