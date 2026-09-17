import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, CalendarDays, Users } from "lucide-react";

import service from "../services/index.services";
import ErrorMessage from "../components/ErrorMessage";
import { AuthContext } from "../context/auth.context";
import EmptyState from "../components/EmptyState";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function Home() {
  const navigate = useNavigate();

  const { loggedUsername } = useContext(AuthContext);

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const getGroups = async () => {
    try {
      const response = await service.get("/groups");
      setGroups(response.data);

      const tasksResponse = await service.get("/tasks");
      setTasks(tasksResponse.data);

      const activitiesResponse = await service.get("/activities");
      setActivities(activitiesResponse.data);
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

  const calendarEvents = [
    ...tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task._id,
        title: task.title,
        date: task.dueDate,
        classNames: ["calendar-task"],
        extendedProps: {
          type: "task",
          groupId: task.group,
        },
      })),

    ...activities
      .filter((activity) => activity.date)
      .map((activity) => ({
        id: activity._id,
        title: activity.title,
        date: activity.date,
        classNames: ["calendar-activity"],
        extendedProps: {
          type: "activity",
          groupId: activity.group,
        },
      })),
  ];

  return (
    <div className="min-h-screen bg-(--mycircle-background) text-(--mycircle-text)">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {loggedUsername}!
          </h1>

          <p className="mt-2 text-base text-(--mycircle-muted)">
            Here's what's happening across your groups.
          </p>
        </section>

        {/* Calendar */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays
              size={22}
              strokeWidth={1.8}
              className="text-(--mycircle-primary)"
              aria-hidden="true"
            />

            <h2 className="text-2xl font-semibold">Calendar</h2>
          </div>

          <div className="rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-4 shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:p-6">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              displayEventTime={false}
              height="auto"
              eventClick={(info) => {
                const { type, groupId } =
                  info.event.extendedProps;

                const searchQuery = `?search=${encodeURIComponent(info.event.title)}`;

                if (type === "task") {
                  navigate(`/groups/${groupId}/tasks${searchQuery}`);
                }

                if (type === "activity") {
                  navigate(`/groups/${groupId}/activities${searchQuery}`);
                }
              }}
            />
          </div>

          {/* Calendar legend */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-(--mycircle-muted)">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full bg-(--mycircle-primary)"
                aria-hidden="true"
              />
              <span>Tasks</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full bg-(--mycircle-secondary)"
                aria-hidden="true"
              />
              <span>Activities</span>
            </div>
          </div>
        </section>

        {/* Groups */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users
                size={22}
                strokeWidth={1.8}
                className="text-(--mycircle-secondary)"
                aria-hidden="true"
              />

              <h2 className="text-2xl font-semibold">Your groups</h2>
            </div>

            <Link
              to="/groups"
              className="flex items-center gap-1 text-sm font-semibold text-(--mycircle-primary) hover:text-(--mycircle-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
            >
              View all
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {isLoading && (
            <p className="text-(--mycircle-muted)">Loading your groups...</p>
          )}

          {errorMessage && (
            <ErrorMessage message={errorMessage} />
          )}

          {!isLoading && !errorMessage && groups.length === 0 && (
            <EmptyState
              icon={Users}
              title="You're not part of any circle yet."
              description="Create your first group to start sharing life with your people."
              action={
                <Link
                  to="/groups/create"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white hover:bg-(--mycircle-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
                >
                  <Plus size={18} aria-hidden="true" />
                  Create your first group
                </Link>
              }
            />
          )}

          {!isLoading && !errorMessage && groups.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <Link
                  key={group._id}
                  to={`/groups/${group._id}`}
                  className="group rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(46,42,38,0.08)] focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
                >
                  <h3 className="text-lg font-semibold">{group.name}</h3>

                  {group.generalInfo && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-(--mycircle-muted)">
                      {group.generalInfo}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-(--mycircle-primary)">
                    View group
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Quick actions</h2>

          <Link
            to="/groups/create"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white hover:bg-(--mycircle-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
          >
            <Plus size={18} aria-hidden="true" />
            Create a group
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Home;
