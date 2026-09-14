import {
  MoreHorizontal,
  Pause,
  Play,
} from "lucide-react";

function LibraryCard({
  name,
  description,
  image,
  isPreviewPlaying,
  onPreview,
}) {
  return (
    // Une carte représente une création sauvegardée.
    //
    // Les informations viennent de MyCreations.jsx,
    // qui les récupère depuis MongoDB.
    <article className="flex items-center gap-3 rounded-astraya-card border border-astraya-border bg-astraya-surface/60 p-4 shadow-astraya-card backdrop-blur-sm">
      {/* Artwork de la création */}
      <img
        src={image}
        alt={name}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      {/* Informations principales */}
      <div className="min-w-0 flex-1">
        {/* Nom sauvegardé dans MongoDB */}
        <p className="text-sm font-medium text-astraya-text">
          {name}
        </p>

        {/* Description générée à partir de l'audioConfig */}
        <p className="mt-1 text-xs leading-4 text-astraya-muted">
          {description}
        </p>
      </div>

      {/* Actions disponibles sur la création */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Lance ou arrête la preview audio de cette création */}
        <button
          type="button"
          onClick={onPreview}
          aria-label={
            isPreviewPlaying
              ? `Pause ${name}`
              : `Preview ${name}`
          }
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ease-out ${
            isPreviewPlaying
              ? "border-astraya-accent bg-astraya-accent/15 text-astraya-accent-light shadow-astraya-selected"
              : "border-astraya-accent bg-astraya-accent/10 text-astraya-text hover:bg-astraya-accent/20"
          }`}
        >
          {isPreviewPlaying ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" />
          )}
        </button>

        {/* Ce bouton servira plus tard
            pour modifier ou supprimer la création */}
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