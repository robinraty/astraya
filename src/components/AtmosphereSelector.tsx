function AtmosphereSelector() {
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
            
            <div className="flex items-center justify-between gap-4">
            <div>

            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
            Atmosphere
            </p>
            
            <p className="mt-2 text-sm text-slate-400">
            Choose the foundation of your sound
            </p>

            </div>
                <button
                type="button"
                aria-label="Toggle atmosphere"
                className="flex h-7 w-12 items-center justify-end rounded-full border border-blue-400 bg-blue-500/20 p-1"
                >
                <span className="h-5 w-5 rounded-full bg-white" />
                </button>
                </div>
                
                <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-700">
                <button
                type="button"
                className="border-r border-slate-700 px-4 py-4 text-slate-400"
                >
                Deep
                </button>
                
                <button
                type="button"
                className="bg-blue-500/10 px-4 py-4 text-white"
                >
                Airy
                </button>
            </div>

        </section>
    );
}

export default AtmosphereSelector;