import { useState } from "react";
import { Moon, Sun } from "lucide-react";

function AuthLayout({ children }) {
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );

  const changeTheme = (newTheme) => {
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("mycircle-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <div
      data-theme={theme}
      className="flex min-h-dvh flex-col overflow-x-hidden bg-(--mycircle-background) text-(--mycircle-text) transition-colors duration-200"
    >
      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-8">
        {/* MyCircle logo */}
        <div className="flex items-center gap-2.5 text-[17px] font-extrabold">
          <img
            src={
              theme === "light"
                ? "/mycircle-icon-light.svg"
                : "/mycircle-icon-dark.svg"
            }
            alt="MyCircle"
            className="h-8 w-8"
          />

          <span>MyCircle</span>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-1 rounded-full border border-(--mycircle-border) bg-(--mycircle-surface) p-1">
          <button
            type="button"
            onClick={() => changeTheme("light")}
            aria-label="Use light theme"
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${
              theme === "light"
                ? "bg-(--mycircle-raised) text-(--mycircle-primary)"
                : "text-(--mycircle-muted)"
            }`}
          >
            <Sun size={15} />
          </button>

          <button
            type="button"
            onClick={() => changeTheme("dark")}
            aria-label="Use dark theme"
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${
              theme === "dark"
                ? "bg-(--mycircle-raised) text-(--mycircle-primary)"
                : "text-(--mycircle-muted)"
            }`}
          >
            <Moon size={15} />
          </button>
        </div>
      </header>
      {/* Auth card area */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16 pt-5">
        <div className="w-full max-w-100 rounded-[20px] border border-(--mycircle-border) bg-(--mycircle-surface) px-8 pb-7.5 pt-9 shadow-[0_10px_24px_rgba(46,42,38,0.10),0_2px_8px_rgba(46,42,38,0.06)]">
          {/* Logo inside card */}
          <div className="mb-4.5 flex justify-center">
            <img
              src={
                theme === "light"
                  ? "/mycircle-icon-light.svg"
                  : "/mycircle-icon-dark.svg"
              }
              alt="MyCircle"
              className="h-16 w-16"
            />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
