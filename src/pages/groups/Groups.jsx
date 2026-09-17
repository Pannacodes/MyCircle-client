import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LoaderCircle, Plus, Users } from "lucide-react";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

function getMemberInitials(username = "") {
  const trimmedUsername = username.trim();

  return trimmedUsername ? trimmedUsername.slice(0, 2).toUpperCase() : "?";
}

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
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-var(--mycircle-background) px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle
            size={32}
            strokeWidth={1.8}
            className="animate-spin text-var(--mycircle-primary)"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-var(--mycircle-muted)">
            Loading groups...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-(--mycircle-background) px-4">
        <div className="w-full max-w-md">
          <ErrorMessage message={errorMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--mycircle-background) text-(--mycircle-text)">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Groups
            </h1>

            <p className="mt-2 text-base text-(--mycircle-muted)">
              Your private groups and the people in them.
            </p>
          </div>

          <Link
            to="/groups/create"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white transition-colors hover:bg-(--mycircle-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
          >
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            Create a group
          </Link>
        </section>

        {/* Empty state */}
        {groups.length === 0 && (
          <EmptyState
            icon={Users}
            title="You're not part of any group yet."
            description="Create your first group to start sharing tasks, activities and plans with the people in your circle."
            action={
              <Link
                to="/groups/create"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white transition-colors hover:bg-(--mycircle-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
              >
                <Plus size={18} aria-hidden="true" />
                Create your first group
              </Link>
            }
          />
        )}

        {/* Group cards */}
        {groups.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="group flex flex-col rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(46,42,38,0.08)] focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--mycircle-primary-tint) text-(--mycircle-primary)">
                      <Users size={21} strokeWidth={1.8} aria-hidden="true" />
                    </div>

                    <h2 className="text-lg font-semibold">{group.name}</h2>
                  </div>

                  <ArrowRight
                    size={18}
                    strokeWidth={1.8}
                    className="mt-1 shrink-0 text-(--mycircle-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--mycircle-primary)"
                    aria-hidden="true"
                  />
                </div>

                {/* Group information */}
                {group.generalInfo && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-(--mycircle-muted)">
                    {group.generalInfo}
                  </p>
                )}

                {/* Members */}
                {group.members && group.members.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <Users
                        size={16}
                        strokeWidth={1.8}
                        className="text-(--mycircle-secondary)"
                        aria-hidden="true"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wide text-(--mycircle-muted)">
                        Members
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 4).map((member) => (
                          <span
                            key={member._id}
                            title={member.username}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-(--mycircle-surface) bg-(--mycircle-secondary-tint) text-[11px] font-bold text-(--mycircle-secondary)"
                          >
                            {getMemberInitials(member.username)}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-medium text-(--mycircle-muted)">
                        {group.members.length} member
                        {group.members.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                )}

                {/* View group */}
                <div className="mt-5 text-sm font-semibold text-(--mycircle-primary)">
                  View group
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default Groups;
