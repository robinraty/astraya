function Header() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center text-astraya-text">
      <div />

      <div className="relative translate-x-1">
        {/* LOGO Astraya en absolute pour que typo soit centered */}
        <img
          src="/logo-astraya.png"
          alt=""
          className="absolute right-full top-1/2 mr-1.5 h-9 w-auto -translate-y-1/2"
        />

        {/* TYPO Astraya */}
        <h1 className="font-astraya-brand text-[1.65rem] font-normal tracking-[0.03em] text-astraya-brand">
          Astraya
        </h1>
      </div>

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