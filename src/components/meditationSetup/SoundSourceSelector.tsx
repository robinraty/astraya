type SoundSource = "presets" | "creations";

// Ici on décrit les props que le composant a le droit de recevoir
type SoundSourceSelectorProps = {
  selectedSource: SoundSource;
  onSourceChange: (source: SoundSource) => void;
};

function SoundSourceSelector({
  selectedSource,
  onSourceChange,
}: SoundSourceSelectorProps) {
  return (
    <section className="px-4">
      <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
        Choose your sound
      </p>

      <div className="mt-3 grid grid-cols-2 rounded-astraya-control border border-astraya-border bg-astraya-surface/70 p-1 shadow-astraya-card">
        <button
          type="button"
          onClick={() => onSourceChange("presets")}
          className={`cursor-pointer rounded-astraya-control px-4 py-3 text-sm transition-all duration-300 ease-out ${
            selectedSource === "presets"
              ? "border border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
              : "border border-transparent text-astraya-muted hover:text-astraya-text"
          }`}
        >
          Astraya Presets
        </button>

        <button
          type="button"
          onClick={() => onSourceChange("creations")}
          className={`cursor-pointer rounded-astraya-control px-4 py-3 text-sm transition-all duration-300 ease-out ${
            selectedSource === "creations"
              ? "border border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
              : "border border-transparent text-astraya-muted hover:text-astraya-text"
          }`}
        >
          My Creations
        </button>
      </div>
    </section>
  );
}

export default SoundSourceSelector;