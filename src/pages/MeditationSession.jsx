import {
  useState,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import SessionPlayer from "../components/meditationSession/SessionPlayer";

function MeditationSession() {
  // Récupère les données envoyées
  // avec navigate(..., { state }).
  const location =
    useLocation();

  // Indique si la fenêtre
  // de sortie est ouverte.
  const [
    isExitMenuOpen,
    setIsExitMenuOpen,
  ] = useState(false);

  // Données reçues depuis :
  //
  // - un preset Astraya
  // - Create Meditation
  // - une création MongoDB
  const state =
    location.state;

  // Si quelqu'un ouvre directement /session
  // sans avoir sélectionné de méditation,
  // on revient vers Meditate.
  if (!state) {
    return (
      <Navigate
        to="/meditate"
        replace
      />
    );
  }

  const {
    meditation,
    duration,
    audioConfig,
  } = state;

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Artwork choisi pour la méditation */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
          isExitMenuOpen
            ? "scale-105 blur-md"
            : "scale-100 blur-0"
        }`}
        style={{
          backgroundImage:
            `url(${meditation.image})`,
        }}
      />

      {/* Overlay sombre */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-out ${
          isExitMenuOpen
            ? "bg-astraya-background/55"
            : "bg-astraya-background/35"
        }`}
      />

      {/* Player principal */}
      <SessionPlayer
        meditationName={
          meditation.name
        }
        duration={
          duration
        }
        audioConfig={
          audioConfig
        }
        onExitMenuChange={
          setIsExitMenuOpen
        }
      />
    </main>
  );
}

export default MeditationSession;