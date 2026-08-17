import { useState } from "react";
import { Moon, Wind } from "lucide-react";

function AtmosphereSelector() {
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("airy");
  const [isAtmosphereEnabled, setIsAtmosphereEnabled] = useState(true);

  const getButtonClass = (atmosphere: string) => {
    const isSelected = selectedAtmosphere === atmosphere;

    if (!isAtmosphereEnabled) {
      return `
        relative flex cursor-pointer items-center justify-center gap-2 border
        border-astraya-border bg-astraya-surface-soft px-4 py-3
        text-astraya-muted opacity-60 transition
      `;
    }

    return `
      relative flex cursor-pointer items-center justify-center gap-2 border px-4 py-3 transition
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

        <button
          type="button"
          aria-label="Toggle atmosphere"
          onClick={() => setIsAtmosphereEnabled(!isAtmosphereEnabled)}
          className={`flex h-7 w-12 cursor-pointer items-center rounded-full border p-1 transition ${
            isAtmosphereEnabled
              ? "justify-end border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
              : "justify-start border-astraya-border bg-astraya-surface-soft"
          }`}
        >
          <span className="h-5 w-5 rounded-full bg-astraya-text" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2">
        <button
          type="button"
          onClick={() => setSelectedAtmosphere("deep")}
          className={`${getButtonClass("deep")} rounded-l-astraya-control`}
        >
          <Moon size={18} strokeWidth={1.5} />
          <span>Deep</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedAtmosphere("airy")}
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