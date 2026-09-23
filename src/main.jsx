// --------------------------------------------------
// IMPORTS REACT
// --------------------------------------------------
//
// StrictMode est un outil de React utilisé surtout pendant
// le développement.
//
// Il aide à repérer certains problèmes potentiels dans les composants.
//
// Il n'ajoute pas directement de fonctionnalité visible pour l'utilisateur.

import { StrictMode } from "react";


// --------------------------------------------------
// CONNEXION ENTRE REACT ET LA PAGE HTML
// --------------------------------------------------
//
// createRoot permet à React de prendre le contrôle
// d'un élément HTML précis dans la page.
//
// Ici, React va utiliser l'élément HTML qui possède l'id "root".
//
// Cet élément se trouve normalement dans index.html.

import { createRoot } from "react-dom/client";


// --------------------------------------------------
// ROUTING
// --------------------------------------------------
//
// BrowserRouter active React Router pour toute l'application.
//
// Grâce à lui, App.jsx peut ensuite utiliser des éléments comme:
// - Routes
// - Route
// - Navigate
// - useLocation
//
// Sans BrowserRouter autour de l'application,
// le routing utilisé dans App.jsx ne fonctionnerait pas.

import { BrowserRouter } from "react-router-dom";


// --------------------------------------------------
// STYLE GLOBAL
// --------------------------------------------------
//
// index.css contient les styles globaux de l'application.
//
// C'est notamment là que sont définis:
// - Tailwind CSS
// - les couleurs Astraya
// - certaines variables du design system

import "./index.css";


// --------------------------------------------------
// COMPOSANT PRINCIPAL
// --------------------------------------------------
//
// App est le composant principal du frontend.
//
// Il contient notamment la structure générale
// et les routes de l'application.

import App from "./App";


// --------------------------------------------------
// AUTHENTIFICATION GLOBALE
// --------------------------------------------------
//
// AuthProvider vient du fichier AuthContext.jsx.
//
// Un Provider permet de rendre certaines données accessibles
// à plusieurs composants sans devoir les transmettre manuellement
// de composant en composant avec des props.
//
// Dans Astraya, AuthProvider sert à partager les informations
// liées à l'authentification, par exemple l'utilisateur connecté
// et le token JWT.

import {
  AuthProvider,
} from "./context/AuthContext";


// --------------------------------------------------
// POINT DE DÉPART DE L'APPLICATION REACT
// --------------------------------------------------
//
// document.getElementById("root") cherche dans la page HTML
// l'élément qui possède l'id "root".
//
// createRoot(...) dit ensuite à React:
// "c'est dans cet élément HTML que tu vas afficher l'application".

createRoot(
  document.getElementById("root")
).render(

  // ------------------------------------------------
  // STRICT MODE
  // ------------------------------------------------
  //
  // StrictMode entoure l'application pendant le développement
  // pour aider à détecter certains problèmes.
  //
  // Ce n'est pas un composant visuel.
  <StrictMode>

    {/* ------------------------------------------------
        BROWSER ROUTER
        ------------------------------------------------

        BrowserRouter donne accès au système de routing
        à toute l'application située à l'intérieur.

        basename indique le chemin de base utilisé par l'application.

        Ici on utilise import.meta.env.BASE_URL
        afin que le routing fonctionne correctement
        avec le chemin utilisé lors du déploiement,
        notamment sur GitHub Pages.
    */}
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
    >

      {/* ------------------------------------------------
          AUTH PROVIDER
          ------------------------------------------------

          AuthProvider englobe App.

          Cela permet aux composants situés dans App
          et dans ses enfants d'accéder aux données
          liées à l'authentification via AuthContext.

          Par exemple:
          - l'utilisateur connecté
          - le token JWT
          - les fonctions liées au login/logout
      */}
      <AuthProvider>

        {/* App contient ensuite le reste de l'application */}
        <App />

      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);