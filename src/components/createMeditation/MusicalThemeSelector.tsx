import { useState } from "react";

function MusicalThemeSelector() {
  // Toggle general de la section Musical Theme
  const [isMusicalThemeEnabled, setIsMusicalThemeEnabled] = useState(true);

  // Quand je clique sur le bouton du theme musical :
  // si Musical Theme etait OFF, je le reactive automatiquement
  //
  // Plus tard, cette fonction pourra aussi ouvrir le choix
  // entre plusieurs themes musicaux
  const handleMusicalThemeSelect = () => {
    setIsMusicalThemeEnabled(true);
  };

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Musical Theme
        </p>

        {/* Toggle general de la section Musical Theme */}
        <button
          type="button"
          aria-label="Toggle musical theme"
          onClick={() => setIsMusicalThemeEnabled(!isMusicalThemeEnabled)}
          className={`relative h-7 w-12 cursor-pointer rounded-full border transition-all duration-300 ease-out ${
            isMusicalThemeEnabled
              ? "border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
              : "border-astraya-border bg-astraya-surface-soft shadow-none"
          }`}
        >
          {/* Petit rond blanc du toggle qui glisse entre OFF et ON */}
          <span
            className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-astraya-text transition-transform duration-300 ease-out ${
              isMusicalThemeEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Bouton qui represente le theme musical actuellement choisi */}
      <button
        type="button"
        onClick={handleMusicalThemeSelect}
        className={`mt-4 flex w-full cursor-pointer items-center gap-3 rounded-astraya-control border p-3 text-left transition-all duration-300 ease-out ${
          isMusicalThemeEnabled
            ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
            : "border-astraya-border bg-astraya-surface-soft text-astraya-muted opacity-60 shadow-none"
        }`}
      >
        {/* Artwork du theme musical actuellement selectionne */}
        <img
          src={`${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-moon-piano.png`}
          alt="Moon Piano"
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />

        {/* Informations du theme musical */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium transition-colors duration-300 ease-out ${
              isMusicalThemeEnabled
                ? "text-astraya-text"
                : "text-astraya-muted"
            }`}
          >
            Moon Piano
          </p>

          <p className="mt-1 text-xs text-astraya-muted">
            Soft and minimal piano phrases
          </p>
        </div>

        {/* Fleche qui indique qu'on pourra choisir un autre theme */}
        <span
          className={`shrink-0 text-xl transition-colors duration-300 ease-out ${
            isMusicalThemeEnabled
              ? "text-astraya-accent-light"
              : "text-astraya-muted"
          }`}
        >
          ›
        </span>
      </button>
    </section>
  );
}

export default MusicalThemeSelector;