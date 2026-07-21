import Header from "./components/Header";
import CreationName from "./components/CreationName";
import DurationSelector from "./components/DurationSelector";
import PitchSelector from "./components/PitchSelector";
import AtmosphereSelector from "./components/AtmosphereSelector";

function App() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
            <Header />
            <CreationName />
            <DurationSelector />
            <PitchSelector />
            <AtmosphereSelector />
        </div>
        </main>
    );
}

export default App;