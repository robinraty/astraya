function NatureSoundsMixer() {
  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Nature Sounds
        </p>

        <p className="mt-2 text-sm text-astraya-muted">
          Add natural layers to your meditation
        </p>
      </div>

      <div className="space-y-4">
        {/* RAIN */}
        <div className="grid grid-cols-[70px_1fr_45px_48px] items-center gap-3">
          <p className="text-sm text-astraya-text">Rain</p>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="35"
            className="w-full cursor-pointer accent-astraya-accent"
          />

          <p className="text-right text-sm text-astraya-muted">35%</p>

          <button
            type="button"
            aria-label="Toggle rain"
            className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* FOREST */}
        <div className="grid grid-cols-[70px_1fr_45px_48px] items-center gap-3">
          <p className="text-sm text-astraya-text">Forest</p>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="20"
            className="w-full cursor-pointer accent-astraya-accent"
          />

          <p className="text-right text-sm text-astraya-muted">20%</p>

          <button
            type="button"
            aria-label="Toggle forest"
            className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* BIRDS */}
        <div className="grid grid-cols-[70px_1fr_45px_48px] items-center gap-3">
          <p className="text-sm text-astraya-text">Birds</p>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="25"
            className="w-full cursor-pointer accent-astraya-accent"
          />

          <p className="text-right text-sm text-astraya-muted">25%</p>

          <button
            type="button"
            aria-label="Toggle birds"
            className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* RIVER */}
        <div className="grid grid-cols-[70px_1fr_45px_48px] items-center gap-3">
          <p className="text-sm text-astraya-text">River</p>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            className="w-full cursor-pointer accent-astraya-accent opacity-40"
          />

          <p className="text-right text-sm text-astraya-muted">0%</p>

          <button
            type="button"
            aria-label="Toggle river"
            className="flex h-7 w-12 items-center justify-start rounded-full border border-astraya-border bg-astraya-surface-soft p-1"
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* WAVES */}
        <div className="grid grid-cols-[70px_1fr_45px_48px] items-center gap-3">
          <p className="text-sm text-astraya-text">Waves</p>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="40"
            className="w-full cursor-pointer accent-astraya-accent"
          />

          <p className="text-right text-sm text-astraya-muted">40%</p>

          <button
            type="button"
            aria-label="Toggle waves"
            className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default NatureSoundsMixer;