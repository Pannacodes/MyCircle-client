import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";

function ActivityDetails() {
  const { groupId, activityId } = useParams();
  const navigate = useNavigate();
  const { loggedUserId } = useContext(AuthContext);

  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getActivity = async () => {
    try {
      const response = await service.get(`/activities/${activityId}`);
      setActivity(response.data);
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
    getActivity();
  }, [activityId]);

  const joinActivity = async () => {
    try {
      const response = await service.post(
        `/activities/${activityId}/participants`,
      );

      setActivity(response.data);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const leaveActivity = async () => {
    try {
      const response = await service.delete(
        `/activities/${activityId}/participants`,
      );

      setActivity(response.data);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await service.delete(`/activities/${activityId}`);

      navigate(`/groups/${groupId}/activities`);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <p>Loading activity...</p>;
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  const isParticipant = activity.participants.some(
    (participantId) => participantId.toString() === loggedUserId.toString(),
  );

  return (
    <div>
      <Link to={`/groups/${groupId}/activities`}>← Back to activities</Link>

      <h1>{activity.title}</h1>

      {activity.description && <p>{activity.description}</p>}

      {activity.category && <p>Category: {activity.category}</p>}

      {activity.date && (
        <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
      )}

      {activity.location && <p>Location: {activity.location}</p>}

      <p>Participants: {activity.participants.length}</p>

      {isParticipant ? (
        <button type="button" onClick={leaveActivity}>
          Leave activity
        </button>
      ) : (
        <button type="button" onClick={joinActivity}>
          Join activity
        </button>
      )}
      <Link to={`/groups/${groupId}/activities/${activityId}/edit`}>
        Edit activity
      </Link>
      <button type="button" onClick={handleDelete}>
        Delete activity
      </button>
    </div>
  );
}

export default ActivityDetails;
