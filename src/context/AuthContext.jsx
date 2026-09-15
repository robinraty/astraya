import {
  createContext,
  useContext,
  useState,
} from "react";

// Ce Context permet de partager les informations
// d'authentification dans toute l'application.
//
// Sans Context, il faudrait passer le token
// de composant en composant avec des props.
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  // Récupère le token déjà présent dans sessionStorage.
  //
  // sessionStorage conserve les données
  // pendant la session actuelle du navigateur.
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("astrayaToken");
  });

  // Récupère aussi les informations utilisateur
  // si une session existe déjà.
  const [user, setUser] = useState(() => {
    const storedUser =
      sessionStorage.getItem("astrayaUser");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  // Appelé après un login réussi.
  //
  // On garde :
  // - le JWT
  // - les informations non sensibles du user
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);

    sessionStorage.setItem(
      "astrayaToken",
      newToken
    );

    sessionStorage.setItem(
      "astrayaUser",
      JSON.stringify(newUser)
    );
  };

  // Déconnecte l'utilisateur.
  //
  // Avec un JWT stateless, le logout côté frontend
  // consiste principalement à supprimer le token.
  const logout = () => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem("astrayaToken");
    sessionStorage.removeItem("astrayaUser");
  };

  // Pratique pour savoir rapidement
  // si un utilisateur est connecté.
  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Petit hook personnalisé.
//
// Au lieu d'écrire useContext(AuthContext)
// partout, on pourra simplement écrire useAuth().
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}

export {
  AuthProvider,
  useAuth,
};