import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";

import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { logoutUser } = useContext(AuthContext);
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const changeTheme = (newTheme) => {
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("mycircle-theme", newTheme);
    setTheme(newTheme);
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex min-h-16 items-center justify-between border-b border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-(--mycircle-text) shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:px-6">
      <div className="flex w-full min-h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-extrabold"
        >
          <img
            src={
              theme === "dark"
                ? "/mycircle-icon-dark.svg"
                : "/mycircle-icon-light.svg"
            }
            alt=""
            className="h-7 w-7"
          />

          <span>MyCircle</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 sm:flex">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-(--mycircle-primary)"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="text-sm font-medium transition-colors hover:text-(--mycircle-primary)"
          >
            Profile
          </Link>
          <Link
            to="/groups"
            className="text-sm font-medium transition-colors hover:text-(--mycircle-primary)"
          >
            Groups
          </Link>

          {/* Theme toggle */}
          <div className="flex items-center gap-1 rounded-full border border-(--mycircle-border) bg-(--mycircle-raised) p-1 transition-colors duration-200">
            <button
              type="button"
              onClick={() => changeTheme("light")}
              aria-label="Use light theme"
              aria-pressed={theme === "light"}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${
                theme === "light"
                  ? "bg-(--mycircle-surface) text-(--mycircle-primary)"
                  : "text-(--mycircle-muted)"
              }`}
            >
              <Sun size={15} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => changeTheme("dark")}
              aria-label="Use dark theme"
              aria-pressed={theme === "dark"}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${
                theme === "dark"
                  ? "bg-(--mycircle-surface) text-(--mycircle-primary)"
                  : "text-(--mycircle-muted)"
              }`}
            >
              <Moon size={15} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-sm font-medium transition-colors hover:text-(--mycircle-primary)"
          >
            Log out
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-(--mycircle-text) hover:bg-(--mycircle-raised) sm:hidden"
        >
          {isMenuOpen ? (
            <X size={24} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Menu size={24} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="border-t border-(--mycircle-border) bg-(--mycircle-surface) px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-(--mycircle-raised)"
            >
              Home
            </Link>

            <Link
              to="/profile"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-(--mycircle-raised)"
            >
              Profile
            </Link>

            <Link
              to="/groups"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-(--mycircle-raised)"
            >
              Groups
            </Link>

            <div className="my-2 border-t border-(--mycircle-border)" />

            {/* Mobile theme toggle */}

            <div className="flex items-center gap-1 rounded-full border border-(--mycircle-border) bg-(--mycircle-raised) p-1 transition-colors duration-200">
              <button
                type="button"
                onClick={() => changeTheme("light")}
                aria-label="Use light theme"
                aria-pressed={theme === "light"}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                  theme === "light"
                    ? "bg-(--mycircle-surface) text-(--mycircle-primary)"
                    : "text-(--mycircle-muted)"
                }`}
              >
                <Sun size={16} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => changeTheme("dark")}
                aria-label="Use dark theme"
                aria-pressed={theme === "dark"}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                  theme === "dark"
                    ? "bg-(--mycircle-surface) text-(--mycircle-primary)"
                    : "text-(--mycircle-muted)"
                }`}
              >
                <Moon size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="my-2 border-t border-(--mycircle-border)" />

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-(--mycircle-raised)"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
