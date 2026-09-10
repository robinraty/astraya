import { useState } from "react";
import {
  CloudRain,
  Trees,
  Bird,
  ZodiacAquarius,
  Waves,
} from "lucide-react";

function NatureSoundsMixer({
  rainVolume,
  setRainVolume,
  forestVolume,
  setForestVolume,
  birdsVolume,
  setBirdsVolume,
  riverVolume,
  setRiverVolume,
  wavesVolume,
  setWavesVolume,
}) {
  const [rainLastVolume, setRainLastVolume] = useState(35);
  const [forestLastVolume, setForestLastVolume] = useState(20);
  const [birdsLastVolume, setBirdsLastVolume] = useState(25);
  const [riverLastVolume, setRiverLastVolume] = useState(50);
  const [wavesLastVolume, setWavesLastVolume] = useState(40);

  const handleVolumeChange = (
    newVolume,
    setVolume,
    setLastVolume
  ) => {
    setVolume(newVolume);

    if (newVolume > 0) {
      setLastVolume(newVolume);
    }
  };

  const handleToggle = (
    volume,
    lastVolume,
    setVolume
  ) => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(lastVolume || 50);
    }
  };

  const getToggleClass = (volume) => {
    const isEnabled = volume > 0;

    return `
      relative h-7 w-12 cursor-pointer rounded-full border
      transition-all duration-300 ease-out
      ${
        isEnabled
          ? "border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
          : "border-astraya-border bg-astraya-surface-soft shadow-none"
      }
    `;
  };

  const getToggleThumbClass = (volume) => {
    const isEnabled = volume > 0;

    return `
      absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2
      rounded-full bg-astraya-text
      transition-transform duration-300 ease-out
      ${isEnabled ? "translate-x-5" : "translate-x-0"}
    `;
  };

  const rowClass =
    "grid grid-cols-[76px_1fr_36px_48px] items-center gap-2";

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/60 px-4 py-4 shadow-astraya-card backdrop-blur-sm">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Nature Sounds
        </p>

        <p className="mt-2 text-sm text-astraya-muted">
          Add natural layers to your meditation
        </p>
      </div>

      <div className="space-y-4">
        <div className={rowClass}>
          <div className="flex items-center gap-2 text-astraya-text">
            <CloudRain
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-astraya-muted"
            />
            <span className="text-sm">Rain</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={rainVolume}
            onChange={(event) =>
              handleVolumeChange(
                Number(event.target.value),
                setRainVolume,
                setRainLastVolume
              )
            }
            className={`w-full min-w-0 cursor-pointer accent-astraya-accent transition-opacity duration-300 ${
              rainVolume === 0 ? "opacity-40" : "opacity-100"
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {rainVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle rain"
            onClick={() =>
              handleToggle(rainVolume, rainLastVolume, setRainVolume)
            }
            className={getToggleClass(rainVolume)}
          >
            <span className={getToggleThumbClass(rainVolume)} />
          </button>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-2 text-astraya-text">
            <Trees
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-astraya-muted"
            />
            <span className="text-sm">Forest</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={forestVolume}
            onChange={(event) =>
              handleVolumeChange(
                Number(event.target.value),
                setForestVolume,
                setForestLastVolume
              )
            }
            className={`w-full min-w-0 cursor-pointer accent-astraya-accent transition-opacity duration-300 ${
              forestVolume === 0 ? "opacity-40" : "opacity-100"
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {forestVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle forest"
            onClick={() =>
              handleToggle(
                forestVolume,
                forestLastVolume,
                setForestVolume
              )
            }
            className={getToggleClass(forestVolume)}
          >
            <span className={getToggleThumbClass(forestVolume)} />
          </button>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-2 text-astraya-text">
            <Bird
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-astraya-muted"
            />
            <span className="text-sm">Birds</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={birdsVolume}
            onChange={(event) =>
              handleVolumeChange(
                Number(event.target.value),
                setBirdsVolume,
                setBirdsLastVolume
              )
            }
            className={`w-full min-w-0 cursor-pointer accent-astraya-accent transition-opacity duration-300 ${
              birdsVolume === 0 ? "opacity-40" : "opacity-100"
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {birdsVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle birds"
            onClick={() =>
              handleToggle(
                birdsVolume,
                birdsLastVolume,
                setBirdsVolume
              )
            }
            className={getToggleClass(birdsVolume)}
          >
            <span className={getToggleThumbClass(birdsVolume)} />
          </button>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-2 text-astraya-text">
            <ZodiacAquarius
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-astraya-muted"
            />
            <span className="text-sm">River</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={riverVolume}
            onChange={(event) =>
              handleVolumeChange(
                Number(event.target.value),
                setRiverVolume,
                setRiverLastVolume
              )
            }
            className={`w-full min-w-0 cursor-pointer accent-astraya-accent transition-opacity duration-300 ${
              riverVolume === 0 ? "opacity-40" : "opacity-100"
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {riverVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle river"
            onClick={() =>
              handleToggle(
                riverVolume,
                riverLastVolume,
                setRiverVolume
              )
            }
            className={getToggleClass(riverVolume)}
          >
            <span className={getToggleThumbClass(riverVolume)} />
          </button>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-2 text-astraya-text">
            <Waves
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-astraya-muted"
            />
            <span className="text-sm">Waves</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={wavesVolume}
            onChange={(event) =>
              handleVolumeChange(
                Number(event.target.value),
                setWavesVolume,
                setWavesLastVolume
              )
            }
            className={`w-full min-w-0 cursor-pointer accent-astraya-accent transition-opacity duration-300 ${
              wavesVolume === 0 ? "opacity-40" : "opacity-100"
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {wavesVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle waves"
            onClick={() =>
              handleToggle(
                wavesVolume,
                wavesLastVolume,
                setWavesVolume
              )
            }
            className={getToggleClass(wavesVolume)}
          >
            <span className={getToggleThumbClass(wavesVolume)} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default NatureSoundsMixer;