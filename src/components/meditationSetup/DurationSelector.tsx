import { useState } from "react";
import { ChevronRight, Clock3 } from "lucide-react";

function DurationSelector() {
  const [selectedDuration, setSelectedDuration] = useState(15);

  const durations = [5, 10, 15, 20, 30, 45];

  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        How long do you want to meditate?
      </p>

      <div className="grid grid-cols-6 gap-2">
        {durations.map((duration) => {
          const isSelected = selectedDuration === duration;

          return (
            <button
              key={duration}
              type="button"
              onClick={() => setSelectedDuration(duration)}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-astraya-control border px-1 py-3 backdrop-blur-sm transition-all duration-300 ease-out ${
                isSelected
                  ? "border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
                  : "border-astraya-border bg-astraya-surface/20 text-astraya-muted hover:bg-astraya-surface-soft/60 hover:text-astraya-text"
              }`}
            >
              <span className="text-sm font-medium">
                {duration}
              </span>

              <span className="mt-1 text-xs">
                min
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-astraya-control border border-astraya-border bg-astraya-surface/20 px-4 py-3 text-sm text-astraya-muted backdrop-blur-sm transition-all duration-300 ease-out hover:bg-astraya-surface-soft/60 hover:text-astraya-text"
      >
        <span className="flex items-center gap-3">
          <Clock3 size={18} strokeWidth={1.5} />
          <span>Custom duration</span>
        </span>

        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </section>
  );
}

export default DurationSelector;