import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { AuthWrapper } from "./context/auth.context";

const storedTheme = localStorage.getItem("mycircle-theme");
document.documentElement.dataset.theme =
  storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>,
);
