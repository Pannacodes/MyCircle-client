import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";

function TaskDetails() {
  const { groupId, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getTask = async () => {
    try {
      const response = await service.get(`/tasks/${taskId}`);

      setTask(response.data);
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

  const toggleCompleted = async () => {
    try {
      const response = await service.put(`/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: !task.completed,
      });

      setTask(response.data);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    getTask();
  }, [taskId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await service.delete(`/tasks/${taskId}`);

      navigate(`/groups/${groupId}/tasks`);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <p>Loading task...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Link to={`/groups/${groupId}/tasks`}>← Back to tasks</Link>

      <h1>{task.title}</h1>

      {task.description && <p>{task.description}</p>}

      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleCompleted}
        />
        {task.completed ? "Completed" : "Pending"}
      </label>

      {task.dueDate && (
        <p>Due date: {new Date(task.dueDate).toLocaleDateString()}</p>
      )}

      <Link to={`/groups/${groupId}/tasks/${taskId}/edit`}>Edit task</Link>

      <button type="button" onClick={handleDelete}>
        Delete task
      </button>
    </div>
  );
}

export default TaskDetails;
