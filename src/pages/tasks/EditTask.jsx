import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";

function EditTask() {
  const { groupId, taskId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getTask = async () => {
    try {
      const response = await service.get(`/tasks/${taskId}`);

      setTitle(response.data.title);
      setDescription(response.data.description || "");

      if (response.data.dueDate) {
        setDueDate(response.data.dueDate.slice(0, 10));
      }
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
    getTask();
  }, [taskId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter a task title.");
      return;
    }

    try {
      setIsSaving(true);

      await service.put(`/tasks/${taskId}`, {
        title,
        description,
        dueDate: dueDate || undefined,
      });

      navigate(`/groups/${groupId}/tasks/${taskId}`);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>Loading task...</p>;
  }

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>Edit task</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title">Task title *</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
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
          <p id="task-form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditTask;
