import { useEffect, useState } from "react";

import service from "../../services/index.services";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getGroups = async () => {
    try {
      const response = await service.get("/groups");

      setGroups(response.data);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  if (isLoading) {
    return <p>Loading groups...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <h1>My Groups</h1>

      {groups.length === 0 ? (
        <p>You don't belong to any groups yet.</p>
      ) : (
        <div>
          {groups.map((group) => (
            <div key={group._id}>
              <h2>{group.name}</h2>

              {group.generalInfo && <p>{group.generalInfo}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Groups;