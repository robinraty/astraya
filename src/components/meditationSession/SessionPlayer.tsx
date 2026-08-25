import { Pause } from "lucide-react";

function SessionPlayer() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-astraya-text">
      <p className="mb-4 text-sm tracking-[0.2em] text-astraya-text/70">
        Meditation Name
      </p>

      <p className="text-5xl font-light tracking-wide">
        Timer
      </p>

      <button
        type="button"
        aria-label="Pause meditation"
        className="mt-8 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/20"
      >
        <Pause size={28} fill="currentColor" />
      </button>
    </div>
  );
}

export default SessionPlayer;