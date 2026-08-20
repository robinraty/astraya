import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

type SoundSource = "presets" | "creations";

type SoundItem = {
  id: string;
  name: string;
  description: string;
  image: string;
};

// Presets officiels Astraya
const astrayaPresets: SoundItem[] = [
  {
    id: "moon-piano",
    name: "Moon Piano",
    description: "Soft and minimal piano phrases",
    image: "/images/presets-artworks/astraya-artwork-moon-piano.png",
  },
  {
    id: "deep-forest",
    name: "Deep Forest",
    description: "Immersive forest atmosphere",
    image: "/images/presets-artworks/astraya-artwork-deep-forest.png",
  },
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    description: "Calming wave sounds",
    image: "/images/presets-artworks/astraya-artwork-ocean-waves.png",
  },
  {
    id: "rainy-day",
    name: "Rainy Day",
    description: "Gentle rain and distant thunder",
    image: "/images/presets-artworks/astraya-artwork-rainy-day.png",
  },
];

// Données temporaires pour représenter les créations utilisateur.
// Plus tard, elles viendront probablement du backend.
const myCreations: SoundItem[] = [
  {
    id: "creation-1",
    name: "Night Focus",
    description: "Piano, rain and deep atmosphere",
    image: "/images/presets-artworks/astraya-artwork-moon-piano.png",
  },
  {
    id: "creation-2",
    name: "Quiet Forest",
    description: "Forest sounds with soft piano",
    image: "/images/presets-artworks/astraya-artwork-deep-forest.png",
  },
];

type SoundCarouselProps = {
  source: SoundSource;
};

function SoundCarousel({ source }: SoundCarouselProps) {
  const [selectedSound, setSelectedSound] =
    useState<string>("moon-piano");

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Cette ref nous donne accès au vrai élément HTML scrollable.
  const carouselRef = useRef<HTMLDivElement>(null);

  // On choisit simplement quel tableau afficher selon la source active.
  const sounds =
    source === "presets" ? astrayaPresets : myCreations;

  // Titre affiché au-dessus du carousel.
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

  // Déplace le carousel de la largeur d'une card.
  const handleCarouselScroll = (
    direction: "left" | "right",
  ) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const firstCard =
      carousel.firstElementChild as HTMLElement | null;

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

  // Quand on change de source, on remet le carousel au début.
  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    updateScrollButtons();
  }, [source]);

  return (
    <section>
      {/* Titre de section + flèches de navigation */}
      <div className="flex items-center justify-between px-4">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-accent-light">
          {sectionTitle}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous sounds"
            disabled={!canScrollLeft}
            onClick={() =>
              handleCarouselScroll("left")
            }
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              canScrollLeft
                ? "cursor-pointer border-astraya-border bg-astraya-surface/70 text-astraya-text hover:border-astraya-accent hover:bg-astraya-surface-soft"
                : "cursor-default border-astraya-border/50 bg-astraya-surface/40 text-astraya-muted/30"
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            aria-label="Next sounds"
            disabled={!canScrollRight}
            onClick={() =>
              handleCarouselScroll("right")
            }
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              canScrollRight
                ? "cursor-pointer border-astraya-border bg-astraya-surface/70 text-astraya-text hover:border-astraya-accent hover:bg-astraya-surface-soft"
                : "cursor-default border-astraya-border/50 bg-astraya-surface/40 text-astraya-muted/30"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Rail horizontal continu */}
      <div
        ref={carouselRef}
        onScroll={updateScrollButtons}
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sounds.map((sound) => (
          <div
            key={sound.id}
            className={`flex w-[118px] shrink-0 snap-start flex-col rounded-astraya-control border p-2 transition-all duration-300 ease-out ${
              selectedSound === sound.id
                ? "border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected"
                : "border-astraya-border bg-astraya-surface/70"
            }`}
          >
            {/* Cliquer ici sélectionne le son */}
            <button
              type="button"
              onClick={() =>
                setSelectedSound(sound.id)
              }
              className="w-full cursor-pointer text-left"
            >
              <img
                src={sound.image}
                alt={sound.name}
                className="aspect-square w-full rounded-xl object-cover"
              />

              <p className="mt-2 text-xs font-medium leading-tight text-astraya-text">
                {sound.name}
              </p>

              <p className="mt-1 text-[10px] leading-3.5 text-astraya-muted">
                {sound.description}
              </p>
            </button>

            {/* Preview audio : visuel seulement pour le moment */}
            <div className="mt-auto flex justify-end pt-3">
              <button
                type="button"
                aria-label={`Preview ${sound.name}`}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-astraya-border bg-astraya-surface-soft text-astraya-text transition-all duration-300 ease-out hover:border-astraya-accent"
              >
                <Play
                  size={12}
                  fill="currentColor"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SoundCarousel;