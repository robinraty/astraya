import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";

import CreateMeditation from "./pages/CreateMeditation";
import MeditationSetup from "./pages/MeditationSetup";
import Library from "./pages/Library";

function App() {
  return (
          <div
            className="
              min-h-dvh bg-cover bg-center bg-no-repeat text-astraya-text
              bg-[linear-gradient(rgb(5_8_22/30%),rgb(5_8_22/42%)),url('/images/background-images/astraya-background-mobile.png')]
              md:bg-[linear-gradient(rgb(5_8_22/30%),rgb(5_8_22/42%)),url('/images/background-images/astraya-background-desktop.png')]
            "
          >
      {/* Contenu de l'app, sans background opaque */}
      <div className="mx-auto min-h-dvh w-full max-w-md px-4">
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