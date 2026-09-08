import { useState } from "react";

import LibraryCard from "../components/library/LibraryCard";
import LibrarySourceSelector from "../components/library/LibrarySourceSelector";

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

const astrayaPresets = [
  {
    id: "moon-piano",
    name: "Moon Piano",
    description: "Soft and minimal piano phrases",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-1.png`,
  },
  {
    id: "forest-dream",
    name: "Forest Dream",
    description: "Deep forest atmosphere",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-2.png`,
  },
  {
    id: "cosmic-waves",
    name: "Cosmic Waves",
    description: "Ambient waves and soft textures",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-3.png`,
  },
];

function Library() {
  const [selectedSource, setSelectedSource] = useState("creations");

  const meditations =
    selectedSource === "creations"
      ? myCreations
      : astrayaPresets;

  const sectionTitle =
    selectedSource === "creations"
      ? "Saved Meditations"
      : "Astraya Presets";

  const sectionDescription =
    selectedSource === "creations"
      ? "Find and replay your personal soundscapes."
      : "Explore meditation presets created by Astraya.";

  return (
    <div className="px-2 py-5 text-astraya-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
            Your Library
          </p>

          <h1 className="mt-2 text-2xl font-medium text-astraya-text">
            {sectionTitle}
          </h1>

          <p className="mt-1 text-sm text-astraya-muted">
            {sectionDescription}
          </p>
        </section>

        <LibrarySourceSelector
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
        />

        <section className="flex flex-col gap-3">
          {meditations.map((meditation) => (
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