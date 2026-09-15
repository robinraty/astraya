import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // Données du formulaire.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Etat de la requête.
  const [isLoading, setIsLoading] = useState(false);

  // Message d'erreur éventuel.
  const [errorMessage, setErrorMessage] =
    useState("");

  // Envoie le nouveau compte à Express.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      // Appelle POST /register.
      const response = await fetch(
        "http://localhost:3000/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create the account."
        );
      }

      // Une fois le compte créé,
      // l'utilisateur est envoyé vers Login.
      navigate("/login");
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
            Create account
          </h1>

          <p className="mt-1 text-sm text-astraya-muted">
            Save and replay your personal soundscapes.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Nom */}
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-astraya-muted">
              Name
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              autoComplete="name"
              className="rounded-astraya-control border border-astraya-border bg-astraya-surface/60 px-4 py-3 text-astraya-text outline-none transition focus:border-astraya-accent"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-astraya-muted">
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
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
                setPassword(event.target.value)
              }
              minLength={8}
              required
              autoComplete="new-password"
              className="rounded-astraya-control border border-astraya-border bg-astraya-surface/60 px-4 py-3 text-astraya-text outline-none transition focus:border-astraya-accent"
            />
          </label>

          <p className="text-xs text-astraya-muted">
            Minimum 8 characters.
          </p>

          {/* Erreur */}
          {errorMessage && (
            <p className="text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          {/* Création du compte */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 cursor-pointer rounded-astraya-control border border-astraya-accent bg-astraya-accent/10 px-4 py-3 text-sm font-medium text-astraya-text transition hover:bg-astraya-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;