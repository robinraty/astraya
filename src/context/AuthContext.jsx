import {
  createContext,
  useContext,
  useState,
} from "react";


// ==================================================
// CONTEXTE D'AUTHENTIFICATION
// ==================================================
//
// AuthContext permet de partager les informations
// d'authentification avec toute l'application.
//
// Le JWT est créé par le BACKEND au moment du login.
// Ce fichier ne crée donc PAS le JWT.
//
// Son rôle est de recevoir le JWT, de le conserver,
// puis de le rendre accessible aux autres composants.

const AuthContext = createContext(null);


function AuthProvider({ children }) {

  // ==================================================
  // TOKEN JWT
  // ==================================================
  //
  // Le token a été créé par le backend avec jwt.sign()
  // après une connexion réussie.
  //
  // Côté frontend, je le conserve dans un state React.
  //
  // Au chargement de l'application, je regarde également
  // dans sessionStorage pour récupérer un éventuel token
  // déjà enregistré lors de la connexion.

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("astrayaToken");
  });


  // ==================================================
  // UTILISATEUR CONNECTÉ
  // ==================================================
  //
  // Je conserve également les informations
  // de l'utilisateur connecté dans un state.
  //
  // Comme pour le token, je peux les récupérer
  // depuis sessionStorage après un refresh.

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


  // ==================================================
  // LOGIN
  // ==================================================
  //
  // Cette fonction est appelée après un login réussi.
  //
  // Le backend a déjà vérifié le mot de passe,
  // créé le JWT et l'a renvoyé au frontend.
  //
  // Ici, le frontend reçoit ce JWT dans newToken.
  //
  // Je le stocke dans le state avec setToken(),
  // mais également dans sessionStorage pour pouvoir
  // le récupérer si l'utilisateur rafraîchit la page.

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


  // ==================================================
  // LOGOUT
  // ==================================================
  //
  // Lors de la déconnexion, je supprime le token
  // et les informations utilisateur du state
  // ainsi que de sessionStorage.

  const logout = () => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem("astrayaToken");
    sessionStorage.removeItem("astrayaUser");
  };


  // ==================================================
  // UTILISATEUR CONNECTÉ OU NON
  // ==================================================
  //
  // Si un token est présent côté frontend,
  // isAuthenticated vaut true.
  //
  // Attention : cela vérifie seulement sa présence.
  // La VALIDITÉ du JWT est vérifiée par le backend
  // avec jwt.verify() lors des requêtes protégées.

  const isAuthenticated = Boolean(token);


  // ==================================================
  // PARTAGE DES DONNÉES D'AUTHENTIFICATION
  // ==================================================
  //
  // Le Provider rend le token et les autres informations
  // accessibles aux composants de l'application.
  //
  // C'est grâce à cela que CreateMeditation peut faire :
  //
  // const { token } = useAuth();
  //
  // puis renvoyer ce JWT au backend dans le header
  // Authorization lors d'une requête protégée.

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


// ==================================================
// HOOK useAuth
// ==================================================
//
// useAuth() est simplement un moyen pratique
// pour les composants d'accéder à AuthContext.
//
// Par exemple, CreateMeditation utilise useAuth()
// pour récupérer le JWT conservé ici.

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