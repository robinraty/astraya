import { useState } from "react";
import { Moon, Wind } from "lucide-react";

function AtmosphereSelector() {
  // Atmosphere actuellement selectionnee
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("airy");

  // Toggle general de la section Atmosphere
  const [isAtmosphereEnabled, setIsAtmosphereEnabled] = useState(true);

  // Quand je clique sur Deep ou Airy :
  // 1. je selectionne l'atmosphere
  // 2. si Atmosphere etait OFF, je le reactive automatiquement
  const handleAtmosphereSelect = (atmosphere: string) => {
    setSelectedAtmosphere(atmosphere);
    setIsAtmosphereEnabled(true);
  };

  // Fonction qui retourne les classes du bouton Deep ou Airy
  const getButtonClass = (atmosphere: string) => {
    const isSelected = selectedAtmosphere === atmosphere;

    // Si toute la section Atmosphere est OFF,
    // les 2 boutons restent visibles mais paraissent desactives
    if (!isAtmosphereEnabled) {
      return `
        relative flex cursor-pointer items-center justify-center gap-2 border
        border-astraya-border bg-astraya-surface-soft px-4 py-3
        text-astraya-muted opacity-60 transition-all duration-300 ease-out
      `;
    }

    // Si Atmosphere est ON :
    // le bouton selectionne prend le border + glow bleu
    // l'autre reste plus discret
    return `
      relative flex cursor-pointer items-center justify-center gap-2 border px-4 py-3
      transition-all duration-300 ease-out
      ${
        isSelected
          ? "z-10 border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
          : "border-astraya-border text-astraya-muted hover:bg-astraya-surface-soft hover:text-astraya-text"
      }
    `;
  };

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Atmosphere
        </p>

        {/* Toggle general de la section */}
        <button
          type="button"
          aria-label="Toggle atmosphere"
          onClick={() => setIsAtmosphereEnabled(!isAtmosphereEnabled)}
          className={`relative h-7 w-12 cursor-pointer rounded-full border transition-all duration-300 ease-out ${
            isAtmosphereEnabled
              ? "border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
              : "border-astraya-border bg-astraya-surface-soft shadow-none"
          }`}
        >
          {/*
            Petit rond blanc du toggle.

            top-1/2 = son point de depart est place a 50% de la hauteur du bouton
            -translate-y-1/2 = on remonte ensuite le rond de la moitie de SA propre hauteur

            Donc le rond est vraiment centre verticalement.

            Pour gauche / droite :
            translate-x-0 = OFF
            translate-x-5 = ON

            La transition-transform fait glisser le rond en 300ms.
          */}
          <span
            className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-astraya-text transition-transform duration-300 ease-out ${
              isAtmosphereEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Les 2 choix Deep / Airy partagent la largeur 50 / 50 */}
      <div className="mt-4 grid grid-cols-2">
        <button
          type="button"
          onClick={() => handleAtmosphereSelect("deep")}
          className={`${getButtonClass("deep")} rounded-l-astraya-control`}
        >
          <Moon size={18} strokeWidth={1.5} />
          <span>Deep</span>
        </button>

        <button
          type="button"
          onClick={() => handleAtmosphereSelect("airy")}
          className={`${getButtonClass("airy")} -ml-px rounded-r-astraya-control`}
        >
          <Wind size={18} strokeWidth={1.5} />
          <span>Airy</span>
        </button>
      </div>
    </section>
  );
}

export default AtmosphereSelector;