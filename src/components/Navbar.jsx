import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">MyCircle</Link>

      <div>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/groups">Groups</Link>

        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;