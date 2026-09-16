import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";

function Activities() {
  const { groupId } = useParams();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || activity.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search activities..."
          className="h-11 flex-1 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary)"
        />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-11 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary)"
        >
          <option value="all">All categories</option>
          <option value="Food & Dining">Food & Dining</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Sport">Sport</option>
          <option value="Outdoors">Outdoors</option>
          <option value="Culture">Culture</option>
          <option value="Travel">Travel</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <Link to={`/groups/${groupId}/activities/create`}>
        Create an activity
      </Link>

      {activities.length === 0 ? (
        <p>No activities yet.</p>
      ) : (
        <ul>
          {filteredActivities.map((activity) => (
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
