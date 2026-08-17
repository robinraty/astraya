import { useState } from "react";

function PitchSelector() {
  const [selectedPitch, setSelectedPitch] = useState("dark");

  const getButtonClass = (pitch: string) => {
    const isSelected = selectedPitch === pitch;

    return `
      cursor-pointer px-4 py-4 transition
      ${
        isSelected
          ? "bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
          : "text-astraya-muted hover:bg-astraya-surface-soft hover:text-astraya-text"
      }
    `;
  };

  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Pitch / Mood
      </p>

      <div className="grid grid-cols-3 overflow-hidden rounded-astraya-control border border-astraya-border">
        <button
          type="button"
          onClick={() => setSelectedPitch("dark")}
          className={`${getButtonClass("dark")} border-r border-astraya-border`}
        >
          Dark
        </button>

        <button
          type="button"
          onClick={() => setSelectedPitch("natural")}
          className={`${getButtonClass("natural")} border-r border-astraya-border`}
        >
          Natural
        </button>

        <button
          type="button"
          onClick={() => setSelectedPitch("bright")}
          className={getButtonClass("bright")}
        >
          Bright
        </button>
      </div>
    </section>
  );
}

export default PitchSelector;