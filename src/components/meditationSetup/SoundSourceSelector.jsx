function SoundSourceSelector({
  selectedSource,
  onSourceChange,
}) {
  // Fonction qui retourne les classes du bouton
  // selon la source actuellement sélectionnée
  const getButtonClass = (source) => {
    const isSelected = selectedSource === source;

    return `
      relative flex cursor-pointer items-center justify-center border px-4 py-4
      text-sm backdrop-blur-sm transition-all duration-300 ease-out
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
        Choose your sound
      </p>

      {/* Les 2 choix partagent la largeur 50 / 50 */}
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onSourceChange("presets")}
          className={`${getButtonClass("presets")} rounded-l-astraya-control`}
        >
          Astraya Presets
        </button>

        <button
          type="button"
          onClick={() => onSourceChange("creations")}
          className={`${getButtonClass("creations")} -ml-px rounded-r-astraya-control`}
        >
          My Creations
        </button>
      </div>
    </section>
  );
}

export default SoundSourceSelector;