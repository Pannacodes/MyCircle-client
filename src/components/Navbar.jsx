import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { loggedUsername, logoutUser } = useContext(AuthContext);
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const initials = loggedUsername
    ? loggedUsername.slice(0, 2).toUpperCase()
    : "MC";

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, []);

  const changeTheme = (newTheme) => {
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("mycircle-theme", newTheme);
    setTheme(newTheme);
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive
        ? "text-(--mycircle-primary)"
        : "text-(--mycircle-muted) hover:text-(--mycircle-text)"
    }`;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-(--mycircle-border) bg-(--mycircle-surface) text-(--mycircle-text) shadow-[0_1px_3px_rgba(46,42,38,0.06)]">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 font-extrabold tracking-[-0.02em]"
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
        <div className="hidden items-center gap-6 sm:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/groups" className={navLinkClass}>
            My groups
          </NavLink>

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

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex cursor-pointer items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-(--mycircle-raised)"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--mycircle-secondary-tint) text-xs font-bold text-(--mycircle-secondary)">
                {initials}
              </span>
              <ChevronDown size={15} aria-hidden="true" />
            </button>

            {isProfileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-12 w-52 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-2 shadow-[0_8px_24px_rgba(46,42,38,0.12)]"
              >
                <p className="px-3 py-2 text-xs text-(--mycircle-muted)">
                  Signed in as <strong className="text-(--mycircle-text)">{loggedUsername || "member"}</strong>
                </p>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-(--mycircle-raised)"
                >
                  <UserRound size={16} aria-hidden="true" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-semibold text-(--mycircle-error) hover:bg-(--mycircle-raised)"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
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
              to="/groups"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-(--mycircle-raised)"
            >
              My groups
            </Link>

            <div className="my-2 border-t border-(--mycircle-border)" />

            {/* Mobile theme toggle */}

            <div className="flex w-fit self-start items-center gap-1 rounded-full border border-(--mycircle-border) bg-(--mycircle-raised) p-1 transition-colors duration-200">
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

            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-(--mycircle-text) hover:bg-(--mycircle-raised)"
            >
              <UserRound size={17} strokeWidth={1.8} aria-hidden="true" />
              Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-(--mycircle-error) hover:bg-(--mycircle-raised)"
            >
              <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
