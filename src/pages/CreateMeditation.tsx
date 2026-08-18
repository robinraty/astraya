import PitchSelector from "../components/createMeditation/PitchSelector";
import AtmosphereSelector from "../components/createMeditation/AtmosphereSelector";
import MusicalThemeSelector from "../components/createMeditation/MusicalThemeSelector";
import NatureSoundsMixer from "../components/createMeditation/NatureSoundsMixer";
import MeditationActions from "../components/createMeditation/MeditationActions";

function CreateMeditation() {
  return (
    <div className="bg-astraya-background px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <MeditationActions />
        <PitchSelector />
        <AtmosphereSelector />
        <MusicalThemeSelector />
        <NatureSoundsMixer />
      </div>
    </div>
  );
}

export default CreateMeditation;