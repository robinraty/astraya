import { useEffect, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SessionPlayer({
  meditationName,
  duration,
  audioConfig,
  onExitMenuChange,
}) {
  const navigate = useNavigate();

  // Indique si la meditation est actuellement en lecture.
  const [isPlaying, setIsPlaying] = useState(false);

  // Convertit la duree en minutes vers des secondes.
  const [remainingSeconds, setRemainingSeconds] =
    useState(duration * 60);

  // Controle l'affichage du menu de confirmation de sortie.
  const [isExitMenuOpen, setIsExitMenuOpen] =
    useState(false);

  // Permet de savoir s'il faut reprendre
  // apres avoir ferme le menu.
  const [wasPlayingBeforeExit, setWasPlayingBeforeExit] =
    useState(false);

  // --------------------------------------------------
  // REFERENCES AUDIO
  // --------------------------------------------------

  // Moteur audio principal.
  const audioContextRef = useRef(null);

  // Pad principal.
  const padAudioRef = useRef(null);
  const padGainRef = useRef(null);

  // Musical Theme.
  const themeAudioRef = useRef(null);
  const themeGainRef = useRef(null);

  // Les 5 sons de nature.
  const natureAudioRef = useRef({});
  const natureGainRef = useRef({});

  // Timeout utilise pour attendre la fin du fade-out.
  const pauseTimeoutRef = useRef(null);

  // --------------------------------------------------
  // INITIALISATION DU MIX AUDIO
  // --------------------------------------------------

  useEffect(() => {
    // Certaines sessions pourront ne pas encore avoir
    // de configuration audio.
    if (!audioConfig) {
      return;
    }

    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();

    audioContextRef.current = audioContext;

    // -------------------------
    // PAD
    // -------------------------

    // Exemple :
    // airy + bright
    // devient airy-bright.wav
    const padPath = `${
      import.meta.env.BASE_URL
    }audio/pads/${audioConfig.atmosphere}-${audioConfig.pitch}.wav`;

    const padAudio = new Audio(padPath);

    padAudio.loop = true;

    const padSource =
      audioContext.createMediaElementSource(padAudio);

    const padGain = audioContext.createGain();

    // Commence silencieux.
    padGain.gain.value = 0;

    padSource.connect(padGain);
    padGain.connect(audioContext.destination);

    padAudioRef.current = padAudio;
    padGainRef.current = padGain;

    // -------------------------
    // MUSICAL THEME
    // -------------------------

    // Le Musical Theme suit le Pitch :
    //
    // dark
    // natural
    // bright
    const themePath = `${
      import.meta.env.BASE_URL
    }audio/themes/soft-strings-${audioConfig.pitch}.wav`;

    const themeAudio = new Audio(themePath);

    themeAudio.loop = true;

    const themeSource =
      audioContext.createMediaElementSource(themeAudio);

    const themeGain = audioContext.createGain();

    themeGain.gain.value = 0;

    themeSource.connect(themeGain);
    themeGain.connect(audioContext.destination);

    themeAudioRef.current = themeAudio;
    themeGainRef.current = themeGain;

    // -------------------------
    // NATURE SOUNDS
    // -------------------------

    const natureSounds = [
      "rain",
      "forest",
      "birds",
      "river",
      "waves",
    ];

    natureSounds.forEach((sound) => {
      const audio = new Audio(
        `${import.meta.env.BASE_URL}audio/nature/${sound}.wav`
      );

      audio.loop = true;

      const source =
        audioContext.createMediaElementSource(audio);

      const gain = audioContext.createGain();

      gain.gain.value = 0;

      source.connect(gain);
      gain.connect(audioContext.destination);

      natureAudioRef.current[sound] = audio;
      natureGainRef.current[sound] = gain;
    });

    // Nettoyage quand on quitte la session.
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      padAudio.pause();
      themeAudio.pause();

      Object.values(natureAudioRef.current).forEach(
        (audio) => {
          audio.pause();
        }
      );

      audioContext.close();
    };
  }, [audioConfig]);

  // --------------------------------------------------
  // PLAY / PAUSE AUDIO
  // --------------------------------------------------

  useEffect(() => {
    if (!audioConfig) {
      return;
    }

    const audioContext = audioContextRef.current;

    const padAudio = padAudioRef.current;
    const padGain = padGainRef.current;

    const themeAudio = themeAudioRef.current;
    const themeGain = themeGainRef.current;

    if (
      !audioContext ||
      !padAudio ||
      !padGain ||
      !themeAudio ||
      !themeGain
    ) {
      return;
    }

    const now = audioContext.currentTime;

    // Annule un ancien timeout de pause.
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    // -------------------------
    // PLAY
    // -------------------------

    if (isPlaying) {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      // Lance tous les fichiers.
      padAudio.play();
      themeAudio.play();

      Object.values(natureAudioRef.current).forEach(
        (audio) => {
          audio.play();
        }
      );

      // PAD
      padGain.gain.cancelScheduledValues(now);

      padGain.gain.setValueAtTime(
        padGain.gain.value,
        now
      );

      // Si Atmosphere est active :
      // fade-in vers 100%.
      //
      // Sinon le pad reste silencieux.
      padGain.gain.linearRampToValueAtTime(
        audioConfig.atmosphereEnabled ? 1 : 0,
        now + 1.5
      );

      // MUSICAL THEME
      themeGain.gain.cancelScheduledValues(now);

      themeGain.gain.setValueAtTime(
        themeGain.gain.value,
        now
      );

      themeGain.gain.linearRampToValueAtTime(
        audioConfig.musicalThemeEnabled ? 1 : 0,
        now + 1.5
      );

      // NATURE SOUNDS
      Object.entries(
        audioConfig.natureVolumes
      ).forEach(([sound, volume]) => {
        const gain = natureGainRef.current[sound];

        if (!gain) {
          return;
        }

        gain.gain.cancelScheduledValues(now);

        gain.gain.setValueAtTime(
          gain.gain.value,
          now
        );

        // Exemple :
        // Birds 80 devient volume 0.8.
        gain.gain.linearRampToValueAtTime(
          volume / 100,
          now + 1.5
        );
      });

      return;
    }

    // -------------------------
    // PAUSE
    // -------------------------

    // Fade-out du pad.
    padGain.gain.cancelScheduledValues(now);

    padGain.gain.setValueAtTime(
      padGain.gain.value,
      now
    );

    padGain.gain.linearRampToValueAtTime(
      0,
      now + 0.6
    );

    // Fade-out du theme.
    themeGain.gain.cancelScheduledValues(now);

    themeGain.gain.setValueAtTime(
      themeGain.gain.value,
      now
    );

    themeGain.gain.linearRampToValueAtTime(
      0,
      now + 0.6
    );

    // Fade-out des sons de nature.
    Object.values(natureGainRef.current).forEach(
      (gain) => {
        gain.gain.cancelScheduledValues(now);

        gain.gain.setValueAtTime(
          gain.gain.value,
          now
        );

        gain.gain.linearRampToValueAtTime(
          0,
          now + 0.6
        );
      }
    );

    // On attend la fin du fade-out
    // avant de mettre les fichiers en pause.
    pauseTimeoutRef.current = setTimeout(() => {
      padAudioRef.current?.pause();
      themeAudioRef.current?.pause();

      Object.values(natureAudioRef.current).forEach(
        (audio) => {
          audio.pause();
        }
      );

      pauseTimeoutRef.current = null;
    }, 650);
  }, [isPlaying, audioConfig]);

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  // Le timer retire une seconde toutes les secondes
  // pendant la lecture.
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

    // Supprime l'ancien interval pour eviter
    // plusieurs timers en meme temps.
    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, remainingSeconds]);

  // La session est terminee quand le timer arrive a zero.
  const isSessionComplete = remainingSeconds === 0;

  // Transforme les secondes restantes
  // en affichage minutes:secondes.
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // --------------------------------------------------
  // CONTROLES
  // --------------------------------------------------

  const handlePlayPause = () => {
    if (isSessionComplete) {
      return;
    }

    setIsPlaying(
      (currentPlayingState) => !currentPlayingState
    );
  };

  const handleOpenExitMenu = () => {
    // Memorise si la meditation jouait.
    setWasPlayingBeforeExit(isPlaying);

    // Met automatiquement l'audio et le timer en pause.
    setIsPlaying(false);

    setIsExitMenuOpen(true);
    onExitMenuChange(true);
  };

  const handleContinue = () => {
    setIsExitMenuOpen(false);
    onExitMenuChange(false);

    // Reprend seulement si la meditation jouait
    // avant l'ouverture du menu.
    if (wasPlayingBeforeExit) {
      setIsPlaying(true);
    }
  };

  // Termine la session et retourne a Meditate.
  const handleEndSession = () => {
    // Le changement de page declenche le cleanup
    // du moteur audio.
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