import { Moon, SlidersHorizontal, Headphones } from "lucide-react";

function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-astraya-border bg-astraya-background/95 px-6 py-3 text-astraya-muted backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center justify-around">
        <button
          type="button"
          className="flex cursor-pointer flex-col items-center gap-1 transition hover:text-astraya-text"
        >
          <Moon size={20} strokeWidth={1.5} />
          <span className="text-sm">Meditate</span>
        </button>

        <button
          type="button"
          className="flex cursor-pointer flex-col items-center gap-1 text-astraya-accent transition hover:text-astraya-text"
        >
          <SlidersHorizontal size={20} strokeWidth={1.5} />
          <span className="text-sm">Create</span>
        </button>

        <button
          type="button"
          className="flex cursor-pointer flex-col items-center gap-1 transition hover:text-astraya-text"
        >
          <Headphones size={20} strokeWidth={1.5} />
          <span className="text-sm">Library</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNavigation;