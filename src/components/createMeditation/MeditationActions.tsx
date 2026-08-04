import { Play, Share2, Save } from "lucide-react";

function MeditationActions() {
    return (
        <section className="flex items-end justify-between px-6 pb-8 pt-3">
        <button
        type="button"
        className="group flex w-16 flex-col items-center gap-2 text-astraya-muted transition hover:text-astraya-text"
        >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-astraya-border bg-astraya-surface/40 transition group-hover:border-astraya-accent">
        <Share2 size={18} />
        </span>
        
        <span className="text-xs">Share</span>
        </button>
        
        <button
        type="button"
        aria-label="Play meditation"
        className="flex h-20 w-20 items-center justify-center rounded-full border border-astraya-accent bg-astraya-surface-soft shadow-astraya-glow transition hover:scale-105"
        >
        <Play
        size={32}
        fill="currentColor"
        className="ml-1 text-astraya-text"
        />
        </button>
        
        <button
        type="button"
        className="group flex w-16 flex-col items-center gap-2 text-astraya-muted transition hover:text-astraya-text"
        >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-astraya-border bg-astraya-surface/40 transition group-hover:border-astraya-accent">
        <Save size={18} />
        </span>
        
        <span className="text-xs">Save</span>
        </button>
        </section>
    );
}

export default MeditationActions;