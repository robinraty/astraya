import { useState } from "react";

// --------------------------------------------------
// IMAGES DISPONIBLES
// --------------------------------------------------
//
// On garde uniquement le chemin relatif.
//
// Cela permet de sauvegarder une petite chaîne
// dans MongoDB au lieu de sauvegarder l'image elle-même.
const creationImages = Array.from(
  { length: 20 },
  (_, index) =>
    `images/ambiant-images/astraya-background-${index + 1}.png`
);

function CreationName({
  creationName,
  setCreationName,
  creationImage,
  setCreationImage,
}) {
  // Indique si l'utilisateur modifie le nom.
  const [isEditing, setIsEditing] =
    useState(false);

  // Indique si le sélecteur d'images est ouvert.
  const [
    isImagePickerOpen,
    setIsImagePickerOpen,
  ] = useState(false);

  // Transforme le chemin relatif sauvegardé
  // en vraie URL utilisable par React.
  //
  // Exemple :
  //
  // images/ambiant-images/astraya-background-4.png
  //
  // devient :
  //
  // /astraya/images/ambiant-images/astraya-background-4.png
  //
  // sur GitHub Pages.
  const getImageUrl = (imagePath) => {
    return `${
      import.meta.env.BASE_URL
    }${imagePath}`;
  };

  // Sélectionne une nouvelle image.
  const handleImageSelection = (
    imagePath
  ) => {
    setCreationImage(imagePath);

    // Ferme automatiquement
    // le sélecteur après le choix.
    setIsImagePickerOpen(false);
  };

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/60 p-5 shadow-astraya-card backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Creation
      </p>

      {/* Identité principale de la création */}
      <div className="mt-4 flex items-center gap-4">
        {/* Artwork sélectionné */}
        <button
          type="button"
          onClick={() =>
            setIsImagePickerOpen(
              !isImagePickerOpen
            )
          }
          aria-label="Choose creation artwork"
          className="group relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-astraya-border transition-all duration-300 hover:border-astraya-accent"
        >
          <img
            src={getImageUrl(
              creationImage
            )}
            alt="Selected creation artwork"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          {/* Petit overlay au survol */}
          <div className="absolute inset-0 flex items-end justify-center bg-astraya-background/0 pb-2 transition group-hover:bg-astraya-background/35">
            <span className="translate-y-3 text-[10px] uppercase tracking-[0.12em] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              Change
            </span>
          </div>
        </button>

        {/* Nom de la création */}
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.15em] text-astraya-muted">
            Creation name
          </p>

          <div className="mt-2 flex items-center gap-3">
            {isEditing ? (
              <input
                type="text"
                value={creationName}
                onChange={(event) =>
                  setCreationName(
                    event.target.value
                  )
                }
                onBlur={() =>
                  setIsEditing(false)
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    setIsEditing(
                      false
                    );
                  }
                }}
                autoFocus
                className="min-w-0 flex-1 border-b border-astraya-accent bg-transparent text-2xl font-medium text-astraya-text outline-none"
              />
            ) : (
              <h2 className="min-w-0 flex-1 truncate text-2xl font-medium text-astraya-text">
                {creationName}
              </h2>
            )}

            <button
              type="button"
              onClick={() =>
                setIsEditing(true)
              }
              aria-label="Edit creation name"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-astraya-border text-astraya-muted transition hover:border-astraya-accent hover:bg-astraya-accent/10 hover:text-astraya-text"
            >
              ✎
            </button>
          </div>
        </div>
      </div>

      {/* Sélecteur des 20 artworks */}
      {isImagePickerOpen && (
        <div className="mt-5 border-t border-astraya-border pt-4">
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-astraya-muted">
            Choose artwork
          </p>

          <div className="grid grid-cols-5 gap-2">
            {creationImages.map(
              (imagePath) => {
                const isSelected =
                  creationImage ===
                  imagePath;

                return (
                  <button
                    key={imagePath}
                    type="button"
                    onClick={() =>
                      handleImageSelection(
                        imagePath
                      )
                    }
                    className={`aspect-square cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "border-astraya-accent shadow-astraya-selected"
                        : "border-astraya-border hover:border-astraya-accent"
                    }`}
                  >
                    <img
                      src={getImageUrl(
                        imagePath
                      )}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CreationName;