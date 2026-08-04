function PitchSelector() {
    return (
        <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-astraya-muted">
        Pitch / Mood
        </p>
        
        <div className="grid grid-cols-3 overflow-hidden rounded-astraya-control border border-astraya-border">
        <button
        type="button"
        className="border-r border-astraya-border bg-astraya-accent/10 px-4 py-4 text-astraya-text"
        >
        Deep
        </button>
        
        <button
        type="button"
        className="border-r border-astraya-border px-4 py-4 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
        >
        Natural
        </button>
        
        <button
        type="button"
        className="px-4 py-4 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
        >
        Bright
        </button>
        </div>
        </section>
    );
}

export default PitchSelector;