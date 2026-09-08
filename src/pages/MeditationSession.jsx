import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import SessionPlayer from "../components/meditationSession/SessionPlayer";

function MeditationSession() {
  const location = useLocation();

  const [isExitMenuOpen, setIsExitMenuOpen] =
    useState(false);

  const state = location.state;

  if (!state) {
    return <Navigate to="/meditate" replace />;
  }

  const { meditation, duration } = state;

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Artwork de la méditation */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
          isExitMenuOpen
            // Ca c'est l'animation de blur quand on appuye sur pause pendant une meditation.
            // On floute JUSTE l'artwork.
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

      <SessionPlayer
        meditationName={meditation.name}
        duration={duration}
        onExitMenuChange={setIsExitMenuOpen}
      />
    </main>
  );
}

export default MeditationSession;