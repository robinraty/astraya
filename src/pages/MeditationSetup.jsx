import {
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import SoundSourceSelector from "../components/meditationSetup/SoundSourceSelector";
import SoundCarousel from "../components/meditationSetup/SoundCarousel";
import DurationSelector from "../components/meditationSetup/DurationSelector";
import StartMeditation from "../components/meditationSetup/StartMeditation";

import {
  useAuth,
} from "../context/AuthContext";

function MeditationSetup() {
  // Récupère les informations éventuellement
  // envoyées par une autre page avec navigate().
  const location =
    useLocation();

  // Récupère l'état de connexion global.
  const {
    isAuthenticated,
  } = useAuth();

  // Si on arrive depuis My Creations,
  // location.state peut contenir :
  //
  // source: "creations"
  // selectedMeditation: la création MongoDB choisie
  const meditationFromLibrary =
    location.state
      ?.selectedMeditation ||
    null;

  const sourceFromLibrary =
    location.state?.source ===
    "creations"
      ? "creations"
      : "presets";

  // --------------------------------------------------
  // SOURCE
  // --------------------------------------------------

  // Par défaut, Meditate s'ouvre
  // sur les presets Astraya.
  //
  // Si on arrive depuis My Creations,
  // l'onglet My Creations s'ouvre directement.
  const [
    selectedSource,
    setSelectedSource,
  ] = useState(
    sourceFromLibrary
  );

  // --------------------------------------------------
  // MEDITATION
  // --------------------------------------------------

  // Si une création arrive depuis Library,
  // elle est immédiatement sélectionnée.
  //
  // Sinon SoundCarousel sélectionnera
  // automatiquement le premier preset.
  const [
    selectedMeditation,
    setSelectedMeditation,
  ] = useState(
    meditationFromLibrary
  );

  // --------------------------------------------------
  // DUREE
  // --------------------------------------------------

  // 15 minutes par défaut.
  const [
    selectedDuration,
    setSelectedDuration,
  ] = useState(15);

  // --------------------------------------------------
  // AFFICHAGE DES CONTROLES DE SESSION
  // --------------------------------------------------

  // Pour les presets Astraya,
  // la durée et le bouton Start sont toujours visibles.
  //
  // Pour My Creations,
  // ils ne sont visibles que si :
  // - l'utilisateur est connecté
  // - une création est réellement sélectionnée
  const canStartMeditation =
    selectedSource === "presets" ||
    (
      selectedSource ===
        "creations" &&
      isAuthenticated &&
      selectedMeditation
    );

  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Choix entre presets
            et créations personnelles */}
        <SoundSourceSelector
          selectedSource={
            selectedSource
          }
          onSourceChange={
            setSelectedSource
          }
        />

        {/* Affiche les méditations
            correspondant à la source choisie */}
        <SoundCarousel
          source={
            selectedSource
          }
          selectedMeditation={
            selectedMeditation
          }
          onSoundChange={
            setSelectedMeditation
          }
        />

        {/* La durée et le bouton Start
            ne s'affichent que s'il existe
            réellement une méditation à lancer */}
        {canStartMeditation && (
          <>
            <DurationSelector
              selectedDuration={
                selectedDuration
              }
              onDurationChange={
                setSelectedDuration
              }
            />

            <StartMeditation
              selectedMeditation={
                selectedMeditation
              }
              selectedDuration={
                selectedDuration
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default MeditationSetup;