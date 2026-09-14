import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import service from "../../services/index.services";

function CreateActivity() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!title) {
      setErrorMessage("Please enter an activity title.");
      return;
    }

    try {
      setIsLoading(true);

      await service.post("/activities", {
        title,
        description,
        category,
        date: date || undefined,
        location,
        group: groupId,
      });

      navigate(`/groups/${groupId}/activities`);
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

      <h1>Create an activity</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Activity title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter an activity"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a description"
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
            placeholder="Where is it?"
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create activity"}
        </button>
      </form>
    </div>
  );
}

export default CreateActivity;
