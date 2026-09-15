import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import service from "../services/index.services";
import { AuthContext } from "../context/auth.context";

function Home() {
  const { loggedUsername } = useContext(AuthContext);

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getGroups = async () => {
    try {
      const response = await service.get("/groups");
      setGroups(response.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div>
      <h1>Welcome back, {loggedUsername}!</h1>
      <section>
        <h2>Your groups</h2>

        {isLoading && <p>Loading groups...</p>}

        {errorMessage && <p>{errorMessage}</p>}

        {!isLoading && !errorMessage && groups.length === 0 && (
          <p>You are not part of any groups yet.</p>
        )}

        {groups.map((group) => (
          <div key={group._id}>
            <h3>{group.name}</h3>

            {group.generalInfo && <p>{group.generalInfo}</p>}

            <Link to={`/groups/${group._id}`}>View group</Link>
          </div>
        ))}
      </section>

      <section>
        <h2>Quick actions</h2>

        <Link to="/groups/create">Create a group</Link>
      </section>
    </div>
  );
}

export default Home;
