import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";

function GroupSettings() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getGroup = async () => {
    try {
      const response = await service.get(`/groups/${groupId}`);
      setGroup(response.data);
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
    getGroup();
  }, [groupId]);

  const enableModule = async (moduleName) => {
    try {
      const response = await service.post(`/groups/${groupId}/modules`, {
        moduleName,
      });

      setGroup(response.data);
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
    return <p>Loading group settings...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  const modules = [
    {
      name: "tasks",
      label: "Tasks",
    },
    {
      name: "activities",
      label: "Activities",
    },
    {
      name: "shopping",
      label: "Shopping",
    },
    {
      name: "expenses",
      label: "Expenses",
    },
  ];

  return (
    <div>
      <Link to={`/groups/${groupId}`}>← Back to group</Link>

      <h1>Group settings</h1>

      <h2>Modules</h2>

      {modules.map((module) => {
        const isEnabled = group.enabledModules.includes(module.name);

        return (
          <div key={module.name}>
            <span>{module.label}</span>

            {isEnabled ? (
              <span> Enabled</span>
            ) : (
              <button type="button" onClick={() => enableModule(module.name)}>
                Enable
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GroupSettings;
