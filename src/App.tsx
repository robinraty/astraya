import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";
import CreateMeditation from "./pages/CreateMeditation";

function App() {
  return (
    <div className="min-h-dvh bg-astraya-background text-astraya-text">
      <div className="mx-auto min-h-dvh w-full max-w-md px-4">
        <header className="pt-5 pb-2">
          <Header />
        </header>

        <main className="pb-24">
          <CreateMeditation />
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default App;