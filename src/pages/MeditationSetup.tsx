import { useState } from "react";
import SoundSourceSelector from "../components/meditationSetup/SoundSourceSelector";
import SoundCarousel from "../components/meditationSetup/SoundCarousel";

// On type SoundSource pour limiter les valeurs possible -> Le State n'acceptera QUE presets ou creations !
type SoundSource = "presets" | "creations";

function MeditationSetup() {
  // Ce state est dans le parent car plusieurs composants en ont besoin.
  // SoundSourceSelector le modifie, et SoundCarousel dépend de sa valeur.
  const [selectedSource, setSelectedSource] = useState<SoundSource>("presets");

  return (
    <div className="py-5">
      <SoundSourceSelector
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
      />

      <div className="mt-6">
        <SoundCarousel source={selectedSource} />
      </div>
    </div>
  );
}

export default MeditationSetup;