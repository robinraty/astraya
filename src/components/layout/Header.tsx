function Header() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center text-astraya-text">
      {/* Div pour le grid */}
      <div />

      <h1 className="font-astraya-brand text-[2rem] font-normal tracking-[0.03em] text-astraya-brand">
        Astraya
      </h1>

      <button
        type="button"
        aria-label="Open menu"
        className="justify-self-end rounded-full px-3 py-2 text-astraya-muted transition hover:bg-astraya-surface-soft hover:text-astraya-text"
      >
        •••
      </button>
    </header>
  );
}

export default Header;