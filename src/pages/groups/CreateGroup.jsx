import { useState } from "react";
import { useNavigate } from "react-router-dom";

import service from "../../services/index.services";

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

    if (!name) {
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
    <div>
      <h1>Create a group</h1>

      <form onSubmit={handleSubmit}>
        {/* Group name */}
        <div>
          <label htmlFor="name">Group name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter a group name"
          />
        </div>

        {/* General information */}
        <div>
          <label htmlFor="generalInfo">General information</label>

          <textarea
            id="generalInfo"
            value={generalInfo}
            onChange={(event) => setGeneralInfo(event.target.value)}
            placeholder="Tell your group something about this space"
          />
        </div>

        {/* Modules */}
        <fieldset>
          <legend>Modules</legend>

          <label>
            <input
              type="checkbox"
              value="tasks"
              checked={enabledModules.includes("tasks")}
              onChange={handleModuleChange}
            />
            Tasks
          </label>

          <label>
            <input
              type="checkbox"
              value="activities"
              checked={enabledModules.includes("activities")}
              onChange={handleModuleChange}
            />
            Activities
          </label>
        </fieldset>

        {/* Error */}
        {errorMessage && <p role="alert">{errorMessage}</p>}

        {/* Submit */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating group..." : "Create group"}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
