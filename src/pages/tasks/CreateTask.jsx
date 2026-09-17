import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";

function CreateTask() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter a task title.");
      return;
    }

    try {
      setIsLoading(true);

      await service.post("/tasks", {
        title,
        description,
        dueDate: dueDate || undefined,
        group: groupId,
      });

      navigate(`/groups/${groupId}/tasks`);
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

  return (
    <div className="min-h-screen bg-(--mycircle-background) px-4 py-8 text-(--mycircle-text) sm:px-6">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-(--mycircle-muted) hover:text-(--mycircle-primary)"
        >
          ← Back
        </button>

        <div className="mt-6 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:p-7">
          <p className="text-sm font-semibold text-(--mycircle-primary)">
            Shared list
          </p>
          <h1 className="mt-1 text-2xl font-bold">Create a task</h1>
          <p className="mt-2 text-sm text-(--mycircle-muted)">
            Add something your circle can keep moving together.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold"
              >
                Task title <span className="text-(--mycircle-error)">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a task"
                required
                aria-describedby={errorMessage ? "task-form-error" : undefined}
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold"
              >
                Description <span className="font-normal text-(--mycircle-muted)">(optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a description"
                rows={4}
                className="w-full resize-y rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 py-3 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-semibold"
              >
                Due date <span className="font-normal text-(--mycircle-muted)">(optional)</span>
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
              />
            </div>

            {errorMessage && (
              <ErrorMessage id="task-form-error" message={errorMessage} />
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-(--mycircle-border) pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
