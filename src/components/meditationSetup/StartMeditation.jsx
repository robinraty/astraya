import { useNavigate } from "react-router-dom";

function StartMedititation({
  selectedMeditation,
  selectedDuration,
}) {
  const navigate = useNavigate();

  const handleStartMeditation = () => {
    if (!selectedMeditation) {
      return;
    }

    navigate("/session", {
      state: {
        meditation: selectedMeditation,
        duration: selectedDuration,
      },
    });
  };

  return (
    <section className="mt-2">
      <button
        type="button"
        onClick={handleStartMeditation}
        disabled={!selectedMeditation}
        className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-astraya-control border border-astraya-accent/65 bg-astraya-surface/30 px-4 py-4 text-base font-medium text-astraya-text shadow-[0_0_28px_rgb(111_157_255_/_0.16)] backdrop-blur-sm transition-all duration-500 ease-out hover:border-astraya-accent hover:bg-astraya-accent/8 hover:shadow-[0_0_38px_rgb(111_157_255_/_0.24)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="pointer-events-none absolute inset-0 animate-[pulse_5s_ease-in-out_infinite] bg-[radial-gradient(circle_at_center,rgb(111_157_255_/_0.12),transparent_68%)]" />

        <span className="relative z-10">
          Start Meditation
        </span>
      </button>
    </section>
  );
}

export default StartMedititation;