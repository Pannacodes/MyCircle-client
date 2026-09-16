import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";
import ErrorMessage from "../../components/ErrorMessage";

function Tasks() {
  const { groupId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
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
    return <p>Loading tasks...</p>;
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  return (
    <div>
      <Link to={`/groups/${groupId}`}>← Back to group</Link>

      <h1>Tasks</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tasks..."
          className="h-11 flex-1 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary)"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-11 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-4 text-sm text-(--mycircle-text) outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary)"
        >
          <option value="all">All tasks</option>
          <option value="todo">To do</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <Link to={`/groups/${groupId}/tasks/create`}>Create a task</Link>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
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
