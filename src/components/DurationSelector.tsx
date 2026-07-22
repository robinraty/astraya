function DurationSelector() {
  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Duration
      </p>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          className="rounded-full border border-astraya-border px-4 py-3 text-astraya-muted transition hover:border-astraya-accent hover:text-astraya-text"
        >
          5 min
        </button>

        <button
          type="button"
          className="rounded-full border border-astraya-accent bg-astraya-accent/10 px-4 py-3 text-astraya-text shadow-astraya-glow"
        >
          10 min
        </button>

        <button
          type="button"
          className="rounded-full border border-astraya-border px-4 py-3 text-astraya-muted transition hover:border-astraya-accent hover:text-astraya-text"
        >
          30 min
        </button>
      </div>
    </section>
  );
}

export default DurationSelector;