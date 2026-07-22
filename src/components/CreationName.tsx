function CreationName() {
    return (
        <section className="rounded-astraya-card border border-astraya-border bg-astraya-surface/70 p-6 shadow-astraya-card">
        <p className="text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Creation name
        </p>
        
        <div className="mt-3 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-medium text-astraya-text">
        Moon Lake
        </h2>
        
        <button
        type="button"
        aria-label="Edit creation name"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-astraya-border text-astraya-muted transition hover:border-astraya-accent hover:bg-astraya-accent/10 hover:text-astraya-text"
        >
        ✎
        </button>
        </div>
        </section>
    );
}

export default CreationName;