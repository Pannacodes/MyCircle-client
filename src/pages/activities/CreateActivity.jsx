import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";

function CreateActivity() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter an activity title.");
      return;
    }

    if (!category) {
      setErrorMessage("Please select a category.");
      return;
    }

    if (!date) {
      setErrorMessage("Please select a date.");
      return;
    }

    try {
      setIsLoading(true);

      await service.post("/activities", {
        title,
        description,
        category,
        date,
        location,
        group: groupId,
      });

      navigate(`/groups/${groupId}/activities`);
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
          className="text-sm font-semibold text-(--mycircle-muted) hover:text-(--mycircle-secondary)"
        >
          ← Back
        </button>

        <div className="mt-6 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:p-7">
          <p className="text-sm font-semibold text-(--mycircle-secondary)">
            Time together
          </p>
          <h1 className="mt-1 text-2xl font-bold">Create an activity</h1>
          <p className="mt-2 text-sm text-(--mycircle-muted)">
            Make a plan your circle can look forward to.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold"
              >
                Activity title <span className="text-(--mycircle-error)">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter an activity"
                required
                aria-describedby={errorMessage ? "activity-form-error" : undefined}
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
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
                className="w-full resize-y rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 py-3 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-semibold">
                Category <span className="text-(--mycircle-error)">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                aria-describedby={errorMessage ? "activity-form-error" : undefined}
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
              >
                <option value="">Select a category</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sport">Sport</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Culture">Culture</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-semibold">
                Date <span className="text-(--mycircle-error)">*</span>
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                aria-describedby={errorMessage ? "activity-form-error" : undefined}
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-semibold">
                Location <span className="font-normal text-(--mycircle-muted)">(optional)</span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Where is it?"
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
              />
            </div>

            {errorMessage && (
              <ErrorMessage id="activity-form-error" message={errorMessage} />
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
                {isLoading ? "Creating..." : "Create activity"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateActivity;
