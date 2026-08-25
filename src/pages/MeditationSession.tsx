import SessionPlayer from "../components/meditationSession/SessionPlayer";

function MeditationSession() {
  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-3.png`,
      }}
    >
      {/* Overlay sombre pour garder le texte lisible */}
      <div className="absolute inset-0 bg-astraya-background/35" />

      <SessionPlayer />
    </main>
  );
}

export default MeditationSession;