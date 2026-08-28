import { useEffect, useRef, useState } from "react";
import { Clock3 } from "lucide-react";

type DurationSelectorProps = {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
};

function DurationSelector({
  selectedDuration,
  onDurationChange,
}: DurationSelectorProps) {
  const durations = [5, 10, 15, 20, 30, 45];

  const customDurations = Array.from(
    { length: 120 },
    (_, index) => index + 1,
  );

  const [isCustomActive, setIsCustomActive] =
    useState(false);

  const customPickerRef = useRef<HTMLDivElement>(null);

  const itemWidth = 64;

  useEffect(() => {
    if (!isCustomActive) {
      return;
    }

    const picker = customPickerRef.current;

    if (!picker) {
      return;
    }

    picker.scrollTo({
      left: (selectedDuration - 1) * itemWidth,
      behavior: "smooth",
    });
  }, [isCustomActive]);

  const handleCustomScroll = () => {
    const picker = customPickerRef.current;

    if (!picker) {
      return;
    }

    const selectedIndex = Math.round(
      picker.scrollLeft / itemWidth,
    );

    const newDuration =
      customDurations[selectedIndex];

    if (newDuration) {
      onDurationChange(newDuration);
    }
  };

  const handleCustomToggle = () => {
    setIsCustomActive(
      (currentCustomState) => !currentCustomState,
    );
  };

  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        How long do you want to meditate?
      </p>

      {isCustomActive ? (
        <div className="relative h-[60px] overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[60px] w-16 -translate-x-1/2 rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected" />

          <div
            ref={customPickerRef}
            onScroll={handleCustomScroll}
            className="flex h-[60px] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="w-[calc(50%_-_2rem)] shrink-0" />

            {customDurations.map((duration) => {
              const isSelected =
                selectedDuration === duration;

              return (
                <div
                  key={duration}
                  className="flex h-[60px] w-16 shrink-0 snap-center items-center justify-center"
                >
                  <div
                    className={`flex flex-col items-center transition-all duration-200 ${
                      isSelected
                        ? "scale-100 text-astraya-text"
                        : "scale-90 text-astraya-muted/35"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {duration}
                    </span>

                    <span className="mt-1 text-xs">
                      min
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="w-[calc(50%_-_2rem)] shrink-0" />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-astraya-background to-transparent" />

          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-astraya-background to-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-2">
          {durations.map((duration) => {
            const isSelected =
              selectedDuration === duration;

            return (
              <button
                key={duration}
                type="button"
                onClick={() =>
                  onDurationChange(duration)
                }
                className={`flex h-[60px] cursor-pointer flex-col items-center justify-center rounded-astraya-control border px-1 backdrop-blur-sm transition-all duration-300 ease-out ${
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
      )}

      <button
        type="button"
        onClick={handleCustomToggle}
        className={`mt-3 flex w-full cursor-pointer items-center justify-between rounded-astraya-control border px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 ease-out ${
          isCustomActive
            ? "border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
            : "border-astraya-border bg-astraya-surface/20 text-astraya-muted hover:bg-astraya-surface-soft/60 hover:text-astraya-text"
        }`}
      >
        <span className="flex items-center gap-3">
          <Clock3 size={18} strokeWidth={1.5} />
          <span>Custom duration</span>
        </span>

        <span className="text-xs">
          {isCustomActive
            ? `${selectedDuration} min`
            : "Off"}
        </span>
      </button>
    </section>
  );
}

export default DurationSelector;