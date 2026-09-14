import { Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/auth.context";

function OnlyPrivate({ children }) {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default OnlyPrivate;