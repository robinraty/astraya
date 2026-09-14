import { useState } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import SessionPlayer from "../components/meditationSession/SessionPlayer";

function MeditationSession() {
  // useLocation permet notamment de récupérer
  // les données envoyées avec navigate(..., { state }).
  const location = useLocation();

  // Indique si la fenêtre de sortie est ouverte.
  //
  // On l'utilise aussi pour modifier visuellement
  // l'arrière-plan de la Session.
  const [isExitMenuOpen, setIsExitMenuOpen] =
    useState(false);

  // Données reçues depuis la page précédente.
  //
  // Elles peuvent venir :
  // - d'un preset Astraya
  // - de Create Meditation
  // - maintenant d'une création MongoDB
  const state = location.state;

  // Si quelqu'un tape directement /session
  // sans avoir choisi de méditation,
  // aucune donnée n'existe.
  //
  // On le renvoie donc vers Meditate.
  if (!state) {
    return <Navigate to="/meditate" replace />;
  }

  // Récupère les trois informations importantes
  // envoyées vers la Session.
  const {
    meditation,
    duration,
    audioConfig,
  } = state;

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Artwork de la méditation */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
          isExitMenuOpen
            ? "scale-105 blur-md"
            : "scale-100 blur-0"
        }`}
        style={{
          backgroundImage: `url(${meditation.image})`,
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

      {/* SessionPlayer reçoit les données
          et gère réellement la méditation */}
      <SessionPlayer
        meditationName={meditation.name}
        duration={duration}
        audioConfig={audioConfig}
        onExitMenuChange={setIsExitMenuOpen}
      />
    </main>
  );
}

export default MeditationSession;