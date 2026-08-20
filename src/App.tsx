import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";

import CreateMeditation from "./pages/CreateMeditation";
import MeditationSetup from "./pages/MeditationSetup";
import Library from "./pages/Library";

function App() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="relative min-h-dvh bg-astraya-background text-astraya-text">
      {/* Background mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: `linear-gradient(rgb(5 8 22 / 30%), rgb(5 8 22 / 42%)), url("${baseUrl}images/background-images/astraya-background-mobile.png")`,
        }}
      />

      {/* Background desktop */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{
          backgroundImage: `linear-gradient(rgb(5 8 22 / 30%), rgb(5 8 22 / 42%)), url("${baseUrl}images/background-images/astraya-background-desktop.png")`,
        }}
      />

      {/* Contenu de l'app au-dessus du background */}
      <div className="relative mx-auto min-h-dvh w-full max-w-md px-4">
        <header className="pt-5 pb-2">
          <Header />
        </header>

        <main className="pb-24">
          <Routes>
            <Route path="/" element={<Navigate to="/meditate" replace />} />
            <Route path="/meditate" element={<MeditationSetup />} />
            <Route path="/create" element={<CreateMeditation />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default App;