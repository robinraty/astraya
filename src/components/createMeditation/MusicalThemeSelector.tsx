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
          {/*
            Petit rond blanc du toggle.

            top-1/2 = on place le rond a 50% de la hauteur du bouton
            -translate-y-1/2 = on le remonte ensuite de la moitie de sa propre hauteur

            Donc il est vraiment centre verticalement.

            Pour le mouvement horizontal :
            translate-x-0 = OFF
            translate-x-5 = ON

            transition-transform + duration-300 =
            le rond glisse doucement au lieu de changer de cote instantanement.
          */}
          <span
            className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-astraya-text transition-transform duration-300 ease-out ${
              isMusicalThemeEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/*
        Bouton qui represente le theme musical actuellement choisi.

        Pour le moment il affiche toujours Moon Piano.

        Si Musical Theme est OFF et que je clique ici,
        il se reactive automatiquement.

        Plus tard, le click pourra aussi ouvrir
        le choix entre plusieurs themes musicaux.
      */}
      <button
        type="button"
        onClick={handleMusicalThemeSelect}
        className={`mt-4 flex w-full cursor-pointer items-center justify-between gap-4 rounded-astraya-control border px-4 py-3 text-left transition-all duration-300 ease-out ${
          isMusicalThemeEnabled
            ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
            : "border-astraya-border bg-astraya-surface-soft text-astraya-muted opacity-60 shadow-none"
        }`}
      >
        <div>
          {/*
            Le titre devient plus discret quand Musical Theme est OFF.
            transition-colors evite un changement de couleur brutal.
          */}
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

        {/*
          Fleche qui indique qu'on pourra choisir un autre theme.
          Elle s'attenue aussi quand Musical Theme est OFF.
        */}
        <span
          className={`text-xl transition-colors duration-300 ease-out ${
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