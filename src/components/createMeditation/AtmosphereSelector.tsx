import { AudioWaveform, Wind } from "lucide-react";

function AtmosphereSelector() {
  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Atmosphere
        </p>

        <button
          type="button"
          aria-label="Toggle atmosphere"
          className="flex h-7 w-12 items-center justify-end rounded-full border border-astraya-accent bg-astraya-accent/20 p-1 shadow-astraya-glow"
        >
          <span className="h-5 w-5 rounded-full bg-astraya-text" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-astraya-control border border-astraya-border">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border-r border-astraya-border px-4 py-3 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
        >
          <AudioWaveform size={18} strokeWidth={1.5} />
          <span>Deep</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-astraya-accent/10 px-4 py-3 text-astraya-text"
        >
          <Wind size={18} strokeWidth={1.5} />
          <span>Airy</span>
        </button>
      </div>
    </section>
  );
}

export default AtmosphereSelector;