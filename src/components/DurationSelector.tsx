function DurationSelector() {
    return (
        <section>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            Duration
            </p>
            
            <div className="grid grid-cols-3 gap-3">
                <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-3 text-slate-400"
                >
                5 min
                </button>
                
                <button
                type="button"
                className="rounded-full border border-blue-400 bg-blue-500/10 px-4 py-3 text-white"
                >
                10 min
                </button>
                
                <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-3 text-slate-400"
                >
                30 min
                </button>
            </div>
        </section>
    );
}

export default DurationSelector;