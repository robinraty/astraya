import { MoreHorizontal, Play } from "lucide-react";

function LibraryCard({
  name,
  description,
  image,
}) {
  return (
    <article className="flex items-center gap-3 rounded-astraya-card border border-astraya-border bg-astraya-surface/60 p-4 shadow-astraya-card backdrop-blur-sm">
      <img
        src={image}
        alt={name}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-astraya-text">
          {name}
        </p>

        <p className="mt-1 text-xs leading-4 text-astraya-muted">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`Play ${name}`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-astraya-accent bg-astraya-accent/10 text-astraya-text transition-all duration-300 ease-out hover:bg-astraya-accent/20"
        >
          <Play size={14} fill="currentColor" />
        </button>

        <button
          type="button"
          aria-label={`More options for ${name}`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-astraya-border bg-astraya-surface-soft text-astraya-muted transition-all duration-300 ease-out hover:border-astraya-accent hover:text-astraya-text"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </article>
  );
}

export default LibraryCard;