// --------------------------------------------------
// IMPORTS REACT
// --------------------------------------------------
//
// useState : permet de conserver une valeur qui peut changer
// pendant que l'utilisateur utilise la page.
//
// Exemples ici :
// - le pitch sélectionné
// - le volume des oiseaux
// - si la Preview est en lecture
//
// useRef : permet de conserver une référence vers une valeur ou
// un objet sans provoquer un nouveau rendu de l'interface.
//
// Ici, on l'utilise beaucoup pour garder une référence vers :
// - les lecteurs audio
// - les GainNodes
// - les timeouts
// - certains états techniques du moteur audio
//
// useEffect : permet d'exécuter du code lorsqu'un composant
// apparaît ou lorsqu'une valeur précise change.
//
// Ici, les useEffect servent principalement à gérer l'audio.

import {
  useEffect,
  useRef,
  useState,
} from "react";


// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------
//
// useNavigate vient de React Router.
//
// Il permet de changer de page depuis du JavaScript.
//
// Exemple ici :
// si l'utilisateur essaie de sauvegarder sans être connecté,
// on peut l'envoyer vers /login.

import { useNavigate } from "react-router-dom";


// --------------------------------------------------
// COMPOSANTS DE LA PAGE CREATE
// --------------------------------------------------
//
// CreateMeditation est une grande page.
//
// Pour éviter d'avoir toute l'interface dans un seul énorme bloc,
// différentes parties visuelles sont séparées en composants.
//
// Exemple :
// PitchSelector gère l'affichage des choix de pitch.
// NatureSoundsMixer contient les sliders des sons de nature.

import PitchSelector from "../components/createMeditation/PitchSelector";
import AtmosphereSelector from "../components/createMeditation/AtmosphereSelector";
import MusicalThemeSelector from "../components/createMeditation/MusicalThemeSelector";
import NatureSoundsMixer from "../components/createMeditation/NatureSoundsMixer";
import MeditationActions from "../components/createMeditation/MeditationActions";
import CreationName from "../components/createMeditation/CreationName";


// --------------------------------------------------
// COMPOSANTS LIÉS AU LANCEMENT D'UNE SESSION
// --------------------------------------------------
//
// Ces composants sont également utilisés dans la page Meditate.
//
// DurationSelector permet de choisir la durée.
//
// StartMeditation lance ensuite la vraie session
// avec la configuration audio créée sur cette page.

import DurationSelector from "../components/meditationSetup/DurationSelector";
import StartMeditation from "../components/meditationSetup/StartMeditation"; 


// --------------------------------------------------
// AUTHENTIFICATION
// --------------------------------------------------
//
// useAuth permet de récupérer les informations fournies
// par AuthContext.
//
// Ici, on utilise principalement :
// - token : le JWT de l'utilisateur connecté
// - logout : fonction pour le déconnecter si son token n'est plus valide

import { useAuth } from "../context/AuthContext";


function CreateMeditation() {
  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------
  //
  // navigate est une fonction.
  //
  // On pourra ensuite écrire par exemple :
  //
  // navigate("/login");
  //
  // pour envoyer l'utilisateur vers la page Login.

  const navigate =
    useNavigate();


  // --------------------------------------------------
  // DONNÉES D'AUTHENTIFICATION
  // --------------------------------------------------
  //
  // useAuth() nous donne accès au Context d'authentification.
  //
  // On récupère ici uniquement token et logout.
  //
  // token sert lors de la sauvegarde d'une création.
  //
  // logout sert si le backend nous répond que le token
  // n'est plus valide.

  const {
    token,
    logout,
  } = useAuth();


  // ==================================================
  // CREATION
  // ==================================================


  // --------------------------------------------------
  // PREVIEW EN LECTURE OU NON
  // --------------------------------------------------
  //
  // isPreviewPlaying vaut :
  // true  -> la preview doit jouer
  // false -> la preview doit être arrêtée
  //
  // setIsPreviewPlaying permet de changer cette valeur.

  const [
    isPreviewPlaying,
    setIsPreviewPlaying,
  ] = useState(false);


  // --------------------------------------------------
  // NOM DE LA CRÉATION
  // --------------------------------------------------
  //
  // Le nom affiché par défaut est "Moon Lake".
  //
  // Ce state sera ensuite modifié lorsque l'utilisateur
  // change le nom dans le composant CreationName.

  const [
    creationName,
    setCreationName,
  ] = useState(
    "Moon Lake"
  );


  // --------------------------------------------------
  // IMAGE DE LA CRÉATION
  // --------------------------------------------------
  //
  // On conserve uniquement le chemin relatif de l'image.
  //
  // Exemple :
  // images/ambiant-images/astraya-background-3.png
  //
  // Ce chemin pourra ensuite être sauvegardé dans MongoDB.

  const [
    creationImage,
    setCreationImage,
  ] = useState(
    "images/ambiant-images/astraya-background-3.png"
  );


  // --------------------------------------------------
  // SAUVEGARDE EN COURS
  // --------------------------------------------------
  //
  // Permet de savoir si une requête de sauvegarde
  // est actuellement en cours.
  //
  // Cela peut notamment servir à empêcher plusieurs sauvegardes
  // simultanées ou changer l'état du bouton Save.

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  // ==================================================
  // CONFIGURATION AUDIO
  // ==================================================
  //
  // Tous les choix effectués par l'utilisateur sont gardés
  // dans des states React.
  //
  // Ces valeurs permettent :
  // - de contrôler la Preview
  // - de sauvegarder la création
  // - de lancer une vraie session


  // Pitch actuel :
  // dark, natural ou bright.
  const [
    selectedPitch,
    setSelectedPitch,
  ] = useState("bright");


  // Atmosphère actuelle :
  // par exemple airy ou deep.
  const [
    selectedAtmosphere,
    setSelectedAtmosphere,
  ] = useState("airy");


  // Permet d'activer ou désactiver complètement le pad d'atmosphère.
  const [
    isAtmosphereEnabled,
    setIsAtmosphereEnabled,
  ] = useState(true);


  // Permet d'activer ou désactiver le thème musical.
  const [
    isMusicalThemeEnabled,
    setIsMusicalThemeEnabled,
  ] = useState(false);


  // --------------------------------------------------
  // VOLUMES DES SONS DE NATURE
  // --------------------------------------------------
  //
  // Chaque son possède son propre state.
  //
  // Les valeurs vont de 0 à 100.

  const [
    rainVolume,
    setRainVolume,
  ] = useState(0);

  const [
    forestVolume,
    setForestVolume,
  ] = useState(25);

  const [
    birdsVolume,
    setBirdsVolume,
  ] = useState(80);

  const [
    riverVolume,
    setRiverVolume,
  ] = useState(0);

  const [
    wavesVolume,
    setWavesVolume,
  ] = useState(0);


  // --------------------------------------------------
  // DURÉE DE LA MÉDITATION
  // --------------------------------------------------
  //
  // La durée n'est pas enregistrée dans le preset lui-même.
  //
  // Elle est choisie au moment de lancer une session.
  //
  // Valeur par défaut : 15 minutes.

  const [
    selectedDuration,
    setSelectedDuration,
  ] = useState(15);
























  // !--------------------------------------------------
  // ! OBJET audioConfig
  // !--------------------------------------------------
  //
  // On regroupe ici toutes les valeurs audio importantes
  // dans un seul objet.
  //
  // Cet objet représente réellement la "recette sonore"
  // de la création.
  //
  // Il peut ensuite être :
  // - sauvegardé dans MongoDB
  // - envoyé à MeditationSession

  // Tous les réglages de l’utilisateur sont stockés dans des states React, puis audioConfig est reconstruit à chaque render à partir de la valeur actuelle de ces states pour représenter toute la configuration sonore. Chacun de ces paramètres est stocké dans un state React, et audioConfig regroupe ensuite la valeur actuelle de tous ces states dans un seul objet.


  const audioConfig = {
    pitch: selectedPitch,

    atmosphere:
      selectedAtmosphere,

    atmosphereEnabled:
      isAtmosphereEnabled,

    musicalThemeEnabled:
      isMusicalThemeEnabled,

    natureVolumes: {
      rain: rainVolume,
      forest:
        forestVolume,
      birds:
        birdsVolume,
      river:
        riverVolume,
      waves:
        wavesVolume,
    },
  };

















  // ==================================================
  // SAUVEGARDE DE LA CRÉATION
  // ==================================================
  //
  // Cette fonction est appelée quand l'utilisateur
  // clique sur Save.
  //
  // Cette fonction permet d'envoyer les données de la création à mon backend pour qu'elles soient ensuite sauvegardées dans MongoDB.


  const handleSaveCreation =
    async () => {

      // ------------------------------------------------
      // VÉRIFICATION DU NOM
      // ------------------------------------------------
      //
      // trim() retire les espaces inutiles au début
      // et à la fin du texte.
      //
      // Si après ça le nom est vide,
      // on empêche la sauvegarde.

      if (
        !creationName.trim()
      ) {
        alert(
          "Please enter a creation name."
        );

        return;
      }


    // ------------------------------------------------
    // VÉRIFICATION DE LA PRÉSENCE DU TOKEN
    // ------------------------------------------------
    //
    // Ici, le frontend vérifie seulement qu'un token JWT
    // est présent avant d'envoyer la requête.
    //
    // La validité du token sera vérifiée ensuite
    // par le middleware authenticateUser dans le backend.

    if (!token) {
      alert(
        "Please log in to save your creation."
      );

      navigate("/login");

      return;
    }


      // ------------------------------------------------
      // REQUÊTE VERS LE BACKEND
      // ------------------------------------------------
      //

      try {
        setIsSaving(true);

        // J'utilise fetch pour envoyer une requête HTTP POST
        // à mon backend Express sur le port 3000.
        const response = await fetch(
          "http://localhost:3000/creations",
          {
            method: "POST",

            // Le JWT est envoyé dans le header Authorization
            // pour permettre au backend d'authentifier l'utilisateur.
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            // Le body contient les données de la création :
            // son nom, son image et toute sa configuration audio.
            body: JSON.stringify({
              name: creationName.trim(),
              image: creationImage,
              audioConfig,
            }),
          }
        );


        // ------------------------------------------------
        // TOKEN NON VALIDE
        // ------------------------------------------------
        //
        // HTTP 401 signifie "Unauthorized".
        //
        // Ici cela veut dire que le backend refuse
        // l'authentification.
        //
        // On déconnecte donc l'utilisateur
        // puis on le renvoie vers Login.

        if (
          response.status ===
          401
        ) {
          logout();

          alert(
            "Your session has expired. Please log in again."
          );

          navigate("/login");

          return;
        }


        // ------------------------------------------------
        // RÉPONSE JSON
        // ------------------------------------------------
        //
        // response.json() transforme le JSON reçu
        // depuis le backend en objet JavaScript.

        const data =
          await response.json();


        // response.ok vaut true pour une réponse HTTP réussie.
        //
        // Si ce n'est pas le cas,
        // on crée volontairement une erreur.

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Save failed"
          );
        }


        // Si on arrive ici, la sauvegarde a fonctionné.

        console.log(
          "Creation saved:",
          data
        );

        alert(
          "Creation saved!"
        );


      // ------------------------------------------------
      // GESTION DES ERREURS
      // ------------------------------------------------
      //
      // catch est exécuté si une erreur arrive
      // pendant le try.

      } catch (error) {
        console.error(
          "Save error:",
          error
        );

        alert(
          "Unable to save creation."
        );


      // ------------------------------------------------
      // FIN DE LA REQUÊTE
      // ------------------------------------------------
      //
      // finally s'exécute dans tous les cas :
      // succès ou erreur.
      //
      // On indique donc ici que la sauvegarde est terminée.

      } finally {
        setIsSaving(false);
      }
    };


  // ==================================================
  // DONNÉES POUR LA SESSION DE MÉDITATION
  // ==================================================
  //
  // Cette création personnalisée peut être envoyée
  // directement vers MeditationSession.
  //
  // creationImage contient un chemin relatif.
  //
  // import.meta.env.BASE_URL ajoute le chemin de base
  // de l'application afin d'obtenir une vraie URL utilisable.

  const customMeditation = {
    name: creationName,

    image: `${
      import.meta.env.BASE_URL
    }${creationImage}`,
  };


  // ==================================================
  // RÉFÉRENCES DU MOTEUR AUDIO
  // ==================================================
  //
  // À partir d'ici commence la partie plus technique.
  //
  // useRef sert à conserver les différents objets audio
  // entre les rendus React.
  //
  // Contrairement à useState, modifier une ref
  // ne provoque pas un nouveau rendu de l'interface.


  // --------------------------------------------------
  // AUDIO CONTEXT
  // --------------------------------------------------
  //
  // Contiendra l'AudioContext de la Web Audio API.
  //
  // AudioContext représente l'environnement général
  // dans lequel les sons seront traités.

  const audioContextRef =
    useRef(null);


  // --------------------------------------------------
  // DEUX LECTEURS POUR LES PADS
  // --------------------------------------------------
  //
  // On utilise deux lecteurs audio pour pouvoir effectuer
  // un crossfade lorsque l'utilisateur change de pad.
  //
  // Pendant qu'un lecteur joue,
  // l'autre peut préparer le prochain son.

  const audioOneRef =
    useRef(null);

  const audioTwoRef =
    useRef(null);


  // --------------------------------------------------
  // GAIN DES DEUX PADS
  // --------------------------------------------------
  //
  // Un GainNode contrôle le volume d'un son.
  //
  // Chaque lecteur possède donc son propre GainNode.

  const gainOneRef =
    useRef(null);

  const gainTwoRef =
    useRef(null);


  // --------------------------------------------------
  // PAD ACTIF / INACTIF
  // --------------------------------------------------
  //
  // activeAudioRef désigne le lecteur actuellement utilisé.
  //
  // inactiveAudioRef désigne l'autre lecteur,
  // prêt à charger un nouveau fichier.
  //
  // Après un crossfade, ils échangent leurs rôles.

  const activeAudioRef =
    useRef(null);

  const inactiveAudioRef =
    useRef(null);

  const activeGainRef =
    useRef(null);

  const inactiveGainRef =
    useRef(null);


  // --------------------------------------------------
  // DEUX LECTEURS POUR LE THÈME MUSICAL
  // --------------------------------------------------
  //
  // Même principe que pour les pads.
  //
  // Deux lecteurs permettent de faire un crossfade
  // lors d'un changement de pitch.

  const themeAudioOneRef =
    useRef(null);

  const themeAudioTwoRef =
    useRef(null);

  const themeGainOneRef =
    useRef(null);

  const themeGainTwoRef =
    useRef(null);

  const activeThemeAudioRef =
    useRef(null);

  const inactiveThemeAudioRef =
    useRef(null);

  const activeThemeGainRef =
    useRef(null);

  const inactiveThemeGainRef =
    useRef(null);


  // --------------------------------------------------
  // SONS DE NATURE
  // --------------------------------------------------
  //
  // On utilise ici des objets contenant les lecteurs
  // et GainNodes associés à :
  //
  // rain
  // forest
  // birds
  // river
  // waves

  const natureAudioRef =
    useRef({});

  const natureGainRef =
    useRef({});


  // --------------------------------------------------
  // TIMEOUTS
  // --------------------------------------------------
  //
  // Ces refs permettent de garder une référence
  // vers certains setTimeout.
  //
  // Cela permet notamment de les annuler
  // si une nouvelle action arrive avant leur fin.

  const crossfadeTimeoutRef =
    useRef(null);

  const themeCrossfadeTimeoutRef =
    useRef(null);

  const pauseTimeoutRef =
    useRef(null);

  const previewLockTimeoutRef =
    useRef(null);


  // --------------------------------------------------
  // VERROUS DE TRANSITION
  // --------------------------------------------------
  //
  // Ces booléens empêchent l'utilisateur de déclencher
  // plusieurs transitions audio simultanément.
  //
  // Cela évite les bugs si quelqu'un clique très rapidement
  // sur plusieurs options.

  const isPadTransitioningRef =
    useRef(false);

  const isPreviewTransitioningRef =
    useRef(false);


  // ==================================================
  // CONTRÔLES UTILISATEUR
  // ==================================================


  // --------------------------------------------------
  // CHANGEMENT DE PITCH
  // --------------------------------------------------

  const handlePitchChange = (
    pitch
  ) => {

    // Si l'utilisateur clique sur le pitch déjà sélectionné,
    // il n'y a rien à faire.
    if (
      pitch ===
      selectedPitch
    ) {
      return;
    }


    // Si une transition est déjà en cours,
    // on ignore temporairement le nouveau clic.
    if (
      isPadTransitioningRef.current ||
      isPreviewTransitioningRef.current
    ) {
      return;
    }


    // Si la Preview joue actuellement,
    // changer de pitch va provoquer un crossfade.
    //
    // On verrouille donc les changements
    // jusqu'à la fin de cette transition.
    if (isPreviewPlaying) {
      isPadTransitioningRef.current =
        true;
    }


    // Modifier ce state déclenchera plus bas
    // le useEffect responsable du changement de pad.
    setSelectedPitch(
      pitch
    );
  };


  // --------------------------------------------------
  // CHANGEMENT D'ATMOSPHÈRE
  // --------------------------------------------------
  //
  // Même principe que pour le pitch.

  const handleAtmosphereChange = (
    atmosphere
  ) => {
    if (
      atmosphere ===
      selectedAtmosphere
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


  // --------------------------------------------------
  // PLAY / PAUSE DE LA PREVIEW
  // --------------------------------------------------

  const handlePreviewChange = (
    nextValue
  ) => {

    // Empêche de spammer le bouton Preview
    // pendant une transition.
    if (
      isPreviewTransitioningRef.current ||
      isPadTransitioningRef.current
    ) {
      return;
    }

    isPreviewTransitioningRef.current =
      true;

    setIsPreviewPlaying(
      nextValue
    );


    // Si un précédent timeout existe encore,
    // on l'annule.
    if (
      previewLockTimeoutRef.current
    ) {
      clearTimeout(
        previewLockTimeoutRef.current
      );
    }


    // Après 700 ms, on autorise à nouveau
    // les interactions.
    previewLockTimeoutRef.current =
      setTimeout(() => {
        isPreviewTransitioningRef.current =
          false;

        previewLockTimeoutRef.current =
          null;
      }, 700);
  };


  // ==================================================
  // INITIALISATION DU MOTEUR AUDIO
  // ==================================================
  //
  // Ce useEffect possède [] comme dépendances.
  //
  // Cela signifie qu'il s'exécute une seule fois
  // lorsque CreateMeditation apparaît.
  //
  // Son rôle est de construire tout le moteur audio :
  //
  // - AudioContext
  // - lecteurs de pads
  // - lecteurs du thème
  // - sons de nature
  // - GainNodes
  // - connexions vers la sortie audio


  useEffect(() => {

    // ------------------------------------------------
    // CRÉATION DE L'AUDIO CONTEXT
    // ------------------------------------------------
    //
    // window.AudioContext est fourni par la Web Audio API
    // du navigateur.
    //
    // webkitAudioContext sert de fallback
    // pour certains navigateurs plus anciens.

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    const audioContext =
      new AudioContext();


    // ------------------------------------------------
    // PAD INITIAL
    // ------------------------------------------------
    //
    // Au départ, on charge le pad :
    //
    // airy-bright.wav

    const initialPadPath = `${
      import.meta.env.BASE_URL
    }audio/pads/airy-bright.wav`;


    // ------------------------------------------------
    // DEUX LECTEURS AUDIO
    // ------------------------------------------------
    //
    // Les deux lecteurs utilisent initialement
    // le même fichier.
    //
    // Ils serviront ensuite alternativement
    // pendant les changements de pad.

    const audioOne =
      new Audio(
        initialPadPath
      );

    const audioTwo =
      new Audio(
        initialPadPath
      );


    // Les pads doivent tourner en boucle.
    audioOne.loop = true;
    audioTwo.loop = true;


    // ------------------------------------------------
    // CONNEXION DES ÉLÉMENTS AUDIO À WEB AUDIO
    // ------------------------------------------------
    //
    // createMediaElementSource transforme
    // un élément Audio JavaScript
    // en source utilisable par la Web Audio API.

    const sourceOne =
      audioContext.createMediaElementSource(
        audioOne
      );

    const sourceTwo =
      audioContext.createMediaElementSource(
        audioTwo
      );


    // ------------------------------------------------
    // GAIN NODES
    // ------------------------------------------------
    //
    // createGain crée un contrôleur de volume.
    //
    // Chaque lecteur possède son propre gain.

    const gainOne =
      audioContext.createGain();

    const gainTwo =
      audioContext.createGain();


    // Au départ, les deux pads sont silencieux.
    gainOne.gain.value = 0;
    gainTwo.gain.value = 0;


    // ------------------------------------------------
    // CHAÎNE AUDIO
    // ------------------------------------------------
    //
    // Chaque source audio est connectée à son GainNode.
    //
    // Puis le GainNode est connecté à la sortie audio.
    //
    // Schéma :
    //
    // audio -> gain -> haut-parleurs

    sourceOne.connect(
      gainOne
    );

    gainOne.connect(
      audioContext.destination
    );

    sourceTwo.connect(
      gainTwo
    );

    gainTwo.connect(
      audioContext.destination
    );


    // ------------------------------------------------
    // STOCKAGE DANS LES REFS
    // ------------------------------------------------
    //
    // On conserve tous ces objets pour pouvoir
    // les réutiliser plus tard dans d'autres useEffect.

    audioOneRef.current =
      audioOne;

    audioTwoRef.current =
      audioTwo;

    gainOneRef.current =
      gainOne;

    gainTwoRef.current =
      gainTwo;


    // audioOne est considéré comme le lecteur actif au départ.
    //
    // audioTwo est considéré comme le lecteur disponible
    // pour préparer la prochaine transition.

    activeAudioRef.current =
      audioOne;

    inactiveAudioRef.current =
      audioTwo;

    activeGainRef.current =
      gainOne;

    inactiveGainRef.current =
      gainTwo;


    // ------------------------------------------------
    // THÈME MUSICAL INITIAL
    // ------------------------------------------------

    const initialThemePath = `${
      import.meta.env.BASE_URL
    }audio/themes/soft-strings-bright.wav`;

    const themeAudioOne =
      new Audio(
        initialThemePath
      );

    const themeAudioTwo =
      new Audio(
        initialThemePath
      );

    themeAudioOne.loop = true;
    themeAudioTwo.loop = true;


    // Connexion des deux lecteurs de thème
    // à la Web Audio API.

    const themeSourceOne =
      audioContext.createMediaElementSource(
        themeAudioOne
      );

    const themeSourceTwo =
      audioContext.createMediaElementSource(
        themeAudioTwo
      );


    // Création de leurs contrôleurs de volume.

    const themeGainOne =
      audioContext.createGain();

    const themeGainTwo =
      audioContext.createGain();

    themeGainOne.gain.value =
      0;

    themeGainTwo.gain.value =
      0;


    // Chaînes audio du thème musical.

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


    // Stockage dans les refs.

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


    // ------------------------------------------------
    // SONS DE NATURE
    // ------------------------------------------------
    //
    // On définit simplement les noms des cinq fichiers.

    const natureSounds = [
      "rain",
      "forest",
      "birds",
      "river",
      "waves",
    ];


    // Pour chaque son :
    //
    // 1. on crée un Audio
    // 2. on le met en boucle
    // 3. on le connecte à Web Audio
    // 4. on crée un GainNode
    // 5. on connecte le tout à la sortie
    // 6. on conserve les références

    natureSounds.forEach(
      (sound) => {
        const audio =
          new Audio(
            `${
              import.meta.env
                .BASE_URL
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

        source.connect(
          gain
        );

        gain.connect(
          audioContext.destination
        );

        natureAudioRef.current[
          sound
        ] = audio;

        natureGainRef.current[
          sound
        ] = gain;
      }
    );


    // On conserve aussi l'AudioContext lui-même.

    audioContextRef.current =
      audioContext;


    // ------------------------------------------------
    // CLEANUP
    // ------------------------------------------------
    //
    // La fonction retournée par useEffect est exécutée
    // lorsque le composant disparaît.
    //
    // Son rôle est de nettoyer les ressources utilisées :
    // - annuler les timeouts
    // - arrêter les audios
    // - fermer AudioContext

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
      ).forEach(
        (audio) => {
          audio.pause();
        }
      );

      audioContext.close();
    };
  }, []);


  // ==================================================
  // PLAY / PAUSE DE LA PREVIEW
  // ==================================================
  //
  // Ce useEffect est déclenché chaque fois que
  // isPreviewPlaying change.
  //
  // Donc lorsque l'utilisateur appuie sur Preview
  // ou Pause.


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


    // Si le moteur audio n'est pas encore prêt,
    // on arrête ici.
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


    // Heure actuelle du moteur audio.
    //
    // Web Audio utilise cette valeur
    // pour programmer précisément les fades.
    const now =
      audioContext.currentTime;


    // Si une ancienne pause était programmée,
    // on l'annule.
    if (
      pauseTimeoutRef.current
    ) {
      clearTimeout(
        pauseTimeoutRef.current
      );

      pauseTimeoutRef.current =
        null;
    }


    // On annule les anciennes modifications de volume
    // qui pourraient encore être programmées.

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


    // ------------------------------------------------
    // PREVIEW = PLAY
    // ------------------------------------------------

    if (
      isPreviewPlaying
    ) {

      // Certains navigateurs suspendent AudioContext
      // avant une interaction utilisateur.
      //
      // On le réactive si nécessaire.
      if (
        audioContext.state ===
        "suspended"
      ) {
        audioContext.resume();
      }


      // On démarre le pad actif.
      activeAudio.play();


      // Le volume actuel sert de point de départ.
      activeGain.gain.setValueAtTime(
        activeGain.gain.value,
        now
      );


      // Fade-in du pad sur 1,5 seconde.
      //
      // Si l'atmosphère est désactivée,
      // le volume cible reste à zéro.
      activeGain.gain.linearRampToValueAtTime(
        isAtmosphereEnabled
          ? 1
          : 0,
        now + 1.5
      );


      // Même principe pour le thème musical.
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


      // ------------------------------------------------
      // VOLUMES DES SONS DE NATURE
      // ------------------------------------------------

      const natureVolumes = {
        rain:
          rainVolume,
        forest:
          forestVolume,
        birds:
          birdsVolume,
        river:
          riverVolume,
        waves:
          wavesVolume,
      };


      // Tous les sons de nature sont lancés.
      //
      // Leur GainNode décide ensuite s'ils sont audibles
      // et à quel volume.
      //
      // Donc un son à volume 0 peut être en lecture,
      // mais totalement silencieux.

      Object.entries(
        natureAudioRef.current
      ).forEach(
        ([
          sound,
          audio,
        ]) => {
          const gain =
            natureGainRef.current[
              sound
            ];

          const targetVolume =
            natureVolumes[
              sound
            ] / 100;

          audio.play();

          gain.gain.cancelScheduledValues(
            now
          );

          gain.gain.setValueAtTime(
            gain.gain.value,
            now
          );


          // Fade-in vers le volume choisi
          // pendant 1,5 seconde.
          gain.gain.linearRampToValueAtTime(
            targetVolume,
            now + 1.5
          );
        }
      );


    // ------------------------------------------------
    // PREVIEW = PAUSE
    // ------------------------------------------------
    } else {

      // On ne coupe pas brutalement les sons.
      //
      // On diminue d'abord leurs volumes
      // progressivement pendant 0,6 seconde.

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


      // Même fade-out pour tous les sons de nature.
      Object.values(
        natureGainRef.current
      ).forEach(
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
            now + 0.6
          );
        }
      );


      // On attend que le fade-out soit terminé
      // avant de réellement mettre les lecteurs en pause.
      //
      // Sinon on entendrait une coupure brutale.

      pauseTimeoutRef.current =
        setTimeout(() => {
          audioOneRef.current?.pause();
          audioTwoRef.current?.pause();

          themeAudioOneRef.current?.pause();
          themeAudioTwoRef.current?.pause();

          Object.values(
            natureAudioRef.current
          ).forEach(
            (audio) => {
              audio.pause();
            }
          );

          pauseTimeoutRef.current =
            null;
        }, 650);
    }
  }, [isPreviewPlaying]);


  // ==================================================
  // CHANGEMENT DU PAD
  // ==================================================
  //
  // Ce useEffect est déclenché quand :
  // - selectedPitch change
  // - selectedAtmosphere change
  //
  // Son rôle est de remplacer le pad actuel
  // sans provoquer de coupure brutale.


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


    // Le nom du fichier dépend de deux valeurs :
    //
    // selectedAtmosphere
    // selectedPitch
    //
    // Exemple :
    //
    // airy-bright.wav
    // deep-dark.wav

    const newAudioPath = `${
      import.meta.env.BASE_URL
    }audio/pads/${selectedAtmosphere}-${selectedPitch}.wav`;


    // ------------------------------------------------
    // SI LA PREVIEW NE JOUE PAS
    // ------------------------------------------------
    //
    // Aucun crossfade n'est nécessaire.
    //
    // On change simplement le fichier du lecteur actif.

    if (
      !isPreviewPlaying
    ) {
      activeAudio.src =
        newAudioPath;

      activeAudio.loop =
        true;

      activeAudio.currentTime =
        0;

      isPadTransitioningRef.current =
        false;

      return;
    }


    // ------------------------------------------------
    // SI LA PREVIEW JOUE
    // ------------------------------------------------
    //
    // On prépare un vrai crossfade.

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


    // Le lecteur inactif est arrêté avant de recevoir
    // son nouveau fichier.
    inactiveAudio.pause();

    inactiveAudio.src =
      newAudioPath;

    inactiveAudio.loop =
      true;


    // ------------------------------------------------
    // SYNCHRONISATION TEMPORELLE
    // ------------------------------------------------
    //
    // On essaie de démarrer le nouveau pad
    // au même endroit dans sa boucle que l'ancien.
    //
    // Exemple :
    //
    // ancien pad = 32 secondes
    // nouveau pad = commence également vers 32 secondes
    //
    // Cela rend la transition plus cohérente.

    try {
      inactiveAudio.currentTime =
        activeAudio.currentTime;
    } catch {
      inactiveAudio.currentTime =
        0;
    }


    // Le nouveau lecteur commence silencieux.
    inactiveGain.gain.setValueAtTime(
      0,
      now
    );

    inactiveAudio.play();


    // ------------------------------------------------
    // CROSSFADE
    // ------------------------------------------------
    //
    // Pendant 0,5 seconde :
    //
    // ancien pad : volume actuel -> 0
    //
    // nouveau pad : 0 -> 1
    //
    // Cela évite de couper brutalement un son
    // avant de lancer le suivant.

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


    // Une fois le crossfade terminé :
    //
    // l'ancien lecteur est arrêté,
    // puis les deux lecteurs échangent leurs rôles.

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


  // ==================================================
  // CHANGEMENT DU THÈME MUSICAL
  // ==================================================
  //
  // Le thème musical dépend du pitch.
  //
  // Comme pour les pads, on utilise deux lecteurs
  // pour effectuer un crossfade propre.


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


    // Exemple de fichier :
    //
    // soft-strings-bright.wav
    // soft-strings-dark.wav

    const newThemePath = `${
      import.meta.env.BASE_URL
    }audio/themes/soft-strings-${selectedPitch}.wav`;


    // Si Preview est arrêtée,
    // on change simplement le fichier.

    if (
      !isPreviewPlaying
    ) {
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


    // Synchronise le nouveau thème
    // avec la position temporelle du précédent.

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


    // Crossfade de 0,5 seconde.

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


    // Après la transition,
    // échange des rôles actif / inactif.

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


  // ==================================================
  // ACTIVATION / DÉSACTIVATION DE L'ATMOSPHÈRE
  // ==================================================
  //
  // Ce useEffect réagit lorsque l'utilisateur active
  // ou désactive Atmosphere.


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


    // Si Atmosphere est activé,
    // on monte progressivement le volume à 1.
    if (
      isAtmosphereEnabled
    ) {
      activeGain.gain.linearRampToValueAtTime(
        1,
        now + 0.4
      );


    // Sinon on descend les deux gains à zéro.
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


  // ==================================================
  // ACTIVATION / DÉSACTIVATION DU THÈME MUSICAL
  // ==================================================
  //
  // Même principe que pour Atmosphere.


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


    if (
      isMusicalThemeEnabled
    ) {
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


  // ==================================================
  // MODIFICATION DES VOLUMES DE NATURE
  // ==================================================
  //
  // Ce useEffect est déclenché lorsqu'un slider change.
  //
  // Il ne redémarre pas les fichiers audio.
  //
  // Il modifie simplement leurs GainNodes.


  useEffect(() => {
    const audioContext =
      audioContextRef.current;

    if (
      !audioContext ||
      !isPreviewPlaying
    ) {
      return;
    }


    // Regroupe les volumes dans un objet
    // pour pouvoir les traiter avec une boucle.

    const volumes = {
      rain:
        rainVolume,
      forest:
        forestVolume,
      birds:
        birdsVolume,
      river:
        riverVolume,
      waves:
        wavesVolume,
    };

    const now =
      audioContext.currentTime;


    Object.entries(
      volumes
    ).forEach(
      ([
        sound,
        volume,
      ]) => {
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


        // Les sliders utilisent 0 à 100.
        //
        // Web Audio utilise ici une valeur entre 0 et 1.
        //
        // On divise donc par 100.
        //
        // Exemple :
        //
        // 80 devient 0.8
        //
        // Le changement se fait progressivement
        // pendant 0,15 seconde pour rester fluide.

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


  // ==================================================
  // INTERFACE
  // ==================================================
  //
  // Toute la logique précédente prépare les données
  // et le moteur audio.
  //
  // Ici, on affiche simplement les composants visuels.
  //
  // Les states et fonctions sont transmis aux composants
  // via des props.
















  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">

        {/* ------------------------------------------------
            NOM ET IMAGE
            ------------------------------------------------

            Le composant reçoit les valeurs actuelles
            ainsi que les fonctions permettant de les modifier.
        */}
        <CreationName
          creationName={
            creationName
          }
          setCreationName={
            setCreationName
          }
          creationImage={
            creationImage
          }
          setCreationImage={
            setCreationImage
          }
        />


        {/* ------------------------------------------------
            ACTIONS PREVIEW / SAVE
            ------------------------------------------------

            handlePreviewChange contrôle la Preview.

            handleSaveCreation envoie la création
            vers le backend.
        */}
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
          isSaving={
            isSaving
          }
        />


        {/* ------------------------------------------------
            CHOIX DU PITCH
        */}
        <PitchSelector
          selectedPitch={
            selectedPitch
          }
          setSelectedPitch={
            handlePitchChange
          }
        />


        {/* ------------------------------------------------
            ATMOSPHÈRE
        */}
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


        {/* ------------------------------------------------
            THÈME MUSICAL
        */}
        <MusicalThemeSelector
          isMusicalThemeEnabled={
            isMusicalThemeEnabled
          }
          setIsMusicalThemeEnabled={
            setIsMusicalThemeEnabled
          }
        />


        {/* ------------------------------------------------
            MIXER DES SONS DE NATURE

            Chaque slider reçoit :
            - sa valeur
            - sa fonction de modification
        */}
        <NatureSoundsMixer
          rainVolume={
            rainVolume
          }
          setRainVolume={
            setRainVolume
          }
          forestVolume={
            forestVolume
          }
          setForestVolume={
            setForestVolume
          }
          birdsVolume={
            birdsVolume
          }
          setBirdsVolume={
            setBirdsVolume
          }
          riverVolume={
            riverVolume
          }
          setRiverVolume={
            setRiverVolume
          }
          wavesVolume={
            wavesVolume
          }
          setWavesVolume={
            setWavesVolume
          }
        />


        {/* ------------------------------------------------
            DURÉE DE LA SESSION
        */}
        <DurationSelector
          selectedDuration={
            selectedDuration
          }
          onDurationChange={
            setSelectedDuration
          }
        />


        {/* ------------------------------------------------
            LANCEMENT DE LA MÉDITATION

            On transmet :
            - la création
            - la durée
            - toute la configuration audio

            StartMeditation pourra ensuite envoyer ces données
            vers MeditationSession.
        */}
        <StartMeditation
          selectedMeditation={
            customMeditation
          }
          selectedDuration={
            selectedDuration
          }
          audioConfig={
            audioConfig
          }
        />
      </div>
    </div>
  );
}


// --------------------------------------------------
// EXPORT
// --------------------------------------------------
//
// export default permet à CreateMeditation
// d'être importé et utilisé dans App.jsx.
//
// App.jsx l'affiche lorsque l'utilisateur
// se trouve sur la route /create.

export default CreateMeditation;