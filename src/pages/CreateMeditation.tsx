import PitchSelector from "../components/createMeditation/PitchSelector";
import AtmosphereSelector from "../components/createMeditation/AtmosphereSelector";
import MusicalThemeSelector from "../components/createMeditation/MusicalThemeSelector";
import NatureSoundsMixer from "../components/createMeditation/NatureSoundsMixer";
import MeditationActions from "../components/createMeditation/MeditationActions";

function CreateMeditation() {
  return (
    <main className="min-h-screen bg-astraya-background px-4 py-8 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <MeditationActions />
        <PitchSelector />
        <AtmosphereSelector />
        <MusicalThemeSelector />
        <NatureSoundsMixer />
      </div>
    </main>
  );
}

export default CreateMeditation;