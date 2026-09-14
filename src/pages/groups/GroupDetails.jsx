import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";

function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getGroup = async () => {
    try {
      const response = await service.get(`/groups/${groupId}`);

      setGroup(response.data);
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
    getGroup();
  }, [groupId]);

  if (isLoading) {
    return <p>Loading group...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Link to="/groups">← Back to groups</Link>

      <h1>{group.name}</h1>

      {group.generalInfo && <p>{group.generalInfo}</p>}

      <h2>Enabled modules</h2>

      {group.enabledModules.length === 0 ? (
        <p>No modules enabled yet.</p>
      ) : (
        <ul>
          {group.enabledModules.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ul>
      )}
      {group.enabledModules.includes("tasks") && (
        <Link to={`/groups/${groupId}/tasks`}>View tasks</Link>
      )}

      {group.enabledModules.includes("activities") && (
        <Link to={`/groups/${groupId}/activities`}>View activities</Link>
      )}
      <Link to={`/groups/${groupId}/settings`}>Group settings</Link>

      <p>Members: {group.members.length}</p>
      <p>Owners: {group.owners.length}</p>
    </div>
  );
}

export default GroupDetails;
