import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Clock3 } from "lucide-react";

function DurationSelector({
  selectedDuration,
  onDurationChange,
}) {
  // --------------------------------------------------
  // DURÉES PRÉDÉFINIES
  // --------------------------------------------------
  //
  // Ce sont les durées affichées dans le mode classique.
  //
  // Chaque valeur sera transformée en bouton avec .map().
  const durations = [
    5,
    10,
    15,
    20,
    30,
    45,
  ];

  // --------------------------------------------------
  // DURÉES PERSONNALISÉES
  // --------------------------------------------------
  //
  // On crée automatiquement un tableau contenant
  // toutes les valeurs de 1 à 120.
  //
  // Résultat :
  // [1, 2, 3, 4, ..., 120]
  //
  // Array.from évite d'écrire 120 valeurs à la main.
  const customDurations =
    Array.from(
      { length: 120 },
      (_, index) =>
        index + 1,
    );

  // --------------------------------------------------
  // MODE CUSTOM ACTIF OU NON
  // --------------------------------------------------
  //
  // false :
  // affiche les boutons classiques
  //
  // true :
  // affiche le sélecteur horizontal personnalisé
  const [
    isCustomActive,
    setIsCustomActive,
  ] = useState(false);

  // --------------------------------------------------
  // RÉFÉRENCE VERS LE PICKER HORIZONTAL
  // --------------------------------------------------
  //
  // useRef permet ici d'accéder directement
  // à l'élément HTML qui scroll horizontalement.
  //
  // Grâce à cette ref, on peut :
  // - lire sa position avec scrollLeft
  // - modifier sa position avec scrollTo()
  const customPickerRef =
    useRef(null);

  // --------------------------------------------------
  // LARGEUR D'UNE DURÉE
  // --------------------------------------------------
  //
  // Chaque durée du picker fait 64px de large.
  //
  // Cette valeur sert ensuite à convertir
  // une position de scroll en index.
  const itemWidth = 64;

  // --------------------------------------------------
  // POSITIONNEMENT DU PICKER À L'OUVERTURE
  // --------------------------------------------------
  //
  // Ce useEffect s'exécute quand isCustomActive change.
  //
  // Quand l'utilisateur active le mode custom,
  // on déplace automatiquement le picker
  // jusqu'à la durée déjà sélectionnée.
  //
  // Exemple :
  // selectedDuration = 30
  //
  // Le picker s'ouvre directement autour de 30 min
  // au lieu de repartir sur 1 min.
  useEffect(() => {
    if (!isCustomActive) {
      return;
    }

    const picker =
      customPickerRef.current;

    if (!picker) {
      return;
    }

    picker.scrollTo({
      // On retire 1 car :
      //
      // 1 min = index 0
      // 2 min = index 1
      // 3 min = index 2
      //
      // Puis on multiplie l'index
      // par la largeur d'un élément.
      left:
        (selectedDuration - 1) *
        itemWidth,

      // Rend le déplacement visuellement fluide.
      behavior: "smooth",
    });
  }, [isCustomActive]);

  // --------------------------------------------------
  // GESTION DU SCROLL CUSTOM
  // --------------------------------------------------
  //
  // Cette fonction est appelée à chaque fois
  // que l'utilisateur fait défiler le picker.
  //
  // Son objectif :
  // transformer la position horizontale du scroll
  // en durée sélectionnée.
  const handleCustomScroll = () => {
    const picker =
      customPickerRef.current;

    if (!picker) {
      return;
    }

    // scrollLeft donne le nombre de pixels
    // parcourus horizontalement.
    //
    // Comme chaque élément fait 64px,
    // on divise par 64 pour obtenir
    // l'index le plus proche.
    //
    // Math.round sélectionne
    // la valeur la plus proche du centre.
    const selectedIndex =
      Math.round(
        picker.scrollLeft /
          itemWidth,
      );

    // On récupère ensuite la vraie durée
    // dans le tableau [1, 2, ..., 120].
    const newDuration =
      customDurations[
        selectedIndex
      ];

    // Si une durée valide existe,
    // on prévient le composant parent
    // que la durée a changé.
    if (newDuration) {
      onDurationChange(
        newDuration
      );
    }
  };

  // --------------------------------------------------
  // ACTIVATION / DÉSACTIVATION DU MODE CUSTOM
  // --------------------------------------------------
  //
  // Cette fonction inverse simplement l'état actuel.
  //
  // false devient true
  // true devient false
  const handleCustomToggle = () => {
    setIsCustomActive(
      (currentCustomState) =>
        !currentCustomState,
    );
  };

  return (
    <section>
      {/* ------------------------------------------------
          TITRE DE LA SECTION
      ------------------------------------------------ */}
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        How long do you want to meditate?
      </p>

      {/* ------------------------------------------------
          AFFICHAGE CONDITIONNEL
      ------------------------------------------------

          Si isCustomActive vaut true :
          on affiche le picker horizontal.

          Sinon :
          on affiche les durées classiques.

          C'est un opérateur ternaire :
          condition ? valeurSiVrai : valeurSiFaux
      ------------------------------------------------ */}
      {isCustomActive ? (
        <div className="relative h-[60px] overflow-hidden">

          {/* --------------------------------------------
              CADRE DE SÉLECTION CENTRAL
          --------------------------------------------

              Ce cadre ne bouge pas.

              Les valeurs scrollent derrière lui.

              L'utilisateur comprend donc que
              la valeur placée au centre est sélectionnée.

              pointer-events-none empêche ce div
              de bloquer les interactions avec le picker.
          */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[60px] w-16 -translate-x-1/2 rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 shadow-astraya-selected" />

          {/* --------------------------------------------
              PICKER HORIZONTAL
          --------------------------------------------

              ref permet d'accéder à ce div
              avec customPickerRef.current.

              onScroll appelle handleCustomScroll
              à chaque mouvement horizontal.

              snap-x + snap-mandatory permettent
              au navigateur d'aligner les valeurs
              proprement pendant le scroll.
          */}
          <div
            ref={customPickerRef}
            onScroll={
              handleCustomScroll
            }
            className="flex h-[60px] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* ------------------------------------------
                ESPACE VIDE AU DÉBUT
            ------------------------------------------

                Ce bloc permet à la valeur "1"
                d'arriver réellement au centre du picker.

                Sans cet espace,
                la première valeur resterait collée à gauche.
            */}
            <div className="w-[calc(50%_-_2rem)] shrink-0" />

            {/* ------------------------------------------
                CRÉATION DES 120 DURÉES
            ------------------------------------------

                .map() parcourt le tableau
                [1, 2, 3, ..., 120]
                et crée un élément pour chaque valeur.
            */}
            {customDurations.map(
              (duration) => {
                // Vérifie si cette durée
                // est actuellement sélectionnée.
                const isSelected =
                  selectedDuration ===
                  duration;

                return (
                  <div
                    key={
                      duration
                    }
                    className="flex h-[60px] w-16 shrink-0 snap-center items-center justify-center"
                  >
                    {/* ----------------------------------
                        STYLE VISUEL DE LA VALEUR

                        La valeur sélectionnée :
                        - taille normale
                        - texte clair

                        Les autres :
                        - légèrement réduites
                        - beaucoup plus discrètes
                    ---------------------------------- */}
                    <div
                      className={`flex flex-col items-center transition-all duration-200 ${
                        isSelected
                          ? "scale-100 text-astraya-text"
                          : "scale-90 text-astraya-muted/35"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {
                          duration
                        }
                      </span>

                      <span className="mt-1 text-xs">
                        min
                      </span>
                    </div>
                  </div>
                );
              },
            )}

            {/* ------------------------------------------
                ESPACE VIDE À LA FIN
            ------------------------------------------

                Même principe qu'au début.

                Cela permet à 120 min
                d'arriver jusqu'au centre.
            */}
            <div className="w-[calc(50%_-_2rem)] shrink-0" />
          </div>

          {/* --------------------------------------------
              DÉGRADÉ À GAUCHE
          --------------------------------------------

              Sert uniquement à masquer progressivement
              les valeurs qui sortent du centre
              et à donner un effet de carousel.
          */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-astraya-background to-transparent" />

          {/* --------------------------------------------
              DÉGRADÉ À DROITE
          -------------------------------------------- */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-astraya-background to-transparent" />
        </div>
      ) : (
        // ------------------------------------------------
        // MODE DURÉES CLASSIQUES
        // ------------------------------------------------
        //
        // On crée 6 boutons à partir du tableau :
        // [5, 10, 15, 20, 30, 45]
        <div className="grid grid-cols-6 gap-2">
          {durations.map(
            (duration) => {
              const isSelected =
                selectedDuration ===
                duration;

              return (
                <button
                  key={
                    duration
                  }
                  type="button"

                  // Quand on clique sur une durée,
                  // on demande au composant parent
                  // de modifier selectedDuration.
                  onClick={() =>
                    onDurationChange(
                      duration,
                    )
                  }
                  className={`flex h-[60px] cursor-pointer flex-col items-center justify-center rounded-astraya-control border px-1 backdrop-blur-sm transition-all duration-300 ease-out ${
                    isSelected
                      ? "border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
                      : "border-astraya-border bg-astraya-surface/20 text-astraya-muted hover:bg-astraya-surface-soft/60 hover:text-astraya-text"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {
                      duration
                    }
                  </span>

                  <span className="mt-1 text-xs">
                    min
                  </span>
                </button>
              );
            },
          )}
        </div>
      )}

      {/* ------------------------------------------------
          BOUTON CUSTOM DURATION
      ------------------------------------------------

          Ce bouton permet d'activer
          ou désactiver le mode personnalisé.

          Son apparence change aussi
          selon isCustomActive.
      ------------------------------------------------ */}
      <button
        type="button"
        onClick={
          handleCustomToggle
        }
        className={`mt-3 flex w-full cursor-pointer items-center justify-between rounded-astraya-control border px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 ease-out ${
          isCustomActive
            ? "border-astraya-accent bg-astraya-accent/10 text-astraya-text shadow-astraya-selected"
            : "border-astraya-border bg-astraya-surface/20 text-astraya-muted hover:bg-astraya-surface-soft/60 hover:text-astraya-text"
        }`}
      >
        <span className="flex items-center gap-3">

          {/* Icône venant de lucide-react */}
          <Clock3
            size={18}
            strokeWidth={1.5}
          />

          <span>
            Custom duration
          </span>
        </span>

        {/* ------------------------------------------------
            TEXTE À DROITE DU BOUTON

            Mode custom actif :
            affiche la durée choisie.

            Mode custom inactif :
            affiche "Off".
        ------------------------------------------------ */}
        <span className="text-xs">
          {isCustomActive
            ? `${selectedDuration} min`
            : "Off"}
        </span>
      </button>
    </section>
  );
}

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
//
// Permet d'importer ce composant
// dans une autre partie de l'application.
//
// Par exemple :
//
// import DurationSelector from "...";
export default DurationSelector;