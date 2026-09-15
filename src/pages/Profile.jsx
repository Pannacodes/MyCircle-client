
import { useContext } from "react";
import { AuthContext } from "./../context/auth.context";


function Profile() {
  const { loggedUsername, loggedUserEmail } = useContext(AuthContext);
  return (
    <div>
      <h1>My Profile</h1>
      <p>Username: {loggedUsername}</p>
      <p>Email: {loggedUserEmail}</p>
    </div>
  );
}

export default Profile;
