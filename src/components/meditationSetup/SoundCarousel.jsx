import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

// --------------------------------------------------
// PRESETS OFFICIELS ASTRAYA
// --------------------------------------------------
//
// Chaque preset contient son propre audioConfig.
// C'est lui qui definit exactement le mix audio.

const astrayaPresets = [
  {
    id: "airy-birds",
    name: "Airy Birds",
    description: "Bright ambience with forest and birds",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-1.png`,

    audioConfig: {
      pitch: "bright",
      atmosphere: "airy",
      atmosphereEnabled: true,
      musicalThemeEnabled: false,
      natureVolumes: {
        rain: 0,
        forest: 25,
        birds: 80,
        river: 0,
        waves: 0,
      },
    },
  },
  {
    id: "soft-strings",
    name: "Soft Strings",
    description: "Gentle strings with a calm natural atmosphere",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-3.png`,

    audioConfig: {
      pitch: "natural",
      atmosphere: "airy",
      atmosphereEnabled: true,
      musicalThemeEnabled: true,
      natureVolumes: {
        rain: 10,
        forest: 20,
        birds: 20,
        river: 0,
        waves: 0,
      },
    },
  },
  {
    id: "deep-forest",
    name: "Deep Forest",
    description: "Dark forest ambience with river and distant birds",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-2.png`,

    audioConfig: {
      pitch: "dark",
      atmosphere: "deep",
      atmosphereEnabled: true,
      musicalThemeEnabled: false,
      natureVolumes: {
        rain: 0,
        forest: 70,
        birds: 20,
        river: 45,
        waves: 0,
      },
    },
  },
];

// --------------------------------------------------
// CREATIONS UTILISATEUR TEMPORAIRES
// --------------------------------------------------
//
// Elles n'ont pas encore d'audioConfig.
// Plus tard, leurs vraies configs viendront du backend.

const myCreations = [
  {
    id: "creation-1",
    name: "Night Focus",
    description: "Piano, rain and deep atmosphere",
    image: `${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-moon-piano.png`,
  },
  {
    id: "creation-2",
    name: "Quiet Forest",
    description: "Forest sounds with soft piano",
    image: `${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-deep-forest.png`,
  },
];

function SoundCarousel({
  source,
  onSoundChange,
}) {
  // Preset selectionne dans le carousel.
  const [selectedSound, setSelectedSound] =
    useState("airy-birds");

  // ID du preset actuellement en preview.
  //
  // null = aucune preview en cours.
  const [previewSoundId, setPreviewSoundId] =
    useState(null);

  // Etat des fleches du carousel.
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Reference vers le carousel horizontal.
  const carouselRef = useRef(null);

  // --------------------------------------------------
  // REFERENCES AUDIO DE LA PREVIEW
  // --------------------------------------------------

  // Moteur audio utilise uniquement pour la preview.
  const previewAudioContextRef = useRef(null);

  // Contient tous les fichiers audio actuellement joues.
  //
  // Pad + theme + sons de nature.
  const previewAudiosRef = useRef([]);

  // Contient tous leurs GainNodes.
  //
  // Les GainNodes servent a controler les volumes
  // et a faire les fades.
  const previewGainsRef = useRef([]);

  // Petit verrou pour eviter de spammer Play / Pause.
  const isPreviewTransitioningRef = useRef(false);

  // Timeout utilise pendant l'arret d'une preview.
  const previewTimeoutRef = useRef(null);

  // Choisit la liste a afficher.
  const sounds =
    source === "presets"
      ? astrayaPresets
      : myCreations;

  // Titre de la section.
  const sectionTitle =
    source === "presets"
      ? "Explore Presets"
      : "My Creations";

  // --------------------------------------------------
  // CAROUSEL
  // --------------------------------------------------

  // Determine si les fleches gauche / droite
  // doivent etre actives.
  const updateScrollButtons = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScrollLeft =
      carousel.scrollWidth - carousel.clientWidth;

    setCanScrollLeft(carousel.scrollLeft > 1);

    setCanScrollRight(
      carousel.scrollLeft < maxScrollLeft - 1
    );
  };

  // Deplace le carousel d'une carte.
  const handleCarouselScroll = (direction) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const firstCard = carousel.firstElementChild;

    if (!firstCard) {
      return;
    }

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const gap = 12;

    carousel.scrollBy({
      left:
        direction === "right"
          ? cardWidth + gap
          : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  // Selectionne un preset.
  //
  // Toute la meditation est envoyee au parent,
  // y compris son audioConfig.
  const handleSoundSelection = (sound) => {
    setSelectedSound(sound.id);
    onSoundChange(sound);
  };

  // --------------------------------------------------
  // ARRET D'UNE PREVIEW
  // --------------------------------------------------

  const stopPreview = (onComplete = null) => {
    const audioContext = previewAudioContextRef.current;

    // S'il n'y a aucun moteur audio,
    // il n'y a rien a arreter.
    if (!audioContext) {
      setPreviewSoundId(null);

      if (onComplete) {
        onComplete();
      }

      return;
    }

    // On evite plusieurs arrets en meme temps.
    isPreviewTransitioningRef.current = true;

    const now = audioContext.currentTime;

    // Fade-out de toutes les couches audio.
    previewGainsRef.current.forEach((gain) => {
      gain.gain.cancelScheduledValues(now);

      gain.gain.setValueAtTime(
        gain.gain.value,
        now
      );

      gain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );
    });

    // On attend la fin du fade avant de stopper
    // reellement les fichiers.
    previewTimeoutRef.current = setTimeout(() => {
      previewAudiosRef.current.forEach((audio) => {
        audio.pause();
      });

      // Fermeture de l'ancien AudioContext.
      if (audioContext.state !== "closed") {
        audioContext.close();
      }

      previewAudioContextRef.current = null;
      previewAudiosRef.current = [];
      previewGainsRef.current = [];

      setPreviewSoundId(null);

      isPreviewTransitioningRef.current = false;
      previewTimeoutRef.current = null;

      // Sert quand on veut enchainer directement
      // vers la preview d'un autre preset.
      if (onComplete) {
        onComplete();
      }
    }, 450);
  };

  // --------------------------------------------------
  // LANCEMENT D'UNE PREVIEW
  // --------------------------------------------------

  const startPreview = (sound) => {
    // Impossible de jouer une meditation
    // qui ne possede pas encore d'audioConfig.
    if (!sound.audioConfig) {
      return;
    }

    const config = sound.audioConfig;

    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();

    previewAudioContextRef.current = audioContext;

    // Tableaux temporaires contenant
    // toutes les couches de cette preview.
    const audios = [];
    const gains = [];

    // --------------------------------------------------
    // PAD
    // --------------------------------------------------

    // Exemple :
    // atmosphere = airy
    // pitch = bright
    //
    // donne :
    // airy-bright.wav
    const padAudio = new Audio(
      `${
        import.meta.env.BASE_URL
      }audio/pads/${config.atmosphere}-${config.pitch}.wav`
    );

    padAudio.loop = true;

    const padSource =
      audioContext.createMediaElementSource(padAudio);

    const padGain = audioContext.createGain();

    // Commence silencieux pour permettre le fade-in.
    padGain.gain.value = 0;

    padSource.connect(padGain);
    padGain.connect(audioContext.destination);

    audios.push(padAudio);
    gains.push(padGain);

    // --------------------------------------------------
    // MUSICAL THEME
    // --------------------------------------------------

    // Le theme suit Dark / Natural / Bright.
    const themeAudio = new Audio(
      `${
        import.meta.env.BASE_URL
      }audio/themes/soft-strings-${config.pitch}.wav`
    );

    themeAudio.loop = true;

    const themeSource =
      audioContext.createMediaElementSource(themeAudio);

    const themeGain = audioContext.createGain();

    themeGain.gain.value = 0;

    themeSource.connect(themeGain);
    themeGain.connect(audioContext.destination);

    audios.push(themeAudio);
    gains.push(themeGain);

    // --------------------------------------------------
    // NATURE SOUNDS
    // --------------------------------------------------

    const natureSounds = [
      "rain",
      "forest",
      "birds",
      "river",
      "waves",
    ];

    // On garde les GainNodes Nature separement
    // pour pouvoir appliquer leurs vrais volumes.
    const natureGains = {};

    natureSounds.forEach((soundName) => {
      const audio = new Audio(
        `${
          import.meta.env.BASE_URL
        }audio/nature/${soundName}.wav`
      );

      audio.loop = true;

      const source =
        audioContext.createMediaElementSource(audio);

      const gain = audioContext.createGain();

      gain.gain.value = 0;

      source.connect(gain);
      gain.connect(audioContext.destination);

      audios.push(audio);
      gains.push(gain);

      natureGains[soundName] = gain;
    });

    // On sauvegarde toutes les couches
    // pour pouvoir les arreter plus tard.
    previewAudiosRef.current = audios;
    previewGainsRef.current = gains;

    // Le navigateur peut suspendre AudioContext
    // avant une interaction utilisateur.
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // On lance toutes les pistes en meme temps.
    audios.forEach((audio) => {
      audio.play();
    });

    const now = audioContext.currentTime;

    // --------------------------------------------------
    // VOLUME DU PAD
    // --------------------------------------------------

    padGain.gain.setValueAtTime(0, now);

    padGain.gain.linearRampToValueAtTime(
      config.atmosphereEnabled ? 1 : 0,
      now + 1
    );

    // --------------------------------------------------
    // VOLUME DU MUSICAL THEME
    // --------------------------------------------------

    themeGain.gain.setValueAtTime(0, now);

    themeGain.gain.linearRampToValueAtTime(
      config.musicalThemeEnabled ? 1 : 0,
      now + 1
    );

    // --------------------------------------------------
    // VOLUMES DES NATURE SOUNDS
    // --------------------------------------------------

    Object.entries(config.natureVolumes).forEach(
      ([soundName, volume]) => {
        const gain = natureGains[soundName];

        if (!gain) {
          return;
        }

        gain.gain.setValueAtTime(0, now);

        // Exemple :
        // Birds 80 devient 0.8.
        gain.gain.linearRampToValueAtTime(
          volume / 100,
          now + 1
        );
      }
    );

    // On affiche Pause sur cette carte.
    setPreviewSoundId(sound.id);
  };

  // --------------------------------------------------
  // CLIC SUR PLAY / PAUSE
  // --------------------------------------------------

  const handlePreview = (sound) => {
    // Ignore les clics pendant une transition audio.
    if (isPreviewTransitioningRef.current) {
      return;
    }

    // Si cette meditation joue deja :
    // on l'arrete.
    if (previewSoundId === sound.id) {
      stopPreview();
      return;
    }

    // Si une autre preview est deja active :
    // on l'arrete puis on lance la nouvelle.
    if (previewSoundId) {
      stopPreview(() => {
        startPreview(sound);
      });

      return;
    }

    // Sinon, on lance simplement la preview.
    startPreview(sound);
  };

  // --------------------------------------------------
  // EFFETS DU CAROUSEL
  // --------------------------------------------------

  // Initialise les fleches.
  useEffect(() => {
    updateScrollButtons();

    window.addEventListener(
      "resize",
      updateScrollButtons
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateScrollButtons
      );
    };
  }, []);

  // Quand on change entre Presets et My Creations :
  // 1. on stoppe la preview
  // 2. on selectionne automatiquement le premier element
  // 3. on remet le carousel au debut
  useEffect(() => {
    const carousel = carouselRef.current;
    const firstSound = sounds[0];

    if (!firstSound) {
      return;
    }

    if (previewSoundId) {
      stopPreview();
    }

    setSelectedSound(firstSound.id);
    onSoundChange(firstSound);

    if (!carousel) {
      return;
    }

    carousel.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    updateScrollButtons();
  }, [source, onSoundChange]);

  // Nettoyage complet quand SoundCarousel disparait.
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }

      previewAudiosRef.current.forEach((audio) => {
        audio.pause();
      });

      const audioContext =
        previewAudioContextRef.current;

      if (
        audioContext &&
        audioContext.state !== "closed"
      ) {
        audioContext.close();
      }
    };
  }, []);

  return (
    <section className="min-w-0">
      {/* Titre de section + fleches */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
          {sectionTitle}
        </p>

        <div className="flex items-center gap-2">
          {/* Fleche gauche */}
          <button
            type="button"
            aria-label="Previous sounds"
            disabled={!canScrollLeft}
            onClick={() => handleCarouselScroll("left")}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              canScrollLeft
                ? "cursor-pointer border-astraya-border bg-astraya-surface/20 text-astraya-text backdrop-blur-sm hover:bg-astraya-surface-soft/60"
                : "cursor-default border-astraya-border/50 bg-astraya-surface/20 text-astraya-muted/30"
            }`}
          >
            <ChevronLeft
              size={16}
              strokeWidth={1.5}
            />
          </button>

          {/* Fleche droite */}
          <button
            type="button"
            aria-label="Next sounds"
            disabled={!canScrollRight}
            onClick={() => handleCarouselScroll("right")}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              canScrollRight
                ? "cursor-pointer border-astraya-border bg-astraya-surface/20 text-astraya-text backdrop-blur-sm hover:bg-astraya-surface-soft/60"
                : "cursor-default border-astraya-border/50 bg-astraya-surface/20 text-astraya-muted/30"
            }`}
          >
            <ChevronRight
              size={16}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* Carousel horizontal */}
      <div
        ref={carouselRef}
        onScroll={updateScrollButtons}
        className="mt-4 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sounds.map((sound) => {
          const isSelected =
            selectedSound === sound.id;

          // Est-ce que cette carte est en preview ?
          const isPreviewPlaying =
            previewSoundId === sound.id;

          // Les creations temporaires n'ont pas
          // encore de vraie configuration audio.
          const hasAudioConfig = Boolean(
            sound.audioConfig
          );

          return (
            <div
              key={sound.id}
              className={`flex w-[calc((100%_-_1.5rem)/3)] shrink-0 snap-start flex-col rounded-astraya-control border p-2 backdrop-blur-sm transition-all duration-300 ease-out ${
                isSelected
                  ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
                  : "border-astraya-border bg-astraya-surface/20"
              }`}
            >
              {/* Selection du preset */}
              <button
                type="button"
                onClick={() =>
                  handleSoundSelection(sound)
                }
                className="w-full cursor-pointer text-left"
              >
                <img
                  src={sound.image}
                  alt={sound.name}
                  className="aspect-square w-full rounded-xl object-cover"
                />

                <p className="mt-2 text-sm font-medium leading-tight text-astraya-text">
                  {sound.name}
                </p>

                <p className="mt-1 text-xs leading-4 text-astraya-muted">
                  {sound.description}
                </p>
              </button>

              {/* Bouton Preview / Pause */}
              <div className="mt-auto flex justify-end pt-3">
                <button
                  type="button"
                  aria-label={
                    isPreviewPlaying
                      ? `Pause ${sound.name}`
                      : `Preview ${sound.name}`
                  }
                  disabled={!hasAudioConfig}
                  onClick={() => handlePreview(sound)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
                    hasAudioConfig
                      ? isPreviewPlaying
                        ? "cursor-pointer border-astraya-accent bg-astraya-accent/15 text-astraya-accent-light shadow-astraya-selected"
                        : "cursor-pointer border-astraya-border bg-astraya-surface-soft text-astraya-text hover:border-astraya-accent"
                      : "cursor-not-allowed border-astraya-border bg-astraya-surface-soft text-astraya-muted opacity-40"
                  }`}
                >
                  {isPreviewPlaying ? (
                    <Pause
                      size={12}
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      size={12}
                      fill="currentColor"
                    />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SoundCarousel;