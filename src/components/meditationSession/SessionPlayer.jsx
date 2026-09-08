import { useEffect, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SessionPlayer({
  meditationName,
  duration,
  onExitMenuChange,
}) {
  const navigate = useNavigate();

  // Indique si la méditation est actuellement en lecture.
  const [isPlaying, setIsPlaying] = useState(false);

  // Convertit la durée en minutes vers des secondes.
  const [remainingSeconds, setRemainingSeconds] =
    useState(duration * 60);

  // Contrôle l'affichage du menu de confirmation de sortie.
  const [isExitMenuOpen, setIsExitMenuOpen] =
    useState(false);

  // Permet de savoir s'il faut reprendre après avoir fermé le menu.
  const [wasPlayingBeforeExit, setWasPlayingBeforeExit] =
    useState(false);

  // Le timer retire une seconde toutes les secondes pendant la lecture.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (remainingSeconds <= 0) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsPlaying(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    // Supprime l'ancien interval pour éviter plusieurs timers en même temps.
    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, remainingSeconds]);

  // La session est terminée quand le timer arrive à zéro.
  const isSessionComplete = remainingSeconds === 0;

  // Transforme les secondes restantes en affichage minutes:secondes.
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const handlePlayPause = () => {
    if (isSessionComplete) {
      return;
    }

    setIsPlaying(
      (currentPlayingState) => !currentPlayingState,
    );
  };

  const handleOpenExitMenu = () => {
    setWasPlayingBeforeExit(isPlaying);
    setIsPlaying(false);
    setIsExitMenuOpen(true);
    onExitMenuChange(true);
  };

  const handleContinue = () => {
    setIsExitMenuOpen(false);
    onExitMenuChange(false);

    // Reprend seulement si la session jouait avant l'ouverture du menu.
    if (wasPlayingBeforeExit) {
      setIsPlaying(true);
    }
  };

  // Termine la session et retourne à la page Meditate.
  const handleEndSession = () => {
    navigate("/meditate");
  };

  return (
    <div className="relative z-10 h-full text-astraya-text">
      {!isExitMenuOpen && !isSessionComplete && (
        <button
          type="button"
          onClick={handleOpenExitMenu}
          aria-label="End meditation"
          className="absolute left-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/20"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      )}

      <div className="flex h-full items-center justify-center px-6">
        {isExitMenuOpen ? (
          <div className="flex flex-col items-center text-center">
            <p className="text-xl font-medium">
              End meditation?
            </p>

            <p className="mt-2 text-sm text-astraya-text/60">
              Your current session will end.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handleContinue}
                className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/20"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={handleEndSession}
                className="cursor-pointer rounded-full border border-astraya-accent/60 bg-astraya-accent/15 px-6 py-3 text-sm transition-all duration-300 ease-out hover:bg-astraya-accent/25"
              >
                End session
              </button>
            </div>
          </div>
        ) : isSessionComplete ? (
          // Remplace le player normal quand la méditation est terminée.
          <div className="flex flex-col items-center text-center">
            <p className="text-xl font-medium">
              Session complete
            </p>

            <button
              type="button"
              onClick={handleEndSession}
              className="mt-8 cursor-pointer rounded-full border border-astraya-accent/60 bg-astraya-accent/15 px-8 py-3 text-sm transition-all duration-300 ease-out hover:bg-astraya-accent/25"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-sm tracking-[0.2em] text-astraya-text/70">
              {meditationName}
            </p>

            <p className="text-5xl font-light tracking-wide">
              {formattedTime}
            </p>

            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={
                isPlaying
                  ? "Pause meditation"
                  : "Play meditation"
              }
              className="mt-10 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause size={40} fill="currentColor" />
              ) : (
                <Play size={40} fill="currentColor" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionPlayer;