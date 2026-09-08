import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// Presets officiels Astraya
const astrayaPresets = [
  {
    id: "moon-piano",
    name: "Moon Piano",
    description: "Soft and minimal piano phrases",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-1.png`,
  },
  {
    id: "deep-forest",
    name: "Deep Forest",
    description: "Immersive forest atmosphere",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-2.png`,
  },
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    description: "Calming wave sounds",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-3.png`,
  },
  {
    id: "rainy-day",
    name: "Rainy Day",
    description: "Gentle rain and distant thunder",
    image: `${import.meta.env.BASE_URL}images/ambiant-images/astraya-background-4.png`,
  },
];

// Données temporaires pour représenter les créations utilisateur.
// Plus tard, elles viendront probablement du backend.
const myCreations = [
  {
    id: "creation-1",
    name: "Night Focus",
    description: "Piano, rain and deep atmosphere",
    image: `${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-moon-piano.png`,
  },
  {
    id: "creation-2",
    name: "Quiet Forest",
    description: "Forest sounds with soft piano",
    image: `${import.meta.env.BASE_URL}images/presets-artworks/astraya-artwork-deep-forest.png`,
  },
];

function SoundCarousel({
  source,
  onSoundChange,
}) {
  const [selectedSound, setSelectedSound] =
    useState("moon-piano");

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselRef = useRef(null);

  const sounds =
    source === "presets" ? astrayaPresets : myCreations;

  const sectionTitle =
    source === "presets" ? "Explore Presets" : "My Creations";

  const updateScrollButtons = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScrollLeft =
      carousel.scrollWidth - carousel.clientWidth;

    setCanScrollLeft(carousel.scrollLeft > 1);

    setCanScrollRight(
      carousel.scrollLeft < maxScrollLeft - 1,
    );
  };

  const handleCarouselScroll = (direction) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const firstCard = carousel.firstElementChild;

    if (!firstCard) {
      return;
    }

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const gap = 12;

    carousel.scrollBy({
      left:
        direction === "right"
          ? cardWidth + gap
          : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  const handleSoundSelection = (sound) => {
    setSelectedSound(sound.id);
    onSoundChange(sound);
  };

  useEffect(() => {
    updateScrollButtons();

    window.addEventListener(
      "resize",
      updateScrollButtons,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateScrollButtons,
      );
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    const firstSound = sounds[0];

    if (!firstSound) {
      return;
    }

    setSelectedSound(firstSound.id);
    onSoundChange(firstSound);

    if (!carousel) {
      return;
    }

    carousel.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    updateScrollButtons();
  }, [source, onSoundChange]);

  return (
    <section className="min-w-0">
      {/* Titre de section + flèches de navigation */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
          {sectionTitle}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous sounds"
            disabled={!canScrollLeft}
            onClick={() => handleCarouselScroll("left")}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              canScrollLeft
                ? "cursor-pointer border-astraya-border bg-astraya-surface/20 text-astraya-text backdrop-blur-sm hover:bg-astraya-surface-soft/60"
                : "cursor-default border-astraya-border/50 bg-astraya-surface/20 text-astraya-muted/30"
            }`}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Next sounds"
            disabled={!canScrollRight}
            onClick={() => handleCarouselScroll("right")}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              canScrollRight
                ? "cursor-pointer border-astraya-border bg-astraya-surface/20 text-astraya-text backdrop-blur-sm hover:bg-astraya-surface-soft/60"
                : "cursor-default border-astraya-border/50 bg-astraya-surface/20 text-astraya-muted/30"
            }`}
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Exactement 3 cartes visibles */}
      <div
        ref={carouselRef}
        onScroll={updateScrollButtons}
        className="mt-4 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sounds.map((sound) => {
          const isSelected = selectedSound === sound.id;

          return (
            <div
              key={sound.id}
              className={`flex w-[calc((100%_-_1.5rem)/3)] shrink-0 snap-start flex-col rounded-astraya-control border p-2 backdrop-blur-sm transition-all duration-300 ease-out ${
                isSelected
                  ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
                  : "border-astraya-border bg-astraya-surface/20"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSoundSelection(sound)}
                className="w-full cursor-pointer text-left"
              >
                <img
                  src={sound.image}
                  alt={sound.name}
                  className="aspect-square w-full rounded-xl object-cover"
                />

                <p className="mt-2 text-sm font-medium leading-tight text-astraya-text">
                  {sound.name}
                </p>

                <p className="mt-1 text-xs leading-4 text-astraya-muted">
                  {sound.description}
                </p>
              </button>

              <div className="mt-auto flex justify-end pt-3">
                <button
                  type="button"
                  aria-label={`Preview ${sound.name}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-astraya-border bg-astraya-surface-soft text-astraya-text transition-all duration-300 ease-out hover:border-astraya-accent"
                >
                  <Play size={12} fill="currentColor" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SoundCarousel;