import { Headphones, SlidersHorizontal, Moon } from "lucide-react";
import { NavLink } from "react-router-dom";

function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-astraya-border bg-astraya-background">
      <div className="mx-auto flex w-full max-w-sm items-center justify-between px-4 py-3">
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

        <NavLink
          to="/library"
          className={({ isActive }) =>
            isActive
              ? "flex flex-col items-center gap-1 text-astraya-accent"
              : "flex flex-col items-center gap-1 text-astraya-muted"
          }
        >
          <Headphones size={20} />
          <span className="text-sm">My Creations</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default BottomNavigation;