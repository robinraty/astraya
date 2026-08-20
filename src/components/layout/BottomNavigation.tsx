import { Headphones, SlidersHorizontal, Moon } from "lucide-react";
import { NavLink } from "react-router-dom";

function BottomNavigation() {
  return (
    // Navigation fixe en bas de l'écran
    <nav className="fixed bottom-0 left-0 right-0 border-t border-astraya-border bg-astraya-background">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
        {/* NavLink navigue vers une route et sait si elle est active */}
        <NavLink
          to="/meditate"
          className={({ isActive }) =>
            isActive
              ? "flex flex-col items-center gap-1 text-astraya-accent"
              : "flex flex-col items-center gap-1 text-astraya-muted"
          }
        >
          <Moon size={20} />
          <span className="text-sm">Meditate</span>
        </NavLink>

        {/* isActive vaut true quand l'URL actuelle est /create */}
        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive
              ? "flex flex-col items-center gap-1 text-astraya-accent"
              : "flex flex-col items-center gap-1 text-astraya-muted"
          }
        >
          <SlidersHorizontal size={20} />
          <span className="text-sm">Create</span>
        </NavLink>

        {/* Même logique pour la page Library */}
        <NavLink
          to="/library"
          className={({ isActive }) =>
            isActive
              ? "flex flex-col items-center gap-1 text-astraya-accent"
              : "flex flex-col items-center gap-1 text-astraya-muted"
          }
        >
          <Headphones size={20} />
          <span className="text-sm">Library</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default BottomNavigation;