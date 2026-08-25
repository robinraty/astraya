import { useState } from "react";

import SoundSourceSelector from "../components/meditationSetup/SoundSourceSelector";
import SoundCarousel from "../components/meditationSetup/SoundCarousel";
import DurationSelector from "../components/meditationSetup/DurationSelector";
import StartMeditation from "../components/meditationSetup/StartMeditation";

// On type SoundSource pour limiter les valeurs possibles.
// Le state n'acceptera QUE "presets" ou "creations".
type SoundSource = "presets" | "creations";

function MeditationSetup() {
  // Ce state est dans le parent car plusieurs composants en ont besoin.
  // SoundSourceSelector le modifie, et SoundCarousel dépend de sa valeur.
  const [selectedSource, setSelectedSource] =
    useState<SoundSource>("presets");

  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <SoundSourceSelector
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
        />

        {/*
          Ici on envoie selectedSource au SoundCarousel via la prop "source".
          source peut donc valoir "presets" ou "creations".
        */}
        <SoundCarousel source={selectedSource} />

        <DurationSelector />

        <StartMeditation />
      </div>
    </div>
  );
}

export default MeditationSetup;