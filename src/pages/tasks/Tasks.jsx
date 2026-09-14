import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";

function Tasks() {
  const { groupId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Link to={`/groups/${groupId}`}>← Back to group</Link>

      <h1>Tasks</h1>

      <Link to={`/groups/${groupId}/tasks/create`}>Create a task</Link>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <Link to={`/groups/${groupId}/tasks/${task._id}`}>
                <strong>{task.title}</strong>
              </Link>

              {task.description && <p>{task.description}</p>}

              <p>Status: {task.completed ? "Completed" : "Pending"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
