import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { logoutUser } = useContext(AuthContext);
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );
  const navigate = useNavigate();

  const changeTheme = (newTheme) => {
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("mycircle-theme", newTheme);
    setTheme(newTheme);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex min-h-16 items-center justify-between border-b border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-(--mycircle-text) shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:px-6">
      <Link to="/" className="font-extrabold">
        MyCircle
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/groups">Groups</Link>

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
          className="cursor-pointer"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
