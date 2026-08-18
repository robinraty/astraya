import { useState } from "react";
import {
  CloudRain,
  Trees,
  Bird,
  ZodiacAquarius,
  Waves,
} from "lucide-react";

function NatureSoundsMixer() {
  // Volume ACTUEL de chaque son
  // C'est cette valeur qui est directement liee au slider
  const [rainVolume, setRainVolume] = useState(35);
  const [forestVolume, setForestVolume] = useState(20);
  const [birdsVolume, setBirdsVolume] = useState(25);
  const [riverVolume, setRiverVolume] = useState(0);
  const [wavesVolume, setWavesVolume] = useState(40);

  // Dernier volume utilise avant de couper le son
  //
  // Exemple :
  // Rain est a 35%
  // je coupe avec le toggle => Rain passe a 0
  // je rallume => Rain revient a 35%
  //
  // Sans ca, on ne saurait pas a quel volume revenir apres avoir coupe un son
  const [rainLastVolume, setRainLastVolume] = useState(35);
  const [forestLastVolume, setForestLastVolume] = useState(20);
  const [birdsLastVolume, setBirdsLastVolume] = useState(25);
  const [riverLastVolume, setRiverLastVolume] = useState(50);
  const [wavesLastVolume, setWavesLastVolume] = useState(40);

  // Fonction reutilisee par les 5 sliders
  //
  // newVolume = nouvelle valeur du slider
  // setVolume = fonction qui change le volume actuel
  // setLastVolume = fonction qui memorise le dernier volume > 0
  const handleVolumeChange = (
    newVolume: number,
    setVolume: (value: number) => void,
    setLastVolume: (value: number) => void
  ) => {
    setVolume(newVolume);

    // IMPORTANT :
    // si je descends le slider a 0,
    // je ne veux PAS remplacer mon ancien volume memorise par 0
    if (newVolume > 0) {
      setLastVolume(newVolume);
    }
  };

  // Fonction reutilisee par les 5 toggles
  //
  // Si le son joue => volume passe a 0
  // Si le son est coupe => on recupere son ancien volume
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

  // Style du FOND du toggle
  //
  // volume > 0 = toggle actif avec bleu + glow
  // volume = 0 = toggle eteint
  const getToggleClass = (volume: number) => {
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

  // Style du petit ROND BLANC a l'interieur du toggle
  //
  // top-1/2 = on le place a 50% de la hauteur du toggle
  // -translate-y-1/2 = on le remonte de la moitie de SA hauteur
  //
  // Donc il est vraiment centre verticalement.
  //
  // translate-x-0 = OFF
  // translate-x-5 = ON
  //
  // transition-transform permet au rond de GLISSER en 300ms
  const getToggleThumbClass = (volume: number) => {
    const isEnabled = volume > 0;

    return `
      absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2
      rounded-full bg-astraya-text
      transition-transform duration-300 ease-out
      ${isEnabled ? "translate-x-5" : "translate-x-0"}
    `;
  };

  // Meme grille pour les 5 sons
  //
  // 76px = icone + nom
  // 1fr = slider qui prend tout l'espace restant
  // 36px = pourcentage
  // 48px = toggle
  const rowClass =
    "grid grid-cols-[76px_1fr_36px_48px] items-center gap-2";

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 px-4 py-4 shadow-astraya-card">
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
            // A 0%, le slider devient juste un peu plus discret
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

        {/* FOREST */}
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
              handleToggle(forestVolume, forestLastVolume, setForestVolume)
            }
            className={getToggleClass(forestVolume)}
          >
            <span className={getToggleThumbClass(forestVolume)} />
          </button>
        </div>

        {/* BIRDS */}
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
              handleToggle(birdsVolume, birdsLastVolume, setBirdsVolume)
            }
            className={getToggleClass(birdsVolume)}
          >
            <span className={getToggleThumbClass(birdsVolume)} />
          </button>
        </div>

        {/* RIVER */}
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
              handleToggle(riverVolume, riverLastVolume, setRiverVolume)
            }
            className={getToggleClass(riverVolume)}
          >
            <span className={getToggleThumbClass(riverVolume)} />
          </button>
        </div>

        {/* WAVES */}
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
              handleToggle(wavesVolume, wavesLastVolume, setWavesVolume)
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