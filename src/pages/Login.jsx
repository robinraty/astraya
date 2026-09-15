import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  // Permet de changer de page après le login.
  const navigate = useNavigate();

  // Récupère la fonction login du AuthContext.
  //
  // Elle permettra de garder le JWT
  // après une connexion réussie.
  const { login } = useAuth();

  // Valeurs saisies dans le formulaire.
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  // Etat de la requête.
  const [isLoading, setIsLoading] =
    useState(false);

  // Message affiché si le login échoue.
  const [errorMessage, setErrorMessage] =
    useState("");

  // Envoie le formulaire au backend.
  const handleSubmit = async (event) => {
    // Empêche le navigateur
    // de recharger complètement la page.
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      // Appelle notre route Express POST /login.
      const response = await fetch(
        "http://localhost:3000/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          // Transforme les données JavaScript
          // en JSON pour la requête HTTP.
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Transforme la réponse JSON
      // en objet JavaScript.
      const data = await response.json();

      // Si Express refuse le login,
      // on affiche le message d'erreur.
      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to log in."
        );
      }

      // Sauvegarde le JWT et le user
      // dans notre AuthContext.
      //
      // Ils seront ensuite accessibles
      // depuis Create, Library, Header, etc.
      login(
        data.token,
        data.user
      );

      // Retour vers Meditate.
      navigate("/meditate");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-2 py-8 text-astraya-text">
      <div className="mx-auto w-full max-w-md">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
            Account
          </p>

          <h1 className="mt-2 text-2xl font-medium text-astraya-text">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-astraya-muted">
            Log in to access your saved meditations.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Email */}
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-astraya-muted">
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
              autoComplete="email"
              className="rounded-astraya-control border border-astraya-border bg-astraya-surface/60 px-4 py-3 text-astraya-text outline-none transition focus:border-astraya-accent"
            />
          </label>

          {/* Mot de passe */}
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-astraya-muted">
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
              autoComplete="current-password"
              className="rounded-astraya-control border border-astraya-border bg-astraya-surface/60 px-4 py-3 text-astraya-text outline-none transition focus:border-astraya-accent"
            />
          </label>

          {/* Erreur éventuelle */}
          {errorMessage && (
            <p className="text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 cursor-pointer rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 px-4 py-3 text-sm font-medium text-astraya-text transition hover:bg-astraya-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Logging in..."
              : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;