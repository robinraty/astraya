function PitchSelector({ selectedPitch, setSelectedPitch }) {
  const getButtonClass = (pitch) => {
    const isSelected = selectedPitch === pitch;

    return `
      relative cursor-pointer border px-4 py-4
      backdrop-blur-sm transition-all duration-300 ease-out
      ${
        isSelected
          ? "z-10 border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
          : "border-astraya-border bg-astraya-surface/20 text-astraya-muted hover:bg-astraya-surface-soft/60 hover:text-astraya-text"
      }
    `;
  };

  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Pitch / Mood
      </p>

      <div className="grid grid-cols-3">
        <button
          type="button"
          onClick={() => setSelectedPitch("dark")}
          className={`${getButtonClass("dark")} rounded-l-astraya-control`}
        >
          Dark
        </button>

        <button
          type="button"
          onClick={() => setSelectedPitch("natural")}
          className={`${getButtonClass("natural")} -ml-px`}
        >
          Natural
        </button>

        <button
          type="button"
          onClick={() => setSelectedPitch("bright")}
          className={`${getButtonClass("bright")} -ml-px rounded-r-astraya-control`}
        >
          Bright
        </button>
      </div>
    </section>
  );
}

export default PitchSelector;