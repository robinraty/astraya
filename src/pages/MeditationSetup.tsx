import { useState } from "react";

import SoundSourceSelector from "../components/meditationSetup/SoundSourceSelector";
import SoundCarousel, {
  type SoundItem,
} from "../components/meditationSetup/SoundCarousel";
import DurationSelector from "../components/meditationSetup/DurationSelector";
import StartMeditation from "../components/meditationSetup/StartMeditation";

// La source peut être un preset Astraya ou une création utilisateur.
type SoundSource = "presets" | "creations";

function MeditationSetup() {
  // Garde en mémoire la source actuellement choisie.
  const [selectedSource, setSelectedSource] =
    useState<SoundSource>("presets");

  // Garde en mémoire la méditation sélectionnée dans le carrousel.
  const [selectedMeditation, setSelectedMeditation] =
    useState<SoundItem | null>(null);

  // Garde en mémoire la durée choisie, 15 min par défaut.
  const [selectedDuration, setSelectedDuration] =
    useState<number>(15);

  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Reçoit la source actuelle et peut la modifier. */}
        <SoundSourceSelector
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
        />

        {/* Affiche les sons de la source choisie et remonte la sélection. */}
        <SoundCarousel
          source={selectedSource}
          onSoundChange={setSelectedMeditation}
        />

        {/* Affiche la durée actuelle et permet de la modifier. */}
        <DurationSelector
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
        />

        {/* Reçoit les choix finaux pour lancer la session. */}
        <StartMeditation
          selectedMeditation={selectedMeditation}
          selectedDuration={selectedDuration}
        />
      </div>
    </div>
  );
}

export default MeditationSetup;