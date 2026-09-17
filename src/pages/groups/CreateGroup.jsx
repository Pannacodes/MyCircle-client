import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckSquare, ShoppingBasket } from "lucide-react";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";

function CreateGroup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [generalInfo, setGeneralInfo] = useState("");
  const [enabledModules, setEnabledModules] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleModuleChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setEnabledModules((currentModules) => [...currentModules, value]);
    } else {
      setEnabledModules((currentModules) =>
        currentModules.filter((module) => module !== value),
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter a group name.");
      return;
    }

    try {
      setIsLoading(true);

      await service.post("/groups", {
        name,
        generalInfo,
        enabledModules,
      });

      navigate("/groups");
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
            Your private space
          </p>
          <h1 className="mt-1 text-2xl font-bold">Create a group</h1>
          <p className="mt-2 text-sm text-(--mycircle-muted)">
            Give your circle a home for the things you share.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
        {/* Group name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold">
            Group name <span className="text-(--mycircle-error)">*</span>
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter a group name"
            required
            aria-describedby={errorMessage ? "group-form-error" : undefined}
            className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
          />
        </div>

        {/* General information */}
        <div>
          <label
            htmlFor="generalInfo"
            className="mb-2 block text-sm font-semibold"
          >
            General information <span className="font-normal text-(--mycircle-muted)">(optional)</span>
          </label>

          <textarea
            id="generalInfo"
            value={generalInfo}
            onChange={(event) => setGeneralInfo(event.target.value)}
            placeholder="Tell your group something about this space"
            rows={4}
            className="w-full resize-y rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 py-3 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
          />
        </div>

        {/* Modules */}
        <fieldset>
          <legend className="text-sm font-semibold">
            Modules <span className="font-normal text-(--mycircle-muted)">(optional)</span>
          </legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { value: "tasks", label: "Tasks", Icon: CheckSquare },
              { value: "activities", label: "Activities", Icon: CalendarDays },
              { value: "shopping", label: "Shopping", Icon: ShoppingBasket },
            ].map(({ value, label, Icon }) => {
              const isSelected = enabledModules.includes(value);

              return (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? "border-(--mycircle-primary) bg-(--mycircle-primary-tint)"
                      : "border-(--mycircle-border) hover:bg-(--mycircle-raised)"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={value}
                    checked={isSelected}
                    onChange={handleModuleChange}
                    className="sr-only"
                  />
                  <Icon
                    size={20}
                    className={
                      isSelected
                        ? "text-(--mycircle-primary)"
                        : "text-(--mycircle-muted)"
                    }
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">{label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Error */}
        {errorMessage && (
          <ErrorMessage id="group-form-error" message={errorMessage} />
        )}

        {/* Submit */}
            <div className="flex flex-col-reverse gap-3 border-t border-(--mycircle-border) pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating group..." : "Create group"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
