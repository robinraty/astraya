import { useState } from "react";

function MusicalThemeSelector() {
  const [isMusicalThemeEnabled, setIsMusicalThemeEnabled] = useState(true);

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Musical Theme
        </p>

        <button
          type="button"
          aria-label="Toggle musical theme"
          onClick={() => setIsMusicalThemeEnabled(!isMusicalThemeEnabled)}
          className={`flex h-7 w-12 cursor-pointer items-center rounded-full border p-1 transition ${
            isMusicalThemeEnabled
              ? "justify-end border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
              : "justify-start border-astraya-border bg-astraya-surface-soft"
          }`}
        >
          <span className="h-5 w-5 rounded-full bg-astraya-text" />
        </button>
      </div>

      <button
        type="button"
        className={`mt-4 flex w-full cursor-pointer items-center justify-between gap-4 rounded-astraya-control border px-4 py-3 text-left transition ${
          isMusicalThemeEnabled
            ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
            : "border-astraya-border bg-astraya-surface-soft text-astraya-muted opacity-60"
        }`}
      >
        <div>
          <p
            className={`text-sm font-medium ${
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

        <span
          className={`text-xl ${
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