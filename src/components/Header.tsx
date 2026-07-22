function Header() {
  return (
    <header className="flex items-center justify-between text-astraya-text">
    <div />
    
    <h1 className="text-2xl font-semibold tracking-wide">
    Astraya
    </h1>
    
    <button
    type="button"
    aria-label="Open menu"
    className="rounded-full px-3 py-2 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
    >
    •••
    </button>
    </header>
  );
}

export default Header;