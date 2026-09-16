import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import service from "../../services/index.services";
import { AuthContext } from "../../context/auth.context";
import ErrorMessage from "../../components/ErrorMessage";

function GroupSettings() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { loggedUserId } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [generalInfo, setGeneralInfo] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [groupFormErrorMessage, setGroupFormErrorMessage] = useState("");

  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberErrorMessage, setMemberErrorMessage] = useState("");

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

    setGroupFormErrorMessage("");

    if (!name.trim()) {
      setGroupFormErrorMessage("Please enter a group name.");
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
        setGroupFormErrorMessage(error.response.data.errorMessage);
      } else {
        setGroupFormErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const addMember = async (event) => {
    event.preventDefault();

    setMemberErrorMessage("");

    if (!memberEmail.trim()) {
      setMemberErrorMessage("Please enter an email address.");
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
        setMemberErrorMessage(error.response.data.errorMessage);
      } else {
        setMemberErrorMessage("Something went wrong. Please try again.");
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

  const removeMember = async (userId) => {
    try {
      const response = await service.delete(
        `/groups/${groupId}/members/${userId}`,
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

  const leaveGroup = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this group?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await service.delete(`/groups/${groupId}/leave`);

      navigate("/groups");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const deleteGroup = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this group? This will also delete all tasks and activities in the group.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await service.delete(`/groups/${groupId}`);

      navigate("/groups");
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

  const isOwner = group.owners.some((owner) => owner._id === loggedUserId);

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
    // {
    //   name: "expenses",
    //   label: "Expenses",
    // },
  ];

  const disableModule = async (moduleName) => {
    try {
      const response = await service.delete(
        `/groups/${groupId}/modules/${moduleName}`,
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

  return (
    <div>
      <Link to={`/groups/${groupId}`}>← Back to group</Link>

      <h1>Group settings</h1>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {isOwner && (
        <>
          <h2>Group information</h2>

          <form onSubmit={updateGroup} noValidate>
            <div>
              <label htmlFor="name">Group name *</label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                aria-describedby={
                  groupFormErrorMessage ? "group-settings-error" : undefined
                }
              />
            </div>

            <div>
              <label htmlFor="generalInfo">General information (optional)</label>

              <textarea
                id="generalInfo"
                value={generalInfo}
                onChange={(event) => setGeneralInfo(event.target.value)}
              />
            </div>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </button>

            {groupFormErrorMessage && (
              <ErrorMessage
                id="group-settings-error"
                message={groupFormErrorMessage}
              />
            )}
          </form>
        </>
      )}

      <h2>Members</h2>

      <ul>
        {group.members.map((member) => {
          const memberIsOwner = group.owners.some(
            (owner) => owner._id === member._id,
          );

          return (
            <li key={member._id}>
              {member.username} ({member.email})
              {memberIsOwner && <span> — Owner</span>}
              {isOwner && !memberIsOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => promoteMember(member._id)}
                  >
                    Make owner
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMember(member._id)}
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {isOwner && (
        <>
          <h3>Add a member</h3>

          <form onSubmit={addMember} noValidate>
            <div>
              <label htmlFor="memberEmail">Email address *</label>

              <input
                id="memberEmail"
                type="email"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                required
                aria-describedby={
                  memberErrorMessage ? "member-form-error" : undefined
                }
              />
            </div>

            {memberErrorMessage && (
              <ErrorMessage
                id="member-form-error"
                message={memberErrorMessage}
              />
            )}

            <button type="submit" disabled={isAddingMember}>
              {isAddingMember ? "Adding..." : "Add member"}
            </button>
          </form>
        </>
      )}

      <h2>Modules</h2>

      {modules.map((module) => {
        const isEnabled = group.enabledModules.includes(module.name);

        return (
          <div key={module.name}>
            <span>{module.label}</span>

            {isEnabled ? (
              <>
                <span> Enabled</span>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => disableModule(module.name)}
                  >
                    Disable
                  </button>
                )}
              </>
            ) : (
              <button type="button" onClick={() => enableModule(module.name)}>
                Enable
              </button>
            )}
          </div>
        );
      })}
      <button type="button" onClick={leaveGroup}>
        Leave group
      </button>
      {isOwner && (
        <button type="button" onClick={deleteGroup}>
          Delete group
        </button>
      )}
    </div>
  );
}

export default GroupSettings;
