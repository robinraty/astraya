import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import LibraryCard from "../components/library/LibraryCard";

import {
  useAuth,
} from "../context/AuthContext";

function MyCreations() {
  const navigate =
    useNavigate();

  const {
    token,
    logout,
  } = useAuth();

  // --------------------------------------------------
  // DONNEES MONGODB
  // --------------------------------------------------

  // ! Je fais un state myCreations, dont la valeur initiale est un tableau vide []
  const [
    myCreations,
    setMyCreations,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // --------------------------------------------------
  // PREVIEW AUDIO
  // --------------------------------------------------

  const [
    previewCreationId,
    setPreviewCreationId,
  ] = useState(null);

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
  // IMAGE
  // --------------------------------------------------

  const getCreationImage = (
    imagePath
  ) => {
    const finalPath =
      imagePath ||
      "images/ambiant-images/astraya-background-3.png";

    return `${
      import.meta.env.BASE_URL
    }${finalPath}`;
  };














  // !--------------------------------------------------
  // ! CHARGEMENT
  // !--------------------------------------------------

  // fetch envoie une requête HTTP GET à mon backend pour récupérer les créations. Dans le backend, Mongoose va les chercher dans MongoDB, puis le backend les renvoie au frontend sous forme d'un tableau

  useEffect(() => {
    const fetchCreations =
      async () => {
        if (!token) {
          setIsLoading(false);

          setErrorMessage(
            "Log in to access your saved meditations."
          );

          return;
        }

        try {
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

          if (
            response.status ===
            401
          ) {
            logout();

            setErrorMessage(
              "Your session has expired."
            );

            navigate(
              "/login"
            );

            return;
          }

          if (!response.ok) {
            throw new Error(
              "Impossible de récupérer les créations."
            );
          }


// Le GET récupère un TABLEAU de créations
          const creations =
            await response.json();

// On stock le tableau creations dans le state MyCreations.
          setMyCreations(
            creations
          );

          setErrorMessage(
            ""
          );
        } catch (error) {
          console.error(
            "Erreur lors du chargement des créations :",
            error
          );

          setErrorMessage(
            "Unable to load your creations."
          );
        } finally {
          setIsLoading(
            false
          );
        }
      };

    fetchCreations();
  }, [
    token,
    logout,
    navigate,
  ]);
















  // --------------------------------------------------
  // DESCRIPTION
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
          ([
            sound,
            volume,
          ]) => {
            const formattedSound =
              sound
                .charAt(0)
                .toUpperCase() +
              sound.slice(1);

            return `${formattedSound} ${volume}%`;
          }
        );

    if (
      activeSounds.length ===
      0
    ) {
      return "Custom meditation";
    }

    return activeSounds.join(
      " • "
    );
  };

  // --------------------------------------------------
  // OUVRIR DANS MEDITATE
  // --------------------------------------------------

  const handleMeditate = (
    creation
  ) => {
    const meditation = {
      ...creation,

      image:
        getCreationImage(
          creation.image
        ),

      description:
        getCreationDescription(
          creation.audioConfig
        ),
    };

    navigate(
      "/meditate",
      {
        state: {
          source:
            "creations",

          selectedMeditation:
            meditation,
        },
      }
    );
  };

  // --------------------------------------------------
  // SUPPRESSION
  // --------------------------------------------------

  const handleDeleteCreation =
    async (creation) => {
      // Demande une confirmation avant
      // de supprimer définitivement.
      const isConfirmed =
        window.confirm(
          `Delete "${creation.name}"?`
        );

      if (!isConfirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `http://localhost:3000/creations/${creation._id}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        // Session expirée.
        if (
          response.status ===
          401
        ) {
          logout();

          navigate(
            "/login"
          );

          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to delete creation."
          );
        }

        // Si la création supprimée
        // était actuellement en preview,
        // on arrête d'abord l'audio.
        if (
          previewCreationId ===
          creation._id
        ) {
          stopPreview();
        }

        // Supprime immédiatement la création
        // du state React.
        //
        // Pas besoin de recharger toute la page.
        setMyCreations(
          (
            currentCreations
          ) =>
            currentCreations.filter(
              (
                currentCreation
              ) =>
                currentCreation._id !==
                creation._id
            )
        );
      } catch (error) {
        console.error(
          "Delete creation error:",
          error
        );

        alert(
          "Unable to delete creation."
        );
      }
    };

  // --------------------------------------------------
  // STOP PREVIEW
  // --------------------------------------------------

  const stopPreview = (
    onComplete = null
  ) => {
    const audioContext =
      previewAudioContextRef.current;

    if (!audioContext) {
      setPreviewCreationId(
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

        setPreviewCreationId(
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
  // START PREVIEW
  // --------------------------------------------------

  const startPreview = (
    creation
  ) => {
    if (
      !creation.audioConfig
    ) {
      return;
    }

    const config =
      creation.audioConfig;

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

    const padAudio =
      new Audio(
        `${
          import.meta.env
            .BASE_URL
        }audio/pads/${config.atmosphere}-${config.pitch}.wav`
      );

    padAudio.loop = true;

    const padSource =
      audioContext.createMediaElementSource(
        padAudio
      );

    const padGain =
      audioContext.createGain();

    padGain.gain.value =
      0;

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

    const themeAudio =
      new Audio(
        `${
          import.meta.env
            .BASE_URL
        }audio/themes/soft-strings-${config.pitch}.wav`
      );

    themeAudio.loop =
      true;

    const themeSource =
      audioContext.createMediaElementSource(
        themeAudio
      );

    const themeGain =
      audioContext.createGain();

    themeGain.gain.value =
      0;

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
        const audio =
          new Audio(
            `${
              import.meta.env
                .BASE_URL
            }audio/nature/${soundName}.wav`
          );

        audio.loop = true;

        const source =
          audioContext.createMediaElementSource(
            audio
          );

        const gain =
          audioContext.createGain();

        gain.gain.value =
          0;

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
      ([
        soundName,
        volume,
      ]) => {
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

    setPreviewCreationId(
      creation._id
    );
  };

  // --------------------------------------------------
  // PLAY / PAUSE
  // --------------------------------------------------

  const handlePreview = (
    creation
  ) => {
    if (
      isPreviewTransitioningRef.current
    ) {
      return;
    }

    if (
      previewCreationId ===
      creation._id
    ) {
      stopPreview();

      return;
    }

    if (
      previewCreationId
    ) {
      stopPreview(() => {
        startPreview(
          creation
        );
      });

      return;
    }

    startPreview(
      creation
    );
  };

  // --------------------------------------------------
  // NETTOYAGE
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
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
            My Creations
          </p>

          <h1 className="mt-2 text-2xl font-medium text-astraya-text">
            Saved Meditations
          </h1>

          <p className="mt-1 text-sm text-astraya-muted">
            Find and replay your personal soundscapes.
          </p>
        </section>

        {isLoading && (
          <p className="text-sm text-astraya-muted">
            Loading creations...
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-astraya-muted">
            {errorMessage}
          </p>
        )}

        {!isLoading &&
          !errorMessage &&
          myCreations.length ===
            0 && (
            <p className="text-sm text-astraya-muted">
              No saved meditations yet.
            </p>
          )}

        <section className="flex flex-col gap-3">
          {myCreations.map(
            (
              meditation
            ) => (
              <LibraryCard
                key={
                  meditation._id
                }

                name={
                  meditation.name
                }

                description={getCreationDescription(
                  meditation.audioConfig
                )}

                image={getCreationImage(
                  meditation.image
                )}

                isPreviewPlaying={
                  previewCreationId ===
                  meditation._id
                }

                onPreview={() =>
                  handlePreview(
                    meditation
                  )
                }

                onMeditate={() =>
                  handleMeditate(
                    meditation
                  )
                }

                // Supprime cette création.
                onDelete={() =>
                  handleDeleteCreation(
                    meditation
                  )
                }
              />
            )
          )}
        </section>
      </div>
    </div>
  );
}

export default MyCreations;