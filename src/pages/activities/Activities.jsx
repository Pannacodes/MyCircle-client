import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";

function Activities() {
  const { groupId } = useParams();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getActivities = async () => {
    try {
      const response = await service.get("/activities");

      const groupActivities = response.data.filter(
        (activity) => activity.group.toString() === groupId,
      );

      setActivities(groupActivities);
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
    getActivities();
  }, [groupId]);

  if (isLoading) {
    return <p>Loading activities...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Link to={`/groups/${groupId}`}>← Back to group</Link>

      <h1>Activities</h1>

      <Link to={`/groups/${groupId}/activities/create`}>
        Create an activity
      </Link>

      {activities.length === 0 ? (
        <p>No activities yet.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <Link to={`/groups/${groupId}/activities/${activity._id}`}>
                <strong>{activity.title}</strong>
              </Link>

              {activity.description && <p>{activity.description}</p>}

              {activity.category && <p>Category: {activity.category}</p>}

              {activity.date && (
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              )}

              {activity.location && <p>Location: {activity.location}</p>}

              <p>Participants: {activity.participants.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Activities;
