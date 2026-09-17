import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import service from "../../services/index.services";
import { AuthContext } from "../../context/auth.context";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";

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
      window.dispatchEvent(
        new CustomEvent("mycircle:group-updated", { detail: { groupId } }),
      );
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--mycircle-background) text-sm text-(--mycircle-muted)">
        Loading group settings...
      </div>
    );
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
      window.dispatchEvent(
        new CustomEvent("mycircle:group-updated", { detail: { groupId } }),
      );
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
    <div className="min-h-screen bg-(--mycircle-background) px-4 py-8 text-(--mycircle-text) sm:px-6">
      <div className="mx-auto max-w-4xl">
      <Link
        to={`/groups/${groupId}`}
        className="text-sm font-semibold text-(--mycircle-muted) hover:text-(--mycircle-primary)"
      >
        ← Back to group
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-(--mycircle-primary)">Your circle</p>
        <h1 className="mt-1 text-3xl font-bold">Group settings</h1>
        <p className="mt-2 text-sm text-(--mycircle-muted)">Shape how this shared space works.</p>
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {isOwner && (
        <section className="mt-7 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:p-6">
          <h2 className="text-lg font-semibold">Group information</h2>

          <form onSubmit={updateGroup} noValidate className="mt-5 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                Group name <span className="text-(--mycircle-error)">*</span>
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                aria-describedby={
                  groupFormErrorMessage ? "group-settings-error" : undefined
                }
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
              />
            </div>

            <div>
              <label htmlFor="generalInfo" className="mb-2 block text-sm font-semibold">
                General information <span className="font-normal text-(--mycircle-muted)">(optional)</span>
              </label>

              <textarea
                id="generalInfo"
                value={generalInfo}
                onChange={(event) => setGeneralInfo(event.target.value)}
                rows={4}
                className="w-full resize-y rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 py-3 text-base outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
              />
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>

            {groupFormErrorMessage && (
              <ErrorMessage
                id="group-settings-error"
                message={groupFormErrorMessage}
              />
            )}
          </form>
        </section>
      )}

      <section className="mt-5 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Members</h2>

      <ul className="mt-4 divide-y divide-(--mycircle-border)">
        {group.members.map((member) => {
          const memberIsOwner = group.owners.some(
            (owner) => owner._id === member._id,
          );

          return (
            <li key={member._id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{member.username}</p>
                <p className="mt-1 text-sm text-(--mycircle-muted)">{member.email}</p>
                {memberIsOwner && <span className="mt-2 inline-flex rounded-full bg-(--mycircle-primary-tint) px-2.5 py-1 text-xs font-semibold text-(--mycircle-primary)">Owner</span>}
              </div>
              {isOwner && !memberIsOwner && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => promoteMember(member._id)}
                    className="rounded-lg border border-(--mycircle-border) px-3 py-2 text-xs font-semibold hover:bg-(--mycircle-raised)"
                  >
                    Make owner
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMember(member._id)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-(--mycircle-error) hover:bg-(--mycircle-raised)"
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {isOwner && (
        <div className="mt-6 border-t border-(--mycircle-border) pt-6">
          <h3 className="text-sm font-semibold">Add a member</h3>

          <form onSubmit={addMember} noValidate className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label htmlFor="memberEmail" className="mb-2 block text-sm font-semibold">
                Email address <span className="text-(--mycircle-error)">*</span>
              </label>

              <input
                id="memberEmail"
                type="email"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                required
                aria-describedby={
                  memberErrorMessage ? "member-form-error" : undefined
                }
                className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
              />
            </div>

            {memberErrorMessage && (
              <ErrorMessage
                id="member-form-error"
                message={memberErrorMessage}
              />
            )}

            <Button type="submit" disabled={isAddingMember}>
              {isAddingMember ? "Adding..." : "Add member"}
            </Button>
          </form>
        </div>
      )}
      </section>

      <section className="mt-5 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Modules</h2>

      <div className="mt-4 space-y-3">
      {modules.map((module) => {
        const isEnabled = group.enabledModules.includes(module.name);

        return (
          <div key={module.name} className="flex items-center justify-between gap-3 rounded-lg border border-(--mycircle-border) p-3">
            <span className="text-sm font-semibold">{module.label}</span>

            {isEnabled ? (
              <>
                <span className="mr-2 text-xs font-semibold text-(--mycircle-success)">Enabled</span>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => disableModule(module.name)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-(--mycircle-error) hover:bg-(--mycircle-raised)"
                  >
                    Disable
                  </button>
                )}
              </>
            ) : (
              <button type="button" onClick={() => enableModule(module.name)} className="rounded-lg border border-(--mycircle-border) px-3 py-2 text-xs font-semibold hover:bg-(--mycircle-raised)">
                Enable
              </button>
            )}
          </div>
        );
      })}
      </div>
      </section>
      <div className="mt-6 flex flex-wrap gap-3 border-t border-(--mycircle-border) pt-6">
      <button type="button" onClick={leaveGroup} className="rounded-xl border border-(--mycircle-border) px-4 py-2.5 text-sm font-semibold hover:bg-(--mycircle-raised)">
        Leave group
      </button>
      {isOwner && (
        <button type="button" onClick={deleteGroup} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-(--mycircle-error) hover:bg-(--mycircle-raised)">
          Delete group
        </button>
      )}
      </div>
      </div>
    </div>
  );
}

export default GroupSettings;
