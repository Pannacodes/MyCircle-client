import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import service from "../../services/index.services";

function GroupSettings() {
  const { groupId } = useParams();

  const [name, setName] = useState("");
  const [generalInfo, setGeneralInfo] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  const getGroup = async () => {
    try {
      const response = await service.get(`/groups/${groupId}`);
      setGroup(response.data);
      setName(response.data.name);
      setGeneralInfo(response.data.generalInfo || "");
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

  const updateGroup = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!name) {
      setErrorMessage("Group name is required.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await service.put(`/groups/${groupId}`, {
        name,
        generalInfo,
      });

      setGroup(response.data);
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

  const addMember = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!memberEmail) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    try {
      setIsAddingMember(true);

      const response = await service.post(`/groups/${groupId}/members`, {
        email: memberEmail,
      });

      setGroup(response.data);
      setMemberEmail("");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsAddingMember(false);
    }
  };

  const promoteMember = async (userId) => {
    try {
      const response = await service.post(
        `/groups/${groupId}/owners/${userId}`,
      );

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

      <h2>Group information</h2>

      <form onSubmit={updateGroup}>
        <div>
          <label htmlFor="name">Group name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="generalInfo">General information</label>

          <textarea
            id="generalInfo"
            value={generalInfo}
            onChange={(event) => setGeneralInfo(event.target.value)}
          />
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <h2>Members</h2>

      <ul>
        {group.members.map((member) => {
          const isOwner = group.owners.some(
            (owner) => owner._id === member._id,
          );

          return (
            <li key={member._id}>
              {member.username} ({member.email})
              {isOwner ? (
                <span> — Owner</span>
              ) : (
                <button type="button" onClick={() => promoteMember(member._id)}>
                  Make owner
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <h3>Add a member</h3>

      <form onSubmit={addMember}>
        <div>
          <label htmlFor="memberEmail">Email address</label>

          <input
            id="memberEmail"
            type="email"
            value={memberEmail}
            onChange={(event) => setMemberEmail(event.target.value)}
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <button type="submit" disabled={isAddingMember}>
          {isAddingMember ? "Adding..." : "Add member"}
        </button>
      </form>

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
