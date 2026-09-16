import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";

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
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>Create a task</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title">Task title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a task"
            required
            aria-describedby={errorMessage ? "task-form-error" : undefined}
          />
        </div>

        <div>
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a description"
          />
        </div>

        <div>
          <label htmlFor="dueDate">Due date (optional)</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        {errorMessage && (
          <ErrorMessage id="task-form-error" message={errorMessage} />
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create task"}
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
