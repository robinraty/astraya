function PitchSelector() {
    return (
        <section>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            Pitch / Mood
            </p>
            
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-700">
                <button
                type="button"
                className="border-r border-slate-700 bg-blue-500/10 px-4 py-4 text-white"
                >
                Deep
                </button>
                
                <button
                type="button"
                className="border-r border-slate-700 px-4 py-4 text-slate-400"
                >
                Natural
                </button>
                
                <button
                type="button"
                className="px-4 py-4 text-slate-400"
                >
                Bright
                </button>
            </div>
        </section>
    );
}

export default PitchSelector;