import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StartMeditation() {
  const navigate = useNavigate();

  const handleStartMeditation = () => {
    navigate("/session");
  };

  return (
    <section>
      <button
        type="button"
        onClick={handleStartMeditation}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-astraya-control border border-astraya-accent bg-astraya-accent/15 px-4 py-4 text-sm font-medium text-astraya-text shadow-astraya-selected backdrop-blur-sm transition-all duration-300 ease-out hover:bg-astraya-accent/25"
      >
        <Play size={18} fill="currentColor" />

        <span>Start Meditation</span>
      </button>
    </section>
  );
}

export default StartMeditation;