import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LoaderCircle, Plus, Users } from "lucide-react";

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
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--mycircle-primary-tint)">
            <Users
              size={24}
              strokeWidth={1.8}
              className="text-(--mycircle-primary)"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-xl font-semibold text-(--mycircle-text)">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm leading-6 text-(--mycircle-muted)">
            {errorMessage}
          </p>{" "}
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
              Your private circles and the people in them.
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
          <section className="flex min-h-75 items-center justify-center rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-6 py-12">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--mycircle-secondary-tint)">
                <Users
                  size={28}
                  strokeWidth={1.8}
                  className="text-(--mycircle-secondary)"
                  aria-hidden="true"
                />
              </div>

              <h2 className="text-xl font-semibold">
                You're not part of any circle yet.
              </h2>

              <p className="mt-2 text-sm leading-6 text-(--mycircle-muted)">
                Create your first group to start sharing tasks, activities and
                plans with the people in your circle.
              </p>

              <Link
                to="/groups/create"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white transition-colors hover:bg-(--mycircle-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
              >
                <Plus size={18} aria-hidden="true" />
                Create your first group
              </Link>
            </div>
          </section>
        )}

        {/* Group cards */}
        {groups.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="group flex flex-col rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 transition-shadow hover:shadow-[0_2px_8px_rgba(46,42,38,0.08)] focus:outline-none focus:ring-2 focus:ring-(--mycircle-primary) focus:ring-offset-2"
              >
                {/* Group name */}
                <h2 className="text-lg font-semibold">{group.name}</h2>

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

                    <p className="mt-1 text-sm text-(--mycircle-text)">
                      {group.members
                        .map((member) => member.username)
                        .join(" · ")}
                    </p>
                  </div>
                )}

                {/* View group */}
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-(--mycircle-primary)">
                  View group
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
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
