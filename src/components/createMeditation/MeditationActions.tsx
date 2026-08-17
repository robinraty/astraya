import { useState } from "react";
import { Pause, Play, Save } from "lucide-react";

function MeditationActions() {
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  return (
    <section className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
        className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-astraya-control px-4 py-3 text-sm text-astraya-text transition ${
          isPreviewPlaying
            ? "previewPlaying"
            : "border border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {isPreviewPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}

          <span>{isPreviewPlaying ? "Pause" : "Preview"}</span>
        </span>
      </button>

      <button
        type="button"
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-astraya-control border border-astraya-border bg-astraya-surface/40 px-4 py-3 text-sm text-astraya-muted transition hover:border-astraya-accent hover:bg-astraya-accent/10 hover:text-astraya-text hover:shadow-astraya-selected"
      >
        <Save size={18} strokeWidth={1.5} />
        <span>Save</span>
      </button>
    </section>
  );
}

export default MeditationActions;