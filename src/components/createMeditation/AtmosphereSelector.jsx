import { Moon, Wind } from "lucide-react";

function AtmosphereSelector({
  selectedAtmosphere,
  setSelectedAtmosphere,
  isAtmosphereEnabled,
  setIsAtmosphereEnabled,
}) {
  const handleAtmosphereSelect = (atmosphere) => {
    setSelectedAtmosphere(atmosphere);
    setIsAtmosphereEnabled(true);
  };

  const getButtonClass = (atmosphere) => {
    const isSelected = selectedAtmosphere === atmosphere;

    if (!isAtmosphereEnabled) {
      return `
        relative flex cursor-pointer items-center justify-center gap-2 border
        border-astraya-border bg-astraya-surface-soft px-4 py-3
        text-astraya-muted opacity-60 transition-all duration-300 ease-out
      `;
    }

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
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/60 p-4 shadow-astraya-card backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Atmosphere
        </p>

        <button
          type="button"
          aria-label="Toggle atmosphere"
          onClick={() =>
            setIsAtmosphereEnabled(!isAtmosphereEnabled)
          }
          className={`relative h-7 w-12 cursor-pointer rounded-full border transition-all duration-300 ease-out ${
            isAtmosphereEnabled
              ? "border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
              : "border-astraya-border bg-astraya-surface-soft shadow-none"
          }`}
        >
          <span
            className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-astraya-text transition-transform duration-300 ease-out ${
              isAtmosphereEnabled
                ? "translate-x-5"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

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