import { useState } from "react";
import {
  CloudRain,
  Trees,
  Bird,
  ZodiacAquarius,
  Waves,
} from "lucide-react";

function NatureSoundsMixer() {
  const [rainVolume, setRainVolume] = useState(35);
  const [rainLastVolume, setRainLastVolume] = useState(35);

  const [forestVolume, setForestVolume] = useState(20);
  const [forestLastVolume, setForestLastVolume] = useState(20);

  const [birdsVolume, setBirdsVolume] = useState(25);
  const [birdsLastVolume, setBirdsLastVolume] = useState(25);

  const [riverVolume, setRiverVolume] = useState(0);
  const [riverLastVolume, setRiverLastVolume] = useState(50);

  const [wavesVolume, setWavesVolume] = useState(40);
  const [wavesLastVolume, setWavesLastVolume] = useState(40);

  const handleVolumeChange = (
    newVolume: number,
    setVolume: (value: number) => void,
    setLastVolume: (value: number) => void
  ) => {
    setVolume(newVolume);

    if (newVolume > 0) {
      setLastVolume(newVolume);
    }
  };

  const handleToggle = (
    volume: number,
    lastVolume: number,
    setVolume: (value: number) => void
  ) => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(lastVolume || 50);
    }
  };

  const getToggleClass = (volume: number) => {
    const isEnabled = volume > 0;

    return `
      flex h-7 w-12 cursor-pointer items-center rounded-full border p-1 transition
      ${
        isEnabled
          ? "justify-end border-astraya-accent bg-astraya-accent/20 shadow-astraya-glow"
          : "justify-start border-astraya-border bg-astraya-surface-soft"
      }
    `;
  };

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-4 shadow-astraya-card">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          Nature Sounds
        </p>

        <p className="mt-2 text-sm text-astraya-muted">
          Add natural layers to your meditation
        </p>
      </div>

      <div className="space-y-4">
        {/* RAIN */}
        <div className="grid grid-cols-[90px_1fr_45px_48px] items-center gap-3">
          <div className="flex items-center gap-2 text-astraya-text">
            <CloudRain
              size={20}
              strokeWidth={1.5}
              className="text-astraya-muted"
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
            className={`w-full cursor-pointer accent-astraya-accent ${
              rainVolume === 0 ? "opacity-40" : ""
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
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* FOREST */}
        <div className="grid grid-cols-[90px_1fr_45px_48px] items-center gap-3">
          <div className="flex items-center gap-2 text-astraya-text">
            <Trees
              size={20}
              strokeWidth={1.5}
              className="text-astraya-muted"
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
            className={`w-full cursor-pointer accent-astraya-accent ${
              forestVolume === 0 ? "opacity-40" : ""
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {forestVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle forest"
            onClick={() =>
              handleToggle(forestVolume, forestLastVolume, setForestVolume)
            }
            className={getToggleClass(forestVolume)}
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* BIRDS */}
        <div className="grid grid-cols-[90px_1fr_45px_48px] items-center gap-3">
          <div className="flex items-center gap-2 text-astraya-text">
            <Bird
              size={20}
              strokeWidth={1.5}
              className="text-astraya-muted"
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
            className={`w-full cursor-pointer accent-astraya-accent ${
              birdsVolume === 0 ? "opacity-40" : ""
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {birdsVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle birds"
            onClick={() =>
              handleToggle(birdsVolume, birdsLastVolume, setBirdsVolume)
            }
            className={getToggleClass(birdsVolume)}
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* RIVER */}
        <div className="grid grid-cols-[90px_1fr_45px_48px] items-center gap-3">
          <div className="flex items-center gap-2 text-astraya-text">
            <ZodiacAquarius
              size={20}
              strokeWidth={1.5}
              className="text-astraya-muted"
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
            className={`w-full cursor-pointer accent-astraya-accent ${
              riverVolume === 0 ? "opacity-40" : ""
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {riverVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle river"
            onClick={() =>
              handleToggle(riverVolume, riverLastVolume, setRiverVolume)
            }
            className={getToggleClass(riverVolume)}
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>

        {/* WAVES */}
        <div className="grid grid-cols-[90px_1fr_45px_48px] items-center gap-3">
          <div className="flex items-center gap-2 text-astraya-text">
            <Waves
              size={20}
              strokeWidth={1.5}
              className="text-astraya-muted"
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
            className={`w-full cursor-pointer accent-astraya-accent ${
              wavesVolume === 0 ? "opacity-40" : ""
            }`}
          />

          <p className="text-right text-sm text-astraya-muted">
            {wavesVolume}%
          </p>

          <button
            type="button"
            aria-label="Toggle waves"
            onClick={() =>
              handleToggle(wavesVolume, wavesLastVolume, setWavesVolume)
            }
            className={getToggleClass(wavesVolume)}
          >
            <span className="h-5 w-5 rounded-full bg-astraya-text" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default NatureSoundsMixer;