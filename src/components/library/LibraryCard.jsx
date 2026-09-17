import {
  MoreHorizontal,
  Pause,
  Play,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

function LibraryCard({
  name,
  description,
  image,
  isPreviewPlaying,
  onPreview,
  onMeditate,
  onDelete,
}) {
  // Indique si le petit menu
  // des trois points est ouvert.
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  // Référence vers le menu.
  const menuRef =
    useRef(null);

  // --------------------------------------------------
  // FERMETURE DU MENU AU CLIC EXTERIEUR
  // --------------------------------------------------

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // --------------------------------------------------
  // MEDITER
  // --------------------------------------------------

  const handleMeditate = () => {
    setIsMenuOpen(false);

    onMeditate();
  };

  // --------------------------------------------------
  // SUPPRIMER
  // --------------------------------------------------

  const handleDelete = () => {
    setIsMenuOpen(false);

    onDelete();
  };

  return (
    <article
      className={`relative flex items-center gap-3 rounded-astraya-card border border-astraya-border bg-astraya-surface/60 p-4 shadow-astraya-card backdrop-blur-sm transition ${
        isMenuOpen
          ? "z-50"
          : "z-0"
      }`}
    >
      {/* Artwork */}
      <img
        src={image}
        alt={name}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      {/* Informations */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-astraya-text">
          {name}
        </p>

        <p className="mt-1 text-xs leading-4 text-astraya-muted">
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Preview */}
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
            <Pause
              size={14}
              fill="currentColor"
            />
          ) : (
            <Play
              size={14}
              fill="currentColor"
            />
          )}
        </button>

        {/* Menu trois points */}
        <div
          ref={menuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                !isMenuOpen
              )
            }
            aria-label={`More options for ${name}`}
            aria-expanded={
              isMenuOpen
            }
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-astraya-border bg-astraya-surface-soft text-astraya-muted transition-all duration-300 ease-out hover:border-astraya-accent hover:text-astraya-text"
          >
            <MoreHorizontal
              size={16}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-[100] mt-2 w-36 overflow-hidden rounded-astraya-control border border-astraya-border bg-astraya-surface shadow-astraya-card">
              {/* Méditer */}
              <button
                type="button"
                onClick={
                  handleMeditate
                }
                className="w-full cursor-pointer px-4 py-3 text-left text-sm text-astraya-text transition hover:bg-astraya-surface-soft"
              >
                Meditate
              </button>

              {/* Supprimer */}
              <button
                type="button"
                onClick={
                  handleDelete
                }
                className="w-full cursor-pointer border-t border-astraya-border px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default LibraryCard;