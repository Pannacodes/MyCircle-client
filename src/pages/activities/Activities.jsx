import { useContext, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { AuthContext } from "../../context/auth.context";

function Activities() {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const { loggedUserId } = useContext(AuthContext);

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );
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

  const updateActivity = (activity) => {
    setActivities((currentActivities) =>
      currentActivities.map((currentActivity) =>
        currentActivity._id === activity._id ? activity : currentActivity,
      ),
    );
  };

  const toggleParticipation = async (activity) => {
    const participants = activity.participants || [];
    const isParticipant = participants.some(
      (participantId) => participantId.toString() === loggedUserId.toString(),
    );

    try {
      const response = isParticipant
        ? await service.delete(`/activities/${activity._id}/participants`)
        : await service.post(`/activities/${activity._id}/participants`);

      updateActivity(response.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const deleteActivity = async (activity) => {
    if (!window.confirm(`Delete "${activity.title}"?`)) {
      return;
    }

    try {
      await service.delete(`/activities/${activity._id}`);
      setActivities((currentActivities) =>
        currentActivities.filter(
          (currentActivity) => currentActivity._id !== activity._id,
        ),
      );
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || activity.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--mycircle-background) text-sm text-(--mycircle-muted)">
        Loading activities...
      </div>
    );
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  return (
    <div className="min-h-screen bg-(--mycircle-background) text-(--mycircle-text)">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to={`/groups/${groupId}`}
          className="text-sm font-semibold text-(--mycircle-muted) hover:text-(--mycircle-primary)"
        >
          ← Back to group
        </Link>

        <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-(--mycircle-secondary)">
              Time together
            </p>
            <h1 className="mt-1 text-3xl font-bold">Activities</h1>
            <p className="mt-2 text-sm text-(--mycircle-muted)">
              Make space for the plans you share.
            </p>
          </div>

          <Link
            to={`/groups/${groupId}/activities/create`}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-(--mycircle-secondary) px-5 text-sm font-semibold text-white hover:brightness-95"
          >
            <Plus size={18} aria-hidden="true" />
            Create an activity
          </Link>
        </section>

        <section className="mt-7 flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mycircle-muted)"
              aria-hidden="true"
            />
            <span className="sr-only">Search activities</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search activities..."
              className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) pl-10 pr-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
            />
          </label>

          <label>
            <span className="sr-only">Filter activities</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint) sm:w-48"
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
          </label>
        </section>

        {activities.length === 0 ? (
          <EmptyState
            className="mt-6"
            icon={CalendarDays}
            title="No plans yet."
            description="Time to make one for your circle."
            action={
              <Link
                to={`/groups/${groupId}/activities/create`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--mycircle-secondary) px-5 text-sm font-semibold text-white hover:brightness-95"
              >
                <Plus size={18} aria-hidden="true" />
                Plan an activity
              </Link>
            }
          />
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {filteredActivities.map((activity) => (
              <li key={activity._id}>
                <div className="flex h-full flex-col rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(46,42,38,0.08)]">
                  {activity.category && (
                    <span className="inline-flex rounded-full bg-(--mycircle-secondary-tint) px-2.5 py-1 text-xs font-semibold text-(--mycircle-secondary)">
                      {activity.category}
                    </span>
                  )}

                  <h2 className="mt-3 text-lg font-semibold">
                    {activity.title}
                  </h2>

                  {activity.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-(--mycircle-muted)">
                      {activity.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-sm text-(--mycircle-muted)">
                    {activity.date && (
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} aria-hidden="true" />
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    )}
                    {activity.location && (
                      <p className="flex items-center gap-2">
                        <MapPin size={16} aria-hidden="true" />
                        {activity.location}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Users size={16} aria-hidden="true" />
                      {(activity.participants || []).length} participant
                      {(activity.participants || []).length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-(--mycircle-border) pt-4">
                    <button
                      type="button"
                      onClick={() => toggleParticipation(activity)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-(--mycircle-secondary) px-3 text-xs font-semibold text-white hover:brightness-95"
                    >
                      <UserPlus size={15} aria-hidden="true" />
                      {(activity.participants || []).some(
                        (participantId) =>
                          participantId.toString() === loggedUserId.toString(),
                      )
                        ? "Joined"
                        : "Join"}
                    </button>
                    <Link
                      to={`/groups/${groupId}/activities/${activity._id}/edit`}
                      aria-label={`Edit ${activity.title}`}
                      className="ml-auto rounded-lg p-2 text-(--mycircle-muted) hover:bg-(--mycircle-surface) hover:text-(--mycircle-secondary)"
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteActivity(activity)}
                      aria-label={`Delete ${activity.title}`}
                      className="rounded-lg p-2 text-(--mycircle-muted) hover:bg-(--mycircle-surface) hover:text-(--mycircle-error)"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {activities.length > 0 && filteredActivities.length === 0 && (
          <p className="mt-6 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-6 text-center text-sm text-(--mycircle-muted)">
            No activities match your search or filter.
          </p>
        )}
      </div>
    </div>
  );
}

export default Activities;
