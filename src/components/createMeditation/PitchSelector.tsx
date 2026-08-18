import { useState } from "react";

function PitchSelector() {
  // Pitch actuellement selectionne
  // La valeur de depart est "dark"
  const [selectedPitch, setSelectedPitch] = useState("dark");

  // Fonction qui retourne les classes du bouton selon son etat
  //
  // pitch = la valeur du bouton qu'on est en train de verifier
  // Exemple : "dark", "natural" ou "bright"
  const getButtonClass = (pitch: string) => {
    const isSelected = selectedPitch === pitch;

    return `
      relative cursor-pointer border px-4 py-4
      transition-all duration-300 ease-out
      ${
        isSelected
          ? "z-10 border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
          : "border-astraya-border text-astraya-muted hover:bg-astraya-surface-soft hover:text-astraya-text"
      }
    `;
  };

  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Pitch / Mood
      </p>

      {/* 
        Les 3 boutons prennent chacun 1 colonne
        donc ils font automatiquement 1/3 de la largeur
      */}
      <div className="grid grid-cols-3">
        <button
          type="button"
          onClick={() => setSelectedPitch("dark")}
          className={`${getButtonClass("dark")} rounded-l-astraya-control`}
        >
          Dark
        </button>

        {/*
          -ml-px = on decale le bouton de 1px vers la gauche

          Pourquoi ?
          Parce que les boutons sont colles et ont chacun une border de 1px.
          Sans ca, entre deux boutons on aurait visuellement 2px de border.
        */}
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