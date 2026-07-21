function CreationName() {
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Creation name
            </p>
            
            <div className="mt-3 flex items-center justify-between gap-4">
                <h2 className="text-3xl font-medium text-white">
                Moon Lake
                </h2>
                
                <button
                type="button"
                aria-label="Edit creation name"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300"
                >
                ✎
                </button>
            </div>
        </section>
    );
}

export default CreationName;