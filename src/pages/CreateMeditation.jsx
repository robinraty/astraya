import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import PitchSelector from "../components/createMeditation/PitchSelector";
import AtmosphereSelector from "../components/createMeditation/AtmosphereSelector";
import MusicalThemeSelector from "../components/createMeditation/MusicalThemeSelector";
import NatureSoundsMixer from "../components/createMeditation/NatureSoundsMixer";
import MeditationActions from "../components/createMeditation/MeditationActions";
import CreationName from "../components/createMeditation/CreationName";

import DurationSelector from "../components/meditationSetup/DurationSelector";
import StartMeditation from "../components/meditationSetup/StartMeditation";

import { useAuth } from "../context/AuthContext";

function CreateMeditation() {
  // Permet de changer de page avec React Router.
  //
  // On l'utilise notamment pour envoyer l'utilisateur
  // vers /login s'il essaie de sauvegarder sans être connecté.
  const navigate = useNavigate();

  // Récupère les informations d'authentification
  // depuis AuthContext.
  //
  // token :
  // JWT reçu après le login.
  //
  // logout :
  // permet de supprimer la session si le token
  // est invalide ou expiré.
  const {
    token,
    logout,
  } = useAuth();

  // Est-ce que la preview est en train de jouer ?
  const [isPreviewPlaying, setIsPreviewPlaying] =
    useState(false);

  // Nom de la création utilisateur.
  //
  // Ce nom sera sauvegardé dans MongoDB
  // avec l'audioConfig.
  const [creationName, setCreationName] =
    useState("Moon Lake");

  // Indique si une sauvegarde est actuellement en cours.
  //
  // Cela permet notamment de désactiver temporairement
  // le bouton Save pendant la requête vers le backend.
  const [isSaving, setIsSaving] =
    useState(false);

  // Réglages principaux du pad.
  const [selectedPitch, setSelectedPitch] =
    useState("bright");

  const [
    selectedAtmosphere,
    setSelectedAtmosphere,
  ] = useState("airy");

  // Le pad Atmosphere est actif de base.
  const [
    isAtmosphereEnabled,
    setIsAtmosphereEnabled,
  ] = useState(true);

  // Le Musical Theme est désactivé de base.
  const [
    isMusicalThemeEnabled,
    setIsMusicalThemeEnabled,
  ] = useState(false);

  // Volumes des sons de nature.
  const [rainVolume, setRainVolume] =
    useState(0);

  const [forestVolume, setForestVolume] =
    useState(25);

  const [birdsVolume, setBirdsVolume] =
    useState(80);

  const [riverVolume, setRiverVolume] =
    useState(0);

  const [wavesVolume, setWavesVolume] =
    useState(0);

  // Durée de méditation choisie.
  // 15 minutes par défaut.
  const [
    selectedDuration,
    setSelectedDuration,
  ] = useState(15);

  // --------------------------------------------------
  // CONFIGURATION AUDIO
  // --------------------------------------------------

  // Configuration finale du mix.
  //
  // Cet objet est utilisé à la fois :
  // - pour lancer une vraie session
  // - pour sauvegarder la création dans MongoDB
  const audioConfig = {
    pitch: selectedPitch,
    atmosphere: selectedAtmosphere,
    atmosphereEnabled: isAtmosphereEnabled,
    musicalThemeEnabled:
      isMusicalThemeEnabled,

    natureVolumes: {
      rain: rainVolume,
      forest: forestVolume,
      birds: birdsVolume,
      river: riverVolume,
      waves: wavesVolume,
    },
  };

  // --------------------------------------------------
  // SAUVEGARDE DANS MONGODB
  // --------------------------------------------------

  // Envoie la création actuelle vers notre API Express.
  const handleSaveCreation = async () => {
    // Empêche d'enregistrer une création sans nom.
    if (!creationName.trim()) {
      alert(
        "Please enter a creation name."
      );

      return;
    }

    // Une création sauvegardée appartient maintenant
    // obligatoirement à un utilisateur.
    //
    // Sans JWT, le backend refuserait de toute façon
    // la requête avec une erreur 401.
    if (!token) {
      alert(
        "Please log in to save your creation."
      );

      // Redirige l'utilisateur vers la page Login.
      navigate("/login");

      return;
    }

    try {
      // Indique que la sauvegarde commence.
      setIsSaving(true);

      // Envoie une requête POST
      // vers notre backend Express.
      const response = await fetch(
        "http://localhost:3000/creations",
        {
          method: "POST",

          headers: {
            // Indique que les données envoyées
            // sont au format JSON.
            "Content-Type":
              "application/json",

            // Envoie le JWT au backend.
            //
            // Le format attendu par notre middleware est :
            //
            // Authorization: Bearer LE_TOKEN
            //
            // Express pourra donc vérifier
            // quel utilisateur est connecté.
            Authorization:
              `Bearer ${token}`,
          },

          // Transforme notre objet JavaScript
          // en JSON pour pouvoir l'envoyer.
          //
          // On n'envoie PAS le userId.
          //
          // Le backend récupère le vrai userId
          // directement depuis le JWT validé.
          body: JSON.stringify({
            name:
              creationName.trim(),

            audioConfig,
          }),
        }
      );

      // Si le serveur renvoie 401,
      // cela signifie que le JWT est absent,
      // invalide ou expiré.
      if (response.status === 401) {
        // Supprime la session locale.
        logout();

        alert(
          "Your session has expired. Please log in again."
        );

        // Retour vers la page Login.
        navigate("/login");

        return;
      }

      // Transforme la réponse JSON
      // en objet JavaScript.
      const data =
        await response.json();

      // Si le backend renvoie une autre erreur,
      // on passe dans le catch.
      if (!response.ok) {
        throw new Error(
          data.message ||
            "Save failed"
        );
      }

      // La création a été sauvegardée
      // et contient maintenant notamment :
      //
      // _id
      // userId
      // createdAt
      // updatedAt
      console.log(
        "Creation saved:",
        data
      );

      alert("Creation saved!");
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      alert(
        "Unable to save creation."
      );
    } finally {
      // Cette partie s'exécute
      // que la sauvegarde réussisse ou échoue.
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // MEDITATION TEMPORAIRE POUR LA SESSION
  // --------------------------------------------------

  // Méditation utilisée par la page Session.
  //
  // Le nom correspond au nom choisi
  // par l'utilisateur.
  const customMeditation = {
    name: creationName,

    image: `${
      import.meta.env.BASE_URL
    }images/ambiant-images/astraya-background-3.png`,
  };

  // --------------------------------------------------
  // REFERENCES AUDIO
  // --------------------------------------------------

  // Moteur audio principal du navigateur.
  const audioContextRef = useRef(null);

  // Deux lecteurs pour les pads.
  const audioOneRef = useRef(null);
  const audioTwoRef = useRef(null);

  // Contrôle du volume des deux pads.
  const gainOneRef = useRef(null);
  const gainTwoRef = useRef(null);

  // Lecteur actuellement actif
  // et lecteur disponible.
  const activeAudioRef = useRef(null);
  const inactiveAudioRef = useRef(null);

  // Même chose pour leurs volumes.
  const activeGainRef = useRef(null);
  const inactiveGainRef = useRef(null);

  // Deux lecteurs pour le Musical Theme.
  const themeAudioOneRef = useRef(null);
  const themeAudioTwoRef = useRef(null);

  // Contrôle du volume des deux thèmes.
  const themeGainOneRef = useRef(null);
  const themeGainTwoRef = useRef(null);

  // Thème actif et thème disponible.
  const activeThemeAudioRef = useRef(null);
  const inactiveThemeAudioRef = useRef(null);

  // Même chose pour leurs volumes.
  const activeThemeGainRef = useRef(null);
  const inactiveThemeGainRef = useRef(null);

  // Contient les 5 sons de nature.
  const natureAudioRef = useRef({});

  // Contient les 5 contrôles
  // de volume correspondants.
  const natureGainRef = useRef({});

  // Timers utilisés par les transitions.
  const crossfadeTimeoutRef = useRef(null);

  const themeCrossfadeTimeoutRef =
    useRef(null);

  const pauseTimeoutRef = useRef(null);

  const previewLockTimeoutRef =
    useRef(null);

  // Verrou anti-spam
  // pour les changements de pad.
  const isPadTransitioningRef =
    useRef(false);

  // Verrou anti double-clic
  // Preview / Pause.
  const isPreviewTransitioningRef =
    useRef(false);

  // --------------------------------------------------
  // CONTROLES
  // --------------------------------------------------

  const handlePitchChange = (pitch) => {
    if (pitch === selectedPitch) {
      return;
    }

    if (
      isPadTransitioningRef.current ||
      isPreviewTransitioningRef.current
    ) {
      return;
    }

    if (isPreviewPlaying) {
      isPadTransitioningRef.current =
        true;
    }

    setSelectedPitch(pitch);
  };

  const handleAtmosphereChange = (
    atmosphere
  ) => {
    if (
      atmosphere === selectedAtmosphere
    ) {
      return;
    }

    if (
      isPadTransitioningRef.current ||
      isPreviewTransitioningRef.current
    ) {
      return;
    }

    if (isPreviewPlaying) {
      isPadTransitioningRef.current =
        true;
    }

    setSelectedAtmosphere(
      atmosphere
    );
  };

  const handlePreviewChange = (
    nextValue
  ) => {
    if (
      isPreviewTransitioningRef.current ||
      isPadTransitioningRef.current
    ) {
      return;
    }

    isPreviewTransitioningRef.current =
      true;

    setIsPreviewPlaying(nextValue);

    if (
      previewLockTimeoutRef.current
    ) {
      clearTimeout(
        previewLockTimeoutRef.current
      );
    }

    previewLockTimeoutRef.current =
      setTimeout(() => {
        isPreviewTransitioningRef.current =
          false;

        previewLockTimeoutRef.current =
          null;
      }, 700);
  };

  // --------------------------------------------------
  // INITIALISATION AUDIO
  // --------------------------------------------------

  useEffect(() => {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    const audioContext =
      new AudioContext();

    const initialPadPath = `${
      import.meta.env.BASE_URL
    }audio/pads/airy-bright.wav`;

    const audioOne =
      new Audio(initialPadPath);

    const audioTwo =
      new Audio(initialPadPath);

    audioOne.loop = true;
    audioTwo.loop = true;

    const sourceOne =
      audioContext.createMediaElementSource(
        audioOne
      );

    const sourceTwo =
      audioContext.createMediaElementSource(
        audioTwo
      );

    const gainOne =
      audioContext.createGain();

    const gainTwo =
      audioContext.createGain();

    gainOne.gain.value = 0;
    gainTwo.gain.value = 0;

    sourceOne.connect(gainOne);
    gainOne.connect(
      audioContext.destination
    );

    sourceTwo.connect(gainTwo);
    gainTwo.connect(
      audioContext.destination
    );

    audioOneRef.current = audioOne;
    audioTwoRef.current = audioTwo;

    gainOneRef.current = gainOne;
    gainTwoRef.current = gainTwo;

    activeAudioRef.current = audioOne;
    inactiveAudioRef.current = audioTwo;

    activeGainRef.current = gainOne;
    inactiveGainRef.current = gainTwo;

    const initialThemePath = `${
      import.meta.env.BASE_URL
    }audio/themes/soft-strings-bright.wav`;

    const themeAudioOne =
      new Audio(initialThemePath);

    const themeAudioTwo =
      new Audio(initialThemePath);

    themeAudioOne.loop = true;
    themeAudioTwo.loop = true;

    const themeSourceOne =
      audioContext.createMediaElementSource(
        themeAudioOne
      );

    const themeSourceTwo =
      audioContext.createMediaElementSource(
        themeAudioTwo
      );

    const themeGainOne =
      audioContext.createGain();

    const themeGainTwo =
      audioContext.createGain();

    themeGainOne.gain.value = 0;
    themeGainTwo.gain.value = 0;

    themeSourceOne.connect(
      themeGainOne
    );

    themeGainOne.connect(
      audioContext.destination
    );

    themeSourceTwo.connect(
      themeGainTwo
    );

    themeGainTwo.connect(
      audioContext.destination
    );

    themeAudioOneRef.current =
      themeAudioOne;

    themeAudioTwoRef.current =
      themeAudioTwo;

    themeGainOneRef.current =
      themeGainOne;

    themeGainTwoRef.current =
      themeGainTwo;

    activeThemeAudioRef.current =
      themeAudioOne;

    inactiveThemeAudioRef.current =
      themeAudioTwo;

    activeThemeGainRef.current =
      themeGainOne;

    inactiveThemeGainRef.current =
      themeGainTwo;

    const natureSounds = [
      "rain",
      "forest",
      "birds",
      "river",
      "waves",
    ];

    natureSounds.forEach((sound) => {
      const audio = new Audio(
        `${
          import.meta.env.BASE_URL
        }audio/nature/${sound}.wav`
      );

      audio.loop = true;

      const source =
        audioContext.createMediaElementSource(
          audio
        );

      const gain =
        audioContext.createGain();

      gain.gain.value = 0;

      source.connect(gain);

      gain.connect(
        audioContext.destination
      );

      natureAudioRef.current[
        sound
      ] = audio;

      natureGainRef.current[
        sound
      ] = gain;
    });

    audioContextRef.current =
      audioContext;

    return () => {
      if (
        crossfadeTimeoutRef.current
      ) {
        clearTimeout(
          crossfadeTimeoutRef.current
        );
      }

      if (
        themeCrossfadeTimeoutRef.current
      ) {
        clearTimeout(
          themeCrossfadeTimeoutRef.current
        );
      }

      if (
        pauseTimeoutRef.current
      ) {
        clearTimeout(
          pauseTimeoutRef.current
        );
      }

      if (
        previewLockTimeoutRef.current
      ) {
        clearTimeout(
          previewLockTimeoutRef.current
        );
      }

      audioOne.pause();
      audioTwo.pause();

      themeAudioOne.pause();
      themeAudioTwo.pause();

      Object.values(
        natureAudioRef.current
      ).forEach((audio) => {
        audio.pause();
      });

      audioContext.close();
    };
  }, []);

  // --------------------------------------------------
  // PREVIEW / PAUSE
  // --------------------------------------------------

  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    const activeAudio =
      activeAudioRef.current;

    const inactiveAudio =
      inactiveAudioRef.current;

    const activeGain =
      activeGainRef.current;

    const inactiveGain =
      inactiveGainRef.current;

    const activeThemeAudio =
      activeThemeAudioRef.current;

    const inactiveThemeAudio =
      inactiveThemeAudioRef.current;

    const activeThemeGain =
      activeThemeGainRef.current;

    const inactiveThemeGain =
      inactiveThemeGainRef.current;

    if (
      !audioContext ||
      !activeAudio ||
      !inactiveAudio ||
      !activeGain ||
      !inactiveGain ||
      !activeThemeAudio ||
      !inactiveThemeAudio ||
      !activeThemeGain ||
      !inactiveThemeGain
    ) {
      return;
    }

    const now =
      audioContext.currentTime;

    if (
      pauseTimeoutRef.current
    ) {
      clearTimeout(
        pauseTimeoutRef.current
      );

      pauseTimeoutRef.current =
        null;
    }

    activeGain.gain.cancelScheduledValues(
      now
    );

    inactiveGain.gain.cancelScheduledValues(
      now
    );

    activeThemeGain.gain.cancelScheduledValues(
      now
    );

    inactiveThemeGain.gain.cancelScheduledValues(
      now
    );

    if (isPreviewPlaying) {
      if (
        audioContext.state ===
        "suspended"
      ) {
        audioContext.resume();
      }

      activeAudio.play();

      activeGain.gain.setValueAtTime(
        activeGain.gain.value,
        now
      );

      activeGain.gain.linearRampToValueAtTime(
        isAtmosphereEnabled
          ? 1
          : 0,
        now + 1.5
      );

      activeThemeAudio.play();

      activeThemeGain.gain.setValueAtTime(
        activeThemeGain.gain.value,
        now
      );

      activeThemeGain.gain.linearRampToValueAtTime(
        isMusicalThemeEnabled
          ? 1
          : 0,
        now + 1.5
      );

      const natureVolumes = {
        rain: rainVolume,
        forest: forestVolume,
        birds: birdsVolume,
        river: riverVolume,
        waves: wavesVolume,
      };

      Object.entries(
        natureAudioRef.current
      ).forEach(
        ([sound, audio]) => {
          const gain =
            natureGainRef.current[
              sound
            ];

          const targetVolume =
            natureVolumes[sound] /
            100;

          audio.play();

          gain.gain.cancelScheduledValues(
            now
          );

          gain.gain.setValueAtTime(
            gain.gain.value,
            now
          );

          gain.gain.linearRampToValueAtTime(
            targetVolume,
            now + 1.5
          );
        }
      );
    } else {
      activeGain.gain.setValueAtTime(
        activeGain.gain.value,
        now
      );

      activeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.6
      );

      inactiveGain.gain.setValueAtTime(
        inactiveGain.gain.value,
        now
      );

      inactiveGain.gain.linearRampToValueAtTime(
        0,
        now + 0.6
      );

      activeThemeGain.gain.setValueAtTime(
        activeThemeGain.gain.value,
        now
      );

      activeThemeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.6
      );

      inactiveThemeGain.gain.setValueAtTime(
        inactiveThemeGain.gain.value,
        now
      );

      inactiveThemeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.6
      );

      Object.values(
        natureGainRef.current
      ).forEach((gain) => {
        gain.gain.cancelScheduledValues(
          now
        );

        gain.gain.setValueAtTime(
          gain.gain.value,
          now
        );

        gain.gain.linearRampToValueAtTime(
          0,
          now + 0.6
        );
      });

      pauseTimeoutRef.current =
        setTimeout(() => {
          audioOneRef.current?.pause();
          audioTwoRef.current?.pause();

          themeAudioOneRef.current?.pause();
          themeAudioTwoRef.current?.pause();

          Object.values(
            natureAudioRef.current
          ).forEach((audio) => {
            audio.pause();
          });

          pauseTimeoutRef.current =
            null;
        }, 650);
    }
  }, [isPreviewPlaying]);

  // --------------------------------------------------
  // CHANGEMENT DU PAD
  // --------------------------------------------------

  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    const activeAudio =
      activeAudioRef.current;

    const inactiveAudio =
      inactiveAudioRef.current;

    const activeGain =
      activeGainRef.current;

    const inactiveGain =
      inactiveGainRef.current;

    if (
      !audioContext ||
      !activeAudio ||
      !inactiveAudio ||
      !activeGain ||
      !inactiveGain
    ) {
      return;
    }

    const newAudioPath = `${
      import.meta.env.BASE_URL
    }audio/pads/${selectedAtmosphere}-${selectedPitch}.wav`;

    if (!isPreviewPlaying) {
      activeAudio.src =
        newAudioPath;

      activeAudio.loop = true;
      activeAudio.currentTime = 0;

      isPadTransitioningRef.current =
        false;

      return;
    }

    if (
      crossfadeTimeoutRef.current
    ) {
      clearTimeout(
        crossfadeTimeoutRef.current
      );

      crossfadeTimeoutRef.current =
        null;
    }

    const now =
      audioContext.currentTime;

    activeGain.gain.cancelScheduledValues(
      now
    );

    inactiveGain.gain.cancelScheduledValues(
      now
    );

    inactiveAudio.pause();

    inactiveAudio.src =
      newAudioPath;

    inactiveAudio.loop = true;

    try {
      inactiveAudio.currentTime =
        activeAudio.currentTime;
    } catch {
      inactiveAudio.currentTime =
        0;
    }

    inactiveGain.gain.setValueAtTime(
      0,
      now
    );

    inactiveAudio.play();

    activeGain.gain.setValueAtTime(
      activeGain.gain.value,
      now
    );

    activeGain.gain.linearRampToValueAtTime(
      0,
      now + 0.5
    );

    inactiveGain.gain.linearRampToValueAtTime(
      isAtmosphereEnabled
        ? 1
        : 0,
      now + 0.5
    );

    crossfadeTimeoutRef.current =
      setTimeout(() => {
        activeAudio.pause();

        activeAudioRef.current =
          inactiveAudio;

        inactiveAudioRef.current =
          activeAudio;

        activeGainRef.current =
          inactiveGain;

        inactiveGainRef.current =
          activeGain;

        crossfadeTimeoutRef.current =
          null;

        isPadTransitioningRef.current =
          false;
      }, 550);
  }, [
    selectedPitch,
    selectedAtmosphere,
  ]);

  // --------------------------------------------------
  // CHANGEMENT DU MUSICAL THEME
  // --------------------------------------------------

  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    const activeThemeAudio =
      activeThemeAudioRef.current;

    const inactiveThemeAudio =
      inactiveThemeAudioRef.current;

    const activeThemeGain =
      activeThemeGainRef.current;

    const inactiveThemeGain =
      inactiveThemeGainRef.current;

    if (
      !audioContext ||
      !activeThemeAudio ||
      !inactiveThemeAudio ||
      !activeThemeGain ||
      !inactiveThemeGain
    ) {
      return;
    }

    const newThemePath = `${
      import.meta.env.BASE_URL
    }audio/themes/soft-strings-${selectedPitch}.wav`;

    if (!isPreviewPlaying) {
      activeThemeAudio.src =
        newThemePath;

      activeThemeAudio.loop =
        true;

      activeThemeAudio.currentTime =
        0;

      return;
    }

    if (
      themeCrossfadeTimeoutRef.current
    ) {
      clearTimeout(
        themeCrossfadeTimeoutRef.current
      );

      themeCrossfadeTimeoutRef.current =
        null;
    }

    const now =
      audioContext.currentTime;

    activeThemeGain.gain.cancelScheduledValues(
      now
    );

    inactiveThemeGain.gain.cancelScheduledValues(
      now
    );

    inactiveThemeAudio.pause();

    inactiveThemeAudio.src =
      newThemePath;

    inactiveThemeAudio.loop =
      true;

    try {
      inactiveThemeAudio.currentTime =
        activeThemeAudio.currentTime;
    } catch {
      inactiveThemeAudio.currentTime =
        0;
    }

    inactiveThemeGain.gain.setValueAtTime(
      0,
      now
    );

    inactiveThemeAudio.play();

    activeThemeGain.gain.setValueAtTime(
      activeThemeGain.gain.value,
      now
    );

    activeThemeGain.gain.linearRampToValueAtTime(
      0,
      now + 0.5
    );

    inactiveThemeGain.gain.linearRampToValueAtTime(
      isMusicalThemeEnabled
        ? 1
        : 0,
      now + 0.5
    );

    themeCrossfadeTimeoutRef.current =
      setTimeout(() => {
        activeThemeAudio.pause();

        activeThemeAudioRef.current =
          inactiveThemeAudio;

        inactiveThemeAudioRef.current =
          activeThemeAudio;

        activeThemeGainRef.current =
          inactiveThemeGain;

        inactiveThemeGainRef.current =
          activeThemeGain;

        themeCrossfadeTimeoutRef.current =
          null;
      }, 550);
  }, [selectedPitch]);

  // --------------------------------------------------
  // TOGGLE ATMOSPHERE
  // --------------------------------------------------

  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    if (
      !audioContext ||
      !isPreviewPlaying
    ) {
      return;
    }

    const activeGain =
      activeGainRef.current;

    const inactiveGain =
      inactiveGainRef.current;

    if (
      !activeGain ||
      !inactiveGain
    ) {
      return;
    }

    const now =
      audioContext.currentTime;

    activeGain.gain.cancelScheduledValues(
      now
    );

    inactiveGain.gain.cancelScheduledValues(
      now
    );

    activeGain.gain.setValueAtTime(
      activeGain.gain.value,
      now
    );

    inactiveGain.gain.setValueAtTime(
      inactiveGain.gain.value,
      now
    );

    if (isAtmosphereEnabled) {
      activeGain.gain.linearRampToValueAtTime(
        1,
        now + 0.4
      );
    } else {
      activeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );

      inactiveGain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );
    }
  }, [isAtmosphereEnabled]);

  // --------------------------------------------------
  // TOGGLE MUSICAL THEME
  // --------------------------------------------------

  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    if (
      !audioContext ||
      !isPreviewPlaying
    ) {
      return;
    }

    const activeThemeGain =
      activeThemeGainRef.current;

    const inactiveThemeGain =
      inactiveThemeGainRef.current;

    if (
      !activeThemeGain ||
      !inactiveThemeGain
    ) {
      return;
    }

    const now =
      audioContext.currentTime;

    activeThemeGain.gain.cancelScheduledValues(
      now
    );

    inactiveThemeGain.gain.cancelScheduledValues(
      now
    );

    activeThemeGain.gain.setValueAtTime(
      activeThemeGain.gain.value,
      now
    );

    inactiveThemeGain.gain.setValueAtTime(
      inactiveThemeGain.gain.value,
      now
    );

    if (isMusicalThemeEnabled) {
      activeThemeGain.gain.linearRampToValueAtTime(
        1,
        now + 0.4
      );
    } else {
      activeThemeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );

      inactiveThemeGain.gain.linearRampToValueAtTime(
        0,
        now + 0.4
      );
    }
  }, [isMusicalThemeEnabled]);

  // --------------------------------------------------
  // NATURE SOUNDS
  // --------------------------------------------------

  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    if (
      !audioContext ||
      !isPreviewPlaying
    ) {
      return;
    }

    const volumes = {
      rain: rainVolume,
      forest: forestVolume,
      birds: birdsVolume,
      river: riverVolume,
      waves: wavesVolume,
    };

    const now =
      audioContext.currentTime;

    Object.entries(volumes).forEach(
      ([sound, volume]) => {
        const gain =
          natureGainRef.current[
            sound
          ];

        if (!gain) {
          return;
        }

        gain.gain.cancelScheduledValues(
          now
        );

        gain.gain.setValueAtTime(
          gain.gain.value,
          now
        );

        gain.gain.linearRampToValueAtTime(
          volume / 100,
          now + 0.15
        );
      }
    );
  }, [
    rainVolume,
    forestVolume,
    birdsVolume,
    riverVolume,
    wavesVolume,
    isPreviewPlaying,
  ]);

  // --------------------------------------------------
  // INTERFACE
  // --------------------------------------------------

  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Nom de la création sauvegardée */}
        <CreationName
          creationName={creationName}
          setCreationName={
            setCreationName
          }
        />

        {/* Preview du mix + sauvegarde MongoDB */}
        <MeditationActions
          isPreviewPlaying={
            isPreviewPlaying
          }
          setIsPreviewPlaying={
            handlePreviewChange
          }
          onSave={
            handleSaveCreation
          }
          isSaving={isSaving}
        />

        <PitchSelector
          selectedPitch={
            selectedPitch
          }
          setSelectedPitch={
            handlePitchChange
          }
        />

        <AtmosphereSelector
          selectedAtmosphere={
            selectedAtmosphere
          }
          setSelectedAtmosphere={
            handleAtmosphereChange
          }
          isAtmosphereEnabled={
            isAtmosphereEnabled
          }
          setIsAtmosphereEnabled={
            setIsAtmosphereEnabled
          }
        />

        <MusicalThemeSelector
          isMusicalThemeEnabled={
            isMusicalThemeEnabled
          }
          setIsMusicalThemeEnabled={
            setIsMusicalThemeEnabled
          }
        />

        <NatureSoundsMixer
          rainVolume={rainVolume}
          setRainVolume={
            setRainVolume
          }
          forestVolume={
            forestVolume
          }
          setForestVolume={
            setForestVolume
          }
          birdsVolume={birdsVolume}
          setBirdsVolume={
            setBirdsVolume
          }
          riverVolume={riverVolume}
          setRiverVolume={
            setRiverVolume
          }
          wavesVolume={wavesVolume}
          setWavesVolume={
            setWavesVolume
          }
        />

        {/* Durée de la vraie session */}
        <DurationSelector
          selectedDuration={
            selectedDuration
          }
          onDurationChange={
            setSelectedDuration
          }
        />

        {/* Envoie le mix actuel vers /session */}
        <StartMeditation
          selectedMeditation={
            customMeditation
          }
          selectedDuration={
            selectedDuration
          }
          audioConfig={audioConfig}
        />
      </div>
    </div>
  );
}

export default CreateMeditation;