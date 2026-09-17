import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

function Tasks() {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState("all");

  const getTasks = async () => {
    try {
      const response = await service.get("/tasks");

      const groupTasks = response.data.filter(
        (task) => task.group.toString() === groupId,
      );

      setTasks(groupTasks);
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
    getTasks();
  }, [groupId]);

  const toggleCompleted = async (task) => {
    try {
      const response = await service.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === task._id ? response.data : currentTask,
        ),
      );
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      await service.delete(`/tasks/${task._id}`);
      setTasks((currentTasks) =>
        currentTasks.filter((currentTask) => currentTask._id !== task._id),
      );
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "todo" && !task.completed);

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--mycircle-background) text-sm text-(--mycircle-muted)">
        Loading tasks...
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
            <p className="text-sm font-semibold text-(--mycircle-primary)">
              Shared list
            </p>
            <h1 className="mt-1 text-3xl font-bold">Tasks</h1>
            <p className="mt-2 text-sm text-(--mycircle-muted)">
              Keep the little things moving together.
            </p>
          </div>

          <Link
            to={`/groups/${groupId}/tasks/create`}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white hover:bg-(--mycircle-primary-hover)"
          >
            <Plus size={18} aria-hidden="true" />
            Create a task
          </Link>
        </section>

        <section className="mt-7 flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mycircle-muted)"
              aria-hidden="true"
            />
            <span className="sr-only">Search tasks</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search tasks..."
              className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) pl-10 pr-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
            />
          </label>

          <label>
            <span className="sr-only">Filter tasks</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint) sm:w-40"
            >
              <option value="all">All tasks</option>
              <option value="todo">To do</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </section>

        {tasks.length === 0 ? (
          <EmptyState
            className="mt-6"
            icon={CheckCircle2}
            title="Nothing on the list yet."
            description="Add a task when something needs doing."
            action={
              <Link
                to={`/groups/${groupId}/tasks/create`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white hover:bg-(--mycircle-primary-hover)"
              >
                <Plus size={18} aria-hidden="true" />
                Add a task
              </Link>
            }
          />
        ) : (
          <ul className="mt-6 space-y-3">
            {filteredTasks.map((task) => (
              <li key={task._id}>
                <div className="flex items-start gap-3 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(46,42,38,0.08)]">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(task)}
                    aria-label={
                      task.completed
                        ? `Mark ${task.title} as incomplete`
                        : `Mark ${task.title} as complete`
                    }
                    className="mt-0.5 shrink-0 rounded-full"
                  >
                    {task.completed ? (
                      <CheckCircle2
                        size={21}
                        className="text-(--mycircle-success)"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        size={21}
                        className="text-(--mycircle-primary)"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <span className="min-w-0 flex-1">
                    <strong
                      className={`block truncate text-sm font-semibold ${
                        task.completed
                          ? "text-(--mycircle-muted) line-through"
                          : ""
                      }`}
                    >
                      {task.title}
                    </strong>
                    {task.description && (
                      <span className="mt-1 block truncate text-sm text-(--mycircle-muted)">
                        {task.description}
                      </span>
                    )}
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    {task.dueDate && (
                      <span className="hidden items-center gap-1 text-xs font-medium text-(--mycircle-muted) sm:flex">
                        <CalendarClock size={15} aria-hidden="true" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <Link
                      to={`/groups/${groupId}/tasks/${task._id}/edit`}
                      aria-label={`Edit ${task.title}`}
                      className="rounded-lg p-2 text-(--mycircle-muted) hover:bg-(--mycircle-surface) hover:text-(--mycircle-primary)"
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteTask(task)}
                      aria-label={`Delete ${task.title}`}
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

        {tasks.length > 0 && filteredTasks.length === 0 && (
          <p className="mt-6 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-6 text-center text-sm text-(--mycircle-muted)">
            No tasks match your search or filter.
          </p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
