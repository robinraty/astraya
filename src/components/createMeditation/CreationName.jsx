import { useState } from "react";

function CreationName({
  creationName,
  setCreationName,
}) {
  // Indique si l'utilisateur est en train de modifier le nom.
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/60 p-6 shadow-astraya-card backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Creation name
      </p>

      <div className="mt-3 flex items-center justify-between gap-4">
        {isEditing ? (
          // Champ texte affiché pendant la modification du nom.
          <input
            type="text"
            value={creationName}
            onChange={(event) =>
              setCreationName(event.target.value)
            }
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="min-w-0 flex-1 border-b border-astraya-accent bg-transparent text-3xl font-medium text-astraya-text outline-none"
          />
        ) : (
          // Nom affiché normalement quand on ne l'édite pas.
          <h2 className="text-3xl font-medium text-astraya-text">
            {creationName}
          </h2>
        )}

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label="Edit creation name"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-astraya-border text-astraya-muted transition hover:border-astraya-accent hover:bg-astraya-accent/10 hover:text-astraya-text"
        >
          ✎
        </button>
      </div>
    </section>
  );
}

export default CreationName;