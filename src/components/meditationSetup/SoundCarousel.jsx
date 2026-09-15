import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

// --------------------------------------------------
// PRESETS OFFICIELS ASTRAYA
// --------------------------------------------------
//
// Les presets officiels restent directement
// dans le frontend.
//
// Ils ne dépendent pas d'un compte utilisateur.

const astrayaPresets = [
  {
    id: "airy-birds",
    name: "Airy Birds",
    description:
      "Bright ambience with forest and birds",

    image: `${
      import.meta.env.BASE_URL
    }images/ambiant-images/astraya-background-1.png`,

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
    description:
      "Gentle strings with a calm natural atmosphere",

    image: `${
      import.meta.env.BASE_URL
    }images/ambiant-images/astraya-background-3.png`,

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
    description:
      "Dark forest ambience with river and distant birds",

    image: `${
      import.meta.env.BASE_URL
    }images/ambiant-images/astraya-background-2.png`,

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
// DESCRIPTION D'UNE CREATION UTILISATEUR
// --------------------------------------------------

const getCreationDescription = (
  audioConfig
) => {
  if (
    !audioConfig?.natureVolumes
  ) {
    return "Custom meditation";
  }

  const activeSounds =
    Object.entries(
      audioConfig.natureVolumes
    )
      .filter(
        ([, volume]) =>
          volume > 0
      )
      .map(
        ([sound, volume]) => {
          const formattedSound =
            sound
              .charAt(0)
              .toUpperCase() +
            sound.slice(1);

          return `${formattedSound} ${volume}%`;
        }
      );

  if (
    activeSounds.length === 0
  ) {
    return "Custom meditation";
  }

  return activeSounds.join(" • ");
};

// --------------------------------------------------
// IDENTIFIANT UNIQUE
// --------------------------------------------------
//
// Les presets utilisent "id".
//
// MongoDB utilise "_id".
//
// Cette fonction nous permet
// de gérer les deux avec le même code.

const getSoundId = (
  sound
) => {
  return (
    sound?.id ||
    sound?._id ||
    null
  );
};

function SoundCarousel({
  source,
  selectedMeditation,
  onSoundChange,
}) {
  const navigate =
    useNavigate();

  const {
    token,
    logout,
  } = useAuth();

  // --------------------------------------------------
  // CREATIONS MONGODB
  // --------------------------------------------------

  // Les vraies créations personnelles
  // récupérées depuis le backend.
  const [
    myCreations,
    setMyCreations,
  ] = useState([]);

  // Etat du chargement MongoDB.
  const [
    isLoadingCreations,
    setIsLoadingCreations,
  ] = useState(false);

  // Message d'erreur éventuel.
  const [
    creationsError,
    setCreationsError,
  ] = useState("");

  // --------------------------------------------------
  // SELECTION / PREVIEW
  // --------------------------------------------------

  // ID de la méditation sélectionnée.
  const [
    selectedSound,
    setSelectedSound,
  ] = useState(
    getSoundId(
      selectedMeditation
    ) || "airy-birds"
  );

  // ID de la méditation actuellement en preview.
  const [
    previewSoundId,
    setPreviewSoundId,
  ] = useState(null);

  // --------------------------------------------------
  // CAROUSEL
  // --------------------------------------------------

  const [
    canScrollLeft,
    setCanScrollLeft,
  ] = useState(false);

  const [
    canScrollRight,
    setCanScrollRight,
  ] = useState(true);

  const carouselRef =
    useRef(null);

  // --------------------------------------------------
  // AUDIO PREVIEW
  // --------------------------------------------------

  const previewAudioContextRef =
    useRef(null);

  const previewAudiosRef =
    useRef([]);

  const previewGainsRef =
    useRef([]);

  const isPreviewTransitioningRef =
    useRef(false);

  const previewTimeoutRef =
    useRef(null);

  // --------------------------------------------------
  // DONNEES A AFFICHER
  // --------------------------------------------------

  // Selon l'onglet choisi :
  //
  // presets
  // → presets officiels
  //
  // creations
  // → créations MongoDB
  const sounds =
    source === "presets"
      ? astrayaPresets
      : myCreations;

  const sectionTitle =
    source === "presets"
      ? "Explore Presets"
      : "My Creations";

  // --------------------------------------------------
  // CHARGEMENT DES CREATIONS MONGODB
  // --------------------------------------------------

  useEffect(() => {
    // On ne contacte MongoDB que lorsque
    // l'onglet My Creations est utilisé.
    if (
      source !== "creations"
    ) {
      return;
    }

    const fetchCreations =
      async () => {
        // Sans compte connecté,
        // il n'y a aucune création privée à charger.
        if (!token) {
          setMyCreations([]);

          setCreationsError(
            "Log in to access your creations."
          );

          setIsLoadingCreations(
            false
          );

          return;
        }

        try {
          setIsLoadingCreations(
            true
          );

          setCreationsError("");

          const response =
            await fetch(
              "http://localhost:3000/creations",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          // Session invalide ou expirée.
          if (
            response.status ===
            401
          ) {
            logout();

            setMyCreations([]);

            navigate("/login");

            return;
          }

          if (!response.ok) {
            throw new Error(
              "Unable to load creations."
            );
          }

          const creations =
            await response.json();

          // MongoDB ne stocke pas actuellement
          // d'image ou de description.
          //
          // On ajoute donc uniquement
          // les informations visuelles
          // nécessaires au carousel.
          const formattedCreations =
            creations.map(
              (creation) => ({
                ...creation,

                image: `${
                  import.meta.env
                    .BASE_URL
                }images/presets-artworks/astraya-artwork-moon-piano.png`,

                description:
                  getCreationDescription(
                    creation.audioConfig
                  ),
              })
            );

          setMyCreations(
            formattedCreations
          );
        } catch (error) {
          console.error(
            "Erreur lors du chargement des créations :",
            error
          );

          setCreationsError(
            "Unable to load your creations."
          );
        } finally {
          setIsLoadingCreations(
            false
          );
        }
      };

    fetchCreations();
  }, [
    source,
    token,
    logout,
    navigate,
  ]);

  // --------------------------------------------------
  // CAROUSEL
  // --------------------------------------------------

  const updateScrollButtons =
    () => {
      const carousel =
        carouselRef.current;

      if (!carousel) {
        return;
      }

      const maxScrollLeft =
        carousel.scrollWidth -
        carousel.clientWidth;

      setCanScrollLeft(
        carousel.scrollLeft >
          1
      );

      setCanScrollRight(
        carousel.scrollLeft <
          maxScrollLeft - 1
      );
    };

  const handleCarouselScroll = (
    direction
  ) => {
    const carousel =
      carouselRef.current;

    if (!carousel) {
      return;
    }

    const firstCard =
      carousel.firstElementChild;

    if (!firstCard) {
      return;
    }

    const cardWidth =
      firstCard.getBoundingClientRect()
        .width;

    const gap = 12;

    carousel.scrollBy({
      left:
        direction ===
        "right"
          ? cardWidth + gap
          : -(cardWidth + gap),

      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // SELECTION
  // --------------------------------------------------

  const handleSoundSelection = (
    sound
  ) => {
    const soundId =
      getSoundId(sound);

    setSelectedSound(
      soundId
    );

    // Envoie l'objet entier
    // vers MeditationSetup.
    onSoundChange(sound);
  };

  // --------------------------------------------------
  // ARRET PREVIEW
  // --------------------------------------------------

  const stopPreview = (
    onComplete = null
  ) => {
    const audioContext =
      previewAudioContextRef.current;

    if (!audioContext) {
      setPreviewSoundId(
        null
      );

      if (onComplete) {
        onComplete();
      }

      return;
    }

    isPreviewTransitioningRef.current =
      true;

    const now =
      audioContext.currentTime;

    previewGainsRef.current.forEach(
      (gain) => {
        gain.gain.cancelScheduledValues(
          now
        );

        gain.gain.setValueAtTime(
          gain.gain.value,
          now
        );

        gain.gain.linearRampToValueAtTime(
          0,
          now + 0.4
        );
      }
    );

    previewTimeoutRef.current =
      setTimeout(() => {
        previewAudiosRef.current.forEach(
          (audio) => {
            audio.pause();
          }
        );

        if (
          audioContext.state !==
          "closed"
        ) {
          audioContext.close();
        }

        previewAudioContextRef.current =
          null;

        previewAudiosRef.current =
          [];

        previewGainsRef.current =
          [];

        setPreviewSoundId(
          null
        );

        isPreviewTransitioningRef.current =
          false;

        previewTimeoutRef.current =
          null;

        if (onComplete) {
          onComplete();
        }
      }, 450);
  };

  // --------------------------------------------------
  // LANCEMENT PREVIEW
  // --------------------------------------------------

  const startPreview = (
    sound
  ) => {
    if (!sound.audioConfig) {
      return;
    }

    const config =
      sound.audioConfig;

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    const audioContext =
      new AudioContext();

    previewAudioContextRef.current =
      audioContext;

    const audios = [];
    const gains = [];

    // --------------------------------------------------
    // PAD
    // --------------------------------------------------

    const padAudio = new Audio(
      `${
        import.meta.env.BASE_URL
      }audio/pads/${config.atmosphere}-${config.pitch}.wav`
    );

    padAudio.loop = true;

    const padSource =
      audioContext.createMediaElementSource(
        padAudio
      );

    const padGain =
      audioContext.createGain();

    padGain.gain.value = 0;

    padSource.connect(
      padGain
    );

    padGain.connect(
      audioContext.destination
    );

    audios.push(
      padAudio
    );

    gains.push(
      padGain
    );

    // --------------------------------------------------
    // MUSICAL THEME
    // --------------------------------------------------

    const themeAudio = new Audio(
      `${
        import.meta.env.BASE_URL
      }audio/themes/soft-strings-${config.pitch}.wav`
    );

    themeAudio.loop = true;

    const themeSource =
      audioContext.createMediaElementSource(
        themeAudio
      );

    const themeGain =
      audioContext.createGain();

    themeGain.gain.value = 0;

    themeSource.connect(
      themeGain
    );

    themeGain.connect(
      audioContext.destination
    );

    audios.push(
      themeAudio
    );

    gains.push(
      themeGain
    );

    // --------------------------------------------------
    // NATURE
    // --------------------------------------------------

    const natureSounds = [
      "rain",
      "forest",
      "birds",
      "river",
      "waves",
    ];

    const natureGains = {};

    natureSounds.forEach(
      (soundName) => {
        const audio = new Audio(
          `${
            import.meta.env.BASE_URL
          }audio/nature/${soundName}.wav`
        );

        audio.loop = true;

        const source =
          audioContext.createMediaElementSource(
            audio
          );

        const gain =
          audioContext.createGain();

        gain.gain.value = 0;

        source.connect(
          gain
        );

        gain.connect(
          audioContext.destination
        );

        audios.push(
          audio
        );

        gains.push(
          gain
        );

        natureGains[
          soundName
        ] = gain;
      }
    );

    previewAudiosRef.current =
      audios;

    previewGainsRef.current =
      gains;

    if (
      audioContext.state ===
      "suspended"
    ) {
      audioContext.resume();
    }

    audios.forEach(
      (audio) => {
        audio.play();
      }
    );

    const now =
      audioContext.currentTime;

    // Pad.
    padGain.gain.setValueAtTime(
      0,
      now
    );

    padGain.gain.linearRampToValueAtTime(
      config.atmosphereEnabled
        ? 1
        : 0,
      now + 1
    );

    // Musical Theme.
    themeGain.gain.setValueAtTime(
      0,
      now
    );

    themeGain.gain.linearRampToValueAtTime(
      config.musicalThemeEnabled
        ? 1
        : 0,
      now + 1
    );

    // Nature.
    Object.entries(
      config.natureVolumes
    ).forEach(
      ([soundName, volume]) => {
        const gain =
          natureGains[
            soundName
          ];

        if (!gain) {
          return;
        }

        gain.gain.setValueAtTime(
          0,
          now
        );

        gain.gain.linearRampToValueAtTime(
          volume / 100,
          now + 1
        );
      }
    );

    setPreviewSoundId(
      getSoundId(sound)
    );
  };

  // --------------------------------------------------
  // PLAY / PAUSE
  // --------------------------------------------------

  const handlePreview = (
    sound
  ) => {
    if (
      isPreviewTransitioningRef.current
    ) {
      return;
    }

    const soundId =
      getSoundId(sound);

    if (
      previewSoundId ===
      soundId
    ) {
      stopPreview();

      return;
    }

    if (previewSoundId) {
      stopPreview(() => {
        startPreview(
          sound
        );
      });

      return;
    }

    startPreview(sound);
  };

  // --------------------------------------------------
  // SELECTION AUTOMATIQUE
  // --------------------------------------------------

  // Quand la liste change :
  //
  // 1. si la méditation déjà sélectionnée
  //    existe dans cette liste,
  //    on la garde
  //
  // 2. sinon on sélectionne le premier élément
  useEffect(() => {
    // Pendant le chargement de My Creations,
    // on attend simplement les données.
    if (
      source === "creations" &&
      isLoadingCreations
    ) {
      return;
    }

    if (
      sounds.length === 0
    ) {
      setSelectedSound(
        null
      );

      onSoundChange(
        null
      );

      return;
    }

    const currentId =
      getSoundId(
        selectedMeditation
      );

    const matchingSound =
      sounds.find(
        (sound) =>
          getSoundId(sound) ===
          currentId
      );

    // Cas important :
    //
    // on arrive depuis My Creations
    // avec FocusBirdsRiver déjà sélectionnée.
    if (matchingSound) {
      setSelectedSound(
        getSoundId(
          matchingSound
        )
      );

      onSoundChange(
        matchingSound
      );

      return;
    }

    // Sinon on choisit le premier élément.
    const firstSound =
      sounds[0];

    setSelectedSound(
      getSoundId(
        firstSound
      )
    );

    onSoundChange(
      firstSound
    );

    const carousel =
      carouselRef.current;

    if (carousel) {
      carousel.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }

    updateScrollButtons();
  }, [
    source,
    myCreations,
    isLoadingCreations,
  ]);

  // --------------------------------------------------
  // FLECHES DU CAROUSEL
  // --------------------------------------------------

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

  // --------------------------------------------------
  // NETTOYAGE AUDIO
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (
        previewTimeoutRef.current
      ) {
        clearTimeout(
          previewTimeoutRef.current
        );
      }

      previewAudiosRef.current.forEach(
        (audio) => {
          audio.pause();
        }
      );

      const audioContext =
        previewAudioContextRef.current;

      if (
        audioContext &&
        audioContext.state !==
          "closed"
      ) {
        audioContext.close();
      }
    };
  }, []);

  // --------------------------------------------------
  // INTERFACE
  // --------------------------------------------------

  return (
    <section className="min-w-0">
      {/* Titre + flèches */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
          {sectionTitle}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous sounds"
            disabled={
              !canScrollLeft
            }
            onClick={() =>
              handleCarouselScroll(
                "left"
              )
            }
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

          <button
            type="button"
            aria-label="Next sounds"
            disabled={
              !canScrollRight
            }
            onClick={() =>
              handleCarouselScroll(
                "right"
              )
            }
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

      {/* Chargement */}
      {source ===
        "creations" &&
        isLoadingCreations && (
          <p className="mt-4 text-sm text-astraya-muted">
            Loading creations...
          </p>
        )}

      {/* Erreur */}
      {source ===
        "creations" &&
        creationsError && (
          <p className="mt-4 text-sm text-astraya-muted">
            {creationsError}
          </p>
        )}

      {/* Aucun résultat */}
      {source ===
        "creations" &&
        !isLoadingCreations &&
        !creationsError &&
        sounds.length === 0 && (
          <p className="mt-4 text-sm text-astraya-muted">
            No saved meditations yet.
          </p>
        )}

      {/* Carousel */}
      {sounds.length > 0 && (
        <div
          ref={carouselRef}
          onScroll={
            updateScrollButtons
          }
          className="mt-4 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sounds.map(
            (sound) => {
              const soundId =
                getSoundId(
                  sound
                );

              const isSelected =
                selectedSound ===
                soundId;

              const isPreviewPlaying =
                previewSoundId ===
                soundId;

              const hasAudioConfig =
                Boolean(
                  sound.audioConfig
                );

              return (
                <div
                  key={soundId}
                  className={`flex w-[calc((100%_-_1.5rem)/3)] shrink-0 snap-start flex-col rounded-astraya-control border p-2 backdrop-blur-sm transition-all duration-300 ease-out ${
                    isSelected
                      ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
                      : "border-astraya-border bg-astraya-surface/20"
                  }`}
                >
                  {/* Sélection */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSoundSelection(
                        sound
                      )
                    }
                    className="w-full cursor-pointer text-left"
                  >
                    <img
                      src={
                        sound.image
                      }
                      alt={
                        sound.name
                      }
                      className="aspect-square w-full rounded-xl object-cover"
                    />

                    <p className="mt-2 text-sm font-medium leading-tight text-astraya-text">
                      {
                        sound.name
                      }
                    </p>

                    <p className="mt-1 text-xs leading-4 text-astraya-muted">
                      {
                        sound.description
                      }
                    </p>
                  </button>

                  {/* Preview */}
                  <div className="mt-auto flex justify-end pt-3">
                    <button
                      type="button"
                      aria-label={
                        isPreviewPlaying
                          ? `Pause ${sound.name}`
                          : `Preview ${sound.name}`
                      }
                      disabled={
                        !hasAudioConfig
                      }
                      onClick={() =>
                        handlePreview(
                          sound
                        )
                      }
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
            }
          )}
        </div>
      )}
    </section>
  );
}

export default SoundCarousel;