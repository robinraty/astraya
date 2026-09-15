import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();

  // Récupère les informations
  // de connexion depuis AuthContext.
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  // Indique si le menu est ouvert.
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  // Référence vers le menu.
  const menuRef = useRef(null);

  // Ferme le menu si on clique ailleurs.
  useEffect(() => {
    const handleOutsideClick = (event) => {
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

  // Ouvre Login.
  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  // Ouvre Register.
  const handleRegister = () => {
    setIsMenuOpen(false);
    navigate("/register");
  };

  // Déconnecte l'utilisateur.
  const handleLogout = () => {
    logout();

    setIsMenuOpen(false);

    navigate("/meditate");
  };

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center text-astraya-text">
      <div />

      {/* Nom Astraya */}
      <div className="relative translate-x-1">
        <h1 className="font-astraya-brand text-[1.65rem] font-normal tracking-[0.03em] text-astraya-brand">
          Astraya
        </h1>
      </div>

      {/* Menu utilisateur */}
      <div
        ref={menuRef}
        className="relative justify-self-end"
      >
        <button
          type="button"
          onClick={() =>
            setIsMenuOpen(
              !isMenuOpen
            )
          }
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          className="rounded-full px-3 py-2 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
        >
          •••
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-astraya-control border border-astraya-border bg-astraya-surface shadow-astraya-card backdrop-blur-sm">
            {isAuthenticated ? (
              <>
                {/* Information utilisateur */}
                <div className="border-b border-astraya-border px-4 py-3">
                  <p className="text-xs text-astraya-muted">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-sm text-astraya-text">
                    {user?.name}
                  </p>
                </div>

                {/* Déconnexion */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full cursor-pointer px-4 py-3 text-left text-sm text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                {/* Connexion */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full cursor-pointer px-4 py-3 text-left text-sm text-astraya-text transition hover:bg-astraya-surface-soft"
                >
                  Log in
                </button>

                {/* Création de compte */}
                <button
                  type="button"
                  onClick={
                    handleRegister
                  }
                  className="w-full cursor-pointer border-t border-astraya-border px-4 py-3 text-left text-sm text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
                >
                  Create account
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;