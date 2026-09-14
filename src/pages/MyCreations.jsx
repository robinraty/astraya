import {
  useEffect,
  useRef,
  useState,
} from "react";

import LibraryCard from "../components/library/LibraryCard";

function MyCreations() {
  // --------------------------------------------------
  // DONNEES MONGODB
  // --------------------------------------------------

  // Contient les créations récupérées depuis MongoDB.
  const [myCreations, setMyCreations] = useState([]);

  // Indique si les créations sont en train d'être chargées.
  const [isLoading, setIsLoading] = useState(true);

  // Contient éventuellement un message d'erreur.
  const [errorMessage, setErrorMessage] = useState("");

  // --------------------------------------------------
  // PREVIEW AUDIO
  // --------------------------------------------------

  // Contient l'_id MongoDB de la création
  // actuellement en preview.
  //
  // null = aucune preview active.
  const [previewCreationId, setPreviewCreationId] =
    useState(null);

  // AudioContext utilisé uniquement par la preview.
  //
  // AudioContext est le moteur audio du navigateur.
  const previewAudioContextRef = useRef(null);

  // Contient tous les fichiers audio joués
  // pour la preview actuelle.
  //
  // Exemple :
  // pad + musical theme + 5 sons de nature.
  const previewAudiosRef = useRef([]);

  // Contient tous les GainNodes.
  //
  // Un GainNode sert à contrôler le volume
  // d'une piste audio et à faire les fades.
  const previewGainsRef = useRef([]);

  // Empêche de cliquer plusieurs fois
  // pendant un fade-in ou fade-out.
  const isPreviewTransitioningRef = useRef(false);

  // Timeout utilisé pendant l'arrêt d'une preview.
  const previewTimeoutRef = useRef(null);

  // --------------------------------------------------
  // CHARGEMENT DES CREATIONS
  // --------------------------------------------------

  // Ce useEffect se lance une fois
  // lorsque la page apparaît.
  //
  // Il demande au backend toutes les créations sauvegardées.
  useEffect(() => {
    const fetchCreations = async () => {
      try {
        // Envoie une requête GET vers Express.
        const response = await fetch(
          "http://localhost:3000/creations"
        );

        // Si Express renvoie une erreur,
        // on passe directement dans le catch.
        if (!response.ok) {
          throw new Error(
            "Impossible de récupérer les créations."
          );
        }

        // Transforme la réponse JSON
        // en tableau JavaScript.
        const creations = await response.json();

        // Stocke les créations dans le state React.
        setMyCreations(creations);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des créations :",
          error
        );

        setErrorMessage(
          "Unable to load your creations."
        );
      } finally {
        // La requête est terminée,
        // qu'elle ait fonctionné ou non.
        setIsLoading(false);
      }
    };

    fetchCreations();
  }, []);

  // --------------------------------------------------
  // DESCRIPTION DES CREATIONS
  // --------------------------------------------------

  // Transforme l'audioConfig en petit texte lisible.
  //
  // Exemple :
  // Forest 70% • Birds 20% • River 45%
  const getCreationDescription = (audioConfig) => {
    if (!audioConfig?.natureVolumes) {
      return "Custom meditation";
    }

    const activeSounds = Object.entries(
      audioConfig.natureVolumes
    )
      // Garde uniquement les sons
      // dont le volume est supérieur à 0.
      .filter(([, volume]) => volume > 0)

      // Transforme chaque son en texte lisible.
      .map(([sound, volume]) => {
        const formattedSound =
          sound.charAt(0).toUpperCase() +
          sound.slice(1);

        return `${formattedSound} ${volume}%`;
      });

    // Si aucun son de nature n'est actif.
    if (activeSounds.length === 0) {
      return "Custom meditation";
    }

    return activeSounds.join(" • ");
  };

  // --------------------------------------------------
  // ARRET D'UNE PREVIEW
  // --------------------------------------------------

  const stopPreview = (onComplete = null) => {
    const audioContext =
      previewAudioContextRef.current;

    // S'il n'y a aucun moteur audio,
    // il n'y a rien à arrêter.
    if (!audioContext) {
      setPreviewCreationId(null);

      if (onComplete) {
        onComplete();
      }

      return;
    }

    // Bloque temporairement les nouveaux clics.
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

    // Attend la fin du fade-out
    // avant d'arrêter réellement les fichiers audio.
    previewTimeoutRef.current = setTimeout(() => {
      previewAudiosRef.current.forEach((audio) => {
        audio.pause();
      });

      // Ferme l'ancien moteur audio.
      if (audioContext.state !== "closed") {
        audioContext.close();
      }

      // Nettoie toutes les références.
      previewAudioContextRef.current = null;
      previewAudiosRef.current = [];
      previewGainsRef.current = [];

      setPreviewCreationId(null);

      isPreviewTransitioningRef.current = false;
      previewTimeoutRef.current = null;

      // Permet éventuellement de lancer
      // directement une autre preview après celle-ci.
      if (onComplete) {
        onComplete();
      }
    }, 450);
  };

  // --------------------------------------------------
  // LANCEMENT D'UNE PREVIEW
  // --------------------------------------------------

  const startPreview = (creation) => {
    // Une création doit obligatoirement avoir
    // un audioConfig pour pouvoir être jouée.
    if (!creation.audioConfig) {
      return;
    }

    const config = creation.audioConfig;

    // Récupère le moteur audio du navigateur.
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();

    previewAudioContextRef.current = audioContext;

    // Tableaux temporaires contenant
    // toutes les couches audio de cette preview.
    const audios = [];
    const gains = [];

    // --------------------------------------------------
    // PAD ATMOSPHERE
    // --------------------------------------------------

    // Exemple :
    // atmosphere = deep
    // pitch = dark
    //
    // donne :
    // deep-dark.wav
    const padAudio = new Audio(
      `${
        import.meta.env.BASE_URL
      }audio/pads/${config.atmosphere}-${config.pitch}.wav`
    );

    // Le fichier tourne en boucle indéfiniment.
    padAudio.loop = true;

    // Transforme l'élément Audio
    // en source utilisable par Web Audio API.
    const padSource =
      audioContext.createMediaElementSource(padAudio);

    // GainNode = contrôle du volume.
    const padGain = audioContext.createGain();

    // Commence silencieux pour permettre un fade-in.
    padGain.gain.value = 0;

    padSource.connect(padGain);
    padGain.connect(audioContext.destination);

    audios.push(padAudio);
    gains.push(padGain);

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

    // Stocke séparément les GainNodes
    // des sons de nature.
    //
    // Cela permet d'appliquer
    // le bon volume à chaque son.
    const natureGains = {};

    natureSounds.forEach((soundName) => {
      const audio = new Audio(
        `${
          import.meta.env.BASE_URL
        }audio/nature/${soundName}.wav`
      );

      // Chaque son tourne en boucle.
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

    // Sauvegarde toutes les pistes et tous les volumes
    // dans les refs pour pouvoir les arrêter plus tard.
    previewAudiosRef.current = audios;
    previewGainsRef.current = gains;

    // Certains navigateurs suspendent AudioContext
    // tant que l'utilisateur n'a pas interagi avec la page.
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Lance toutes les pistes en même temps.
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

        // Les volumes sont stockés entre 0 et 100.
        //
        // Web Audio utilise une valeur entre 0 et 1.
        //
        // Exemple :
        // 70 devient 0.7.
        gain.gain.linearRampToValueAtTime(
          volume / 100,
          now + 1
        );
      }
    );

    // Mémorise quelle création est en train de jouer.
    setPreviewCreationId(creation._id);
  };

  // --------------------------------------------------
  // CLIC SUR PLAY / PAUSE
  // --------------------------------------------------

  const handlePreview = (creation) => {
    // Ignore les clics pendant une transition audio.
    if (isPreviewTransitioningRef.current) {
      return;
    }

    // Si cette création joue déjà,
    // un nouveau clic l'arrête.
    if (previewCreationId === creation._id) {
      stopPreview();
      return;
    }

    // Si une autre création joue déjà,
    // on l'arrête d'abord.
    //
    // Une fois arrêtée,
    // on lance automatiquement la nouvelle.
    if (previewCreationId) {
      stopPreview(() => {
        startPreview(creation);
      });

      return;
    }

    // Sinon aucune preview ne joue,
    // donc on peut simplement lancer celle-ci.
    startPreview(creation);
  };

  // --------------------------------------------------
  // NETTOYAGE
  // --------------------------------------------------

  // Ce useEffect ne fait rien au lancement.
  //
  // La fonction retournée est exécutée
  // lorsque MyCreations disparaît de l'écran.
  //
  // Elle permet d'éviter qu'une preview
  // continue à jouer après avoir changé de page.
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
    <div className="px-2 py-5 text-astraya-text">
      {/* Conteneur principal */}
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Introduction */}
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

        {/* Affiché pendant le chargement */}
        {isLoading && (
          <p className="text-sm text-astraya-muted">
            Loading creations...
          </p>
        )}

        {/* Affiché si le backend est inaccessible */}
        {errorMessage && (
          <p className="text-sm text-astraya-muted">
            {errorMessage}
          </p>
        )}

        {/* Affiché si aucune création n'existe */}
        {!isLoading &&
          !errorMessage &&
          myCreations.length === 0 && (
            <p className="text-sm text-astraya-muted">
              No saved meditations yet.
            </p>
          )}

        {/* Liste des créations MongoDB */}
        <section className="flex flex-col gap-3">
          {myCreations.map((meditation) => (
            <LibraryCard
              // Identifiant unique créé par MongoDB.
              key={meditation._id}

              // Données visuelles.
              name={meditation.name}
              description={getCreationDescription(
                meditation.audioConfig
              )}
              image={`${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-moon-piano.png`}

              // Indique à la carte si elle est
              // actuellement en train de jouer.
              isPreviewPlaying={
                previewCreationId === meditation._id
              }

              // Donne à la carte la fonction
              // qui lance ou arrête sa preview.
              onPreview={() =>
                handlePreview(meditation)
              }
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default MyCreations;