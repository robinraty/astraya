import LibraryCard from "../components/library/LibraryCard";

// Pour le moment, les creations sont encore ecrites en dur.
// Plus tard, elles viendront du backend / de la base de donnees.
const myCreations = [
  {
    id: "night-calm",
    name: "Night Calm",
    description: "Rain • Forest • Piano",
    image: `${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-moon-piano.png`,
  },
  {
    id: "deep-forest",
    name: "Deep Forest",
    description: "Forest • River • Birds",
    image: `${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-deep-forest.png`,
  },
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    description: "Waves • Rain • Piano",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-3.png`,
  },
];

function Library() {
  return (
    <div className="px-2 py-5 text-astraya-text">
      {/* Conteneur principal de la page */}
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Introduction de la page */}
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
            My Creations
          </p>

          <h1 className="mt-2 text-2xl font-medium text-astraya-text">
            Saved Meditations
          </h1>

          <p className="mt-1 text-sm text-astraya-muted">
            Find and replay your personal soundscapes.
          </p>
        </section>

        {/* Liste des meditations creees et sauvegardees par l'utilisateur */}
        <section className="flex flex-col gap-3">
          {myCreations.map((meditation) => (
            <LibraryCard
              key={meditation.id}
              name={meditation.name}
              description={meditation.description}
              image={meditation.image}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default Library;