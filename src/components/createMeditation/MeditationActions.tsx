import { Play, Save } from "lucide-react";

function MeditationActions() {
  return (
    <section className="flex items-center justify-between gap-3">
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 px-4 py-3 text-sm text-astraya-text transition hover:bg-astraya-surface-soft"
      >
        <Play size={18} fill="currentColor" />
        <span>Preview</span>
      </button>

      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 rounded-astraya-control border border-astraya-border bg-astraya-surface/40 px-4 py-3 text-sm text-astraya-muted transition hover:border-astraya-accent hover:text-astraya-text"
      >
        <Save size={18} />
        <span>Save</span>
      </button>
    </section>
  );
}

export default MeditationActions;