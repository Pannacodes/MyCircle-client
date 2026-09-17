import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Settings,
  ShoppingBasket,
  Users,
} from "lucide-react";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";

function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getGroup = async () => {
    try {
      const response = await service.get(`/groups/${groupId}`);
      const enabledModules = response.data.enabledModules || [];

      const [tasksResponse, activitiesResponse] = await Promise.all([
        enabledModules.includes("tasks") ? service.get("/tasks") : null,
        enabledModules.includes("activities")
          ? service.get("/activities")
          : null,
      ]);

      setGroup(response.data);
      setTasks(
        tasksResponse?.data.filter(
          (task) => String(task.group?._id || task.group) === groupId,
        ) || [],
      );
      setActivities(
        activitiesResponse?.data.filter(
          (activity) =>
            String(activity.group?._id || activity.group) === groupId,
        ) || [],
      );
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--mycircle-background) text-sm text-(--mycircle-muted)">
        Loading group...
      </div>
    );
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  const enabledModules = group.enabledModules || [];
  const outstandingTasks = tasks.filter((task) => !task.completed).slice(0, 5);
  const upcomingActivities = activities
    .filter((activity) => !activity.date || new Date(activity.date) >= new Date())
    .sort((first, second) => new Date(first.date) - new Date(second.date))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-(--mycircle-background) text-(--mycircle-text)">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/groups"
          className="text-sm font-semibold text-(--mycircle-muted) hover:text-(--mycircle-primary)"
        >
          ← Back to groups
        </Link>

        <section className="mt-6 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--mycircle-primary-tint) text-(--mycircle-primary)">
                <Users size={30} strokeWidth={1.7} aria-hidden="true" />
              </div>

              <div>
                <p className="text-sm font-semibold text-(--mycircle-primary)">
                  Your circle
                </p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {group.name}
                </h1>
                {group.generalInfo && (
                  <p className="mt-1 text-sm text-(--mycircle-muted)">
                    {group.generalInfo}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-(--mycircle-muted)">
              <span className="font-semibold text-(--mycircle-text)">
                {group.members.length}
              </span>
              member{group.members.length === 1 ? "" : "s"}
            </div>
          </div>
        </section>

        {(enabledModules.includes("tasks") ||
          enabledModules.includes("activities")) && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {enabledModules.includes("tasks") && (
              <section className="rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-(--mycircle-primary)">
                      <CheckCircle2 size={19} aria-hidden="true" />
                      <h2 className="text-lg font-semibold text-(--mycircle-text)">
                        What needs doing
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-(--mycircle-muted)">
                      {outstandingTasks.length
                        ? "A few things still on the list."
                        : "Nothing on the list. Enjoy the calm."}
                    </p>
                  </div>
                  <Link
                    to={`/groups/${groupId}/tasks`}
                    aria-label="View all tasks"
                    className="rounded-full p-2 text-(--mycircle-muted) hover:bg-(--mycircle-raised) hover:text-(--mycircle-primary)"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-5 space-y-2">
                  {outstandingTasks.map((task) => (
                    <Link
                      key={task._id}
                      to={`/groups/${groupId}/tasks`}
                      className="flex items-center gap-3 rounded-lg border border-(--mycircle-border) px-3 py-3 hover:bg-(--mycircle-raised)"
                    >
                      <Circle
                        size={17}
                        className="shrink-0 text-(--mycircle-primary)"
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm font-semibold">
                        {task.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {enabledModules.includes("activities") && (
              <section className="rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-(--mycircle-secondary)">
                      <CalendarDays size={19} aria-hidden="true" />
                      <h2 className="text-lg font-semibold text-(--mycircle-text)">
                        Coming up
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-(--mycircle-muted)">
                      Plans your circle has in motion.
                    </p>
                  </div>
                  <Link
                    to={`/groups/${groupId}/activities`}
                    aria-label="View all activities"
                    className="rounded-full p-2 text-(--mycircle-muted) hover:bg-(--mycircle-raised) hover:text-(--mycircle-secondary)"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-5 space-y-2">
                  {upcomingActivities.map((activity) => (
                    <Link
                      key={activity._id}
                      to={`/groups/${groupId}/activities`}
                      className="flex items-center gap-3 rounded-lg border border-(--mycircle-border) px-3 py-3 hover:bg-(--mycircle-raised)"
                    >
                      <CalendarDays
                        size={17}
                        className="shrink-0 text-(--mycircle-secondary)"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {activity.title}
                        </span>
                        {activity.date && (
                          <span className="mt-0.5 block text-xs text-(--mycircle-muted)">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <section className="mt-6 flex flex-wrap gap-3">
          {enabledModules.includes("shopping") && (
            <Link
              to={`/groups/${groupId}/shopping`}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm font-semibold hover:bg-(--mycircle-raised)"
            >
              <ShoppingBasket size={17} aria-hidden="true" />
              Shopping list
            </Link>
          )}
          <Link
            to={`/groups/${groupId}/settings`}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm font-semibold hover:bg-(--mycircle-raised)"
          >
            <Settings size={17} aria-hidden="true" />
            Group settings
          </Link>
        </section>
      </div>
    </div>
  );
}

export default GroupDetails;
