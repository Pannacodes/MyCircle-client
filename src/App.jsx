import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/auth/Signup";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
