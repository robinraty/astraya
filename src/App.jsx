// --------------------------------------------------
// IMPORTS DE REACT ROUTER
// --------------------------------------------------
//
// react-router-dom est la bibliothèque utilisée pour gérer
// la navigation entre les différentes pages de l'application.
//
// Navigate : permet de rediriger automatiquement l'utilisateur
// vers une autre route.
//
// Route : associe une URL à un composant React.
//
// Routes : contient l'ensemble des Route de l'application.
//
// useLocation : permet de connaître l'URL actuellement affichée.

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";


// --------------------------------------------------
// IMPORTS DES COMPOSANTS DE LAYOUT
// --------------------------------------------------
//
// Ces composants sont affichés sur plusieurs pages.
// Le Header est en haut de l'application.
// BottomNavigation est la barre de navigation située en bas.

import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";


// --------------------------------------------------
// IMPORTS DES PAGES
// --------------------------------------------------
//
// Chaque fichier importé ici représente une grande page
// de l'application.
//
// App.jsx décidera quelle page afficher en fonction de l'URL.

import CreateMeditation from "./pages/CreateMeditation";
import MeditationSetup from "./pages/MeditationSetup";
import Library from "./pages/MyCreations";
import MeditationSession from "./pages/MeditationSession";
import Login from "./pages/Login";
import Register from "./pages/Register";


// --------------------------------------------------
// COMPOSANT PRINCIPAL DE L'APPLICATION
// --------------------------------------------------
//
// App est le composant qui organise la structure générale
// du frontend.
//
// Son rôle principal est:
// 1. savoir sur quelle URL se trouve l'utilisateur
// 2. afficher la bonne page
// 3. afficher ou masquer le Header et la navigation du bas

function App() {
  // useLocation est un hook fourni par React Router.
  //
  // Un hook est une fonction spéciale utilisée dans un composant React.
  //
  // Ici, useLocation récupère des informations sur l'URL actuelle.
  // Par exemple:
  // /meditate
  // /create
  // /library
  // /session
  const location = useLocation();


  // location.pathname contient uniquement le chemin de l'URL.
  //
  // Exemple:
  // si l'utilisateur est sur:
  // http://localhost:5173/session
  //
  // alors:
  // location.pathname vaut "/session"
  //
  // On crée ici une variable booléenne.
  // Elle vaut true si on est sur /session,
  // sinon elle vaut false.
  const isMeditationSession =
    location.pathname === "/session";


  // La page de session est particulière.
  //
  // Pendant une méditation, on veut afficher uniquement
  // le lecteur de session en plein écran.
  //
  // On ne veut donc pas afficher:
  // - le Header
  // - la navigation du bas
  //
  // Si isMeditationSession vaut true,
  // la fonction App s'arrête ici grâce au return.
  //
  // Tout le code situé plus bas ne sera donc pas affiché.
  if (isMeditationSession) {
    return (
      <Routes>
        {/* Si l'URL est /session,
            React Router affiche le composant MeditationSession */}
        <Route
          path="/session"
          element={<MeditationSession />}
        />
      </Routes>
    );
  }


  // Si on n'est PAS sur /session,
  // on affiche la structure normale de l'application.
  return (
    <div className="relative min-h-dvh overflow-hidden bg-astraya-background text-astraya-text">

      {/* --------------------------------------------------
          FOND VISUEL
          --------------------------------------------------

          Ce bloc sert uniquement au design.

          Il ajoute deux gradients radiaux dans le fond
          pour donner l'ambiance bleue et nocturne d'Astraya.

          pointer-events-none empêche ce fond de bloquer
          les clics sur les éléments placés au-dessus.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 25% 30%,
              rgb(67 97 190 / 14%) 0%,
              rgb(67 97 190 / 6%) 24%,
              transparent 52%
            ),
            radial-gradient(
              circle at 78% 72%,
              rgb(98 72 190 / 12%) 0%,
              rgb(98 72 190 / 5%) 26%,
              transparent 55%
            )
          `,
        }}
      />


      {/* --------------------------------------------------
          CONTENEUR PRINCIPAL
          --------------------------------------------------

          Cette zone contient le Header et les pages.

          max-w-md limite la largeur maximale.

          Cela permet de garder une apparence mobile-first
          même lorsque l'application est ouverte sur ordinateur.
      */}
      <div className="relative mx-auto min-h-dvh w-full max-w-md px-4">

        {/* Header commun aux pages normales */}
        <header className="pb-2 pt-5">
          <Header />
        </header>


        <main className="pb-24">

          {/* --------------------------------------------------
              ROUTES DE L'APPLICATION
              --------------------------------------------------

              Routes contient toutes les routes possibles.

              Une Route fonctionne comme une règle:

              "si l'URL est X,
              affiche le composant Y"
          */}
          <Routes>

            {/* ------------------------------------------------
                ROUTE "/"
                ------------------------------------------------

                Si l'utilisateur arrive simplement sur "/",
                aucune vraie page n'est affichée ici.

                Navigate redirige automatiquement
                l'utilisateur vers /meditate.

                replace remplace l'entrée actuelle
                dans l'historique du navigateur.
            */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/meditate"
                  replace
                />
              }
            />


            {/* ------------------------------------------------
                ROUTE "/meditate"
                ------------------------------------------------

                Affiche la page MeditationSetup.

                Cette page sert à choisir une méditation
                et sa durée avant de lancer une session.
            */}
            <Route
              path="/meditate"
              element={<MeditationSetup />}
            />


            {/* ------------------------------------------------
                ROUTE "/create"
                ------------------------------------------------

                Affiche la page CreateMeditation.

                Cette page permet de créer
                une configuration audio personnalisée.
            */}
            <Route
              path="/create"
              element={<CreateMeditation />}
            />


            {/* ------------------------------------------------
                ROUTE "/library"
                ------------------------------------------------

                Affiche les créations sauvegardées
                de l'utilisateur.

                Le fichier réel s'appelle MyCreations.jsx,
                mais on l'importe ici sous le nom Library.
            */}
            <Route
              path="/library"
              element={<Library />}
            />


            {/* ------------------------------------------------
                ROUTES D'AUTHENTIFICATION
                ------------------------------------------------

                /login affiche la page de connexion.

                /register affiche la page
                de création de compte.
            */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />
          </Routes>
        </main>
      </div>


      {/* --------------------------------------------------
          NAVIGATION DU BAS
          --------------------------------------------------

          Cette barre permet de naviguer entre les pages
          principales de l'application.

          Elle est placée ici en dehors des Routes
          car elle doit rester visible sur plusieurs pages.

          Elle n'apparaît pas sur /session,
          car dans ce cas App a déjà fait un return plus haut.
      */}
      <BottomNavigation />
    </div>
  );
}


// --------------------------------------------------
// EXPORT
// --------------------------------------------------
//
// export default permet à ce composant d'être importé
// dans un autre fichier.
//
// Dans Astraya, App sera ensuite utilisé par main.jsx
// pour lancer l'application React.

export default App;