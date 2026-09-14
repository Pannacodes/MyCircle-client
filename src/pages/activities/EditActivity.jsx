import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";

function EditActivity() {
  const { groupId, activityId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getActivity = async () => {
    try {
      const response = await service.get(`/activities/${activityId}`);

      setTitle(response.data.title);
      setDescription(response.data.description || "");
      setCategory(response.data.category || "");
      setLocation(response.data.location || "");

      if (response.data.date) {
        setDate(response.data.date.slice(0, 10));
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
    getActivity();
  }, [activityId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!title) {
      setErrorMessage("Please enter an activity title.");
      return;
    }

    try {
      setIsSaving(true);

      await service.put(`/activities/${activityId}`, {
        title,
        description,
        category,
        date: date || undefined,
        location,
      });

      navigate(`/groups/${groupId}/activities/${activityId}`);
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
    return <p>Loading activity...</p>;
  }

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>Edit activity</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Activity title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Sport">Sport</option>
            <option value="Outdoors">Outdoors</option>
            <option value="Culture">Culture</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="date">Date</label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>

          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditActivity;
