import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OnlyPrivate from "./components/OnlyPrivate";
import AppLayout from "./components/AppLayout";
import Groups from "./pages/groups/Groups";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Home />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/profile"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Profile />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Groups />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
