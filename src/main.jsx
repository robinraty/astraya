import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import {
  AuthProvider,
} from "./context/AuthContext";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
    >
      {/* AuthProvider englobe toute l'application.
          Tous les composants peuvent maintenant
          accéder à l'utilisateur et au JWT. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);