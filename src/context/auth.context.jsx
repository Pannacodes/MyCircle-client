import { createContext, useEffect, useState } from "react";
import service from "../services/index.services";

const AuthContext = createContext();

function AuthWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [loggedUsername, setLoggedUsername] = useState(null);
  const [loggedUserEmail, setLoggedUserEmail] = useState(null);
  const [isVerifyingUser, setIsVerifyingUser] = useState(true);

  const verifyUser = async () => {
    try {
      const response = await service.get("/auth/verify");

      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
      setLoggedUsername(response.data.payload.username);
      setLoggedUserEmail(response.data.payload.email);
      setIsVerifyingUser(false);
    } catch (error) {
      localStorage.removeItem("authToken");

      setIsLoggedIn(false);
      setLoggedUserId(null);
      setLoggedUsername(null);
      setLoggedUserEmail(null);
      setIsVerifyingUser(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const signupUser = async (username, email, password) => {
    const response = await service.post("/auth/signup", {
      username,
      email,
      password,
    });

    return response.data;
  };

  const loginUser = async (email, password) => {
    const response = await service.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("authToken", response.data.authToken);

    setIsLoggedIn(true);
    setLoggedUserId(response.data.payload._id);
    setLoggedUsername(response.data.payload.username);
    setLoggedUserEmail(response.data.payload.email);

    return response.data;
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");

    setIsLoggedIn(false);
    setLoggedUserId(null);
    setLoggedUsername(null);
    setLoggedUserEmail(null);
  };

  const passedContext = {
    isLoggedIn,
    setIsLoggedIn,
    loggedUserId,
    setLoggedUserId,
    loggedUsername,
    setLoggedUsername,
    loggedUserEmail,
    setLoggedUserEmail,
    verifyUser,
    signupUser,
    loginUser,
    logoutUser,
  };

  if (isVerifyingUser) {
    return <h3>Verifying user credentials...</h3>;
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
