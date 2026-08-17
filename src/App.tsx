import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";
import CreateMeditation from "./pages/CreateMeditation";

function App() {
  return (
    <div className="min-h-screen bg-astraya-background text-astraya-text">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4">
        <header className="py-8">
          <Header />
        </header>

        <main className="flex-1 pb-24">
          <CreateMeditation />
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default App;