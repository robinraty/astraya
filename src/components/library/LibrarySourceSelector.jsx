function LibrarySourceSelector({
  selectedSource,
  onSourceChange,
}) {
  const getButtonClass = (source) => {
    const isSelected = selectedSource === source;

    return `
      relative cursor-pointer border px-4 py-3
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
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onSourceChange("creations")}
          className={`${getButtonClass("creations")} rounded-l-astraya-control`}
        >
          My Creations
        </button>

        <button
          type="button"
          onClick={() => onSourceChange("presets")}
          className={`${getButtonClass("presets")} -ml-px rounded-r-astraya-control`}
        >
          Astraya Presets
        </button>
      </div>
    </section>
  );
}

export default LibrarySourceSelector;