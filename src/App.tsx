import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";

import CreateMeditation from "./pages/CreateMeditation";
import MeditationSetup from "./pages/MeditationSetup";
import Library from "./pages/Library";
import MeditationSession from "./pages/MeditationSession";

function App() {
  const location = useLocation();

  const isMeditationSession =
    location.pathname === "/session";

  if (isMeditationSession) {
    return (
      <Routes>
        <Route
          path="/session"
          element={<MeditationSession />}
        />
      </Routes>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-astraya-background text-astraya-text">
      {/* Background atmosphérique léger */}
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

      {/* Contenu de l'app */}
      <div className="relative mx-auto min-h-dvh w-full max-w-md px-4">
        <header className="pt-5 pb-2">
          <Header />
        </header>

        <main className="pb-24">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/meditate" replace />}
            />

            <Route
              path="/meditate"
              element={<MeditationSetup />}
            />

            <Route
              path="/create"
              element={<CreateMeditation />}
            />

            <Route
              path="/library"
              element={<Library />}
            />
          </Routes>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default App;