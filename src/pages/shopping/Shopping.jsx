import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import service from "../../services/index.services";

function Shopping() {
  const { groupId } = useParams();

  const [shoppingItems, setShoppingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [itemName, setItemName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const getShoppingItems = async () => {
    try {
      const response = await service.get(`/shopping?group=${groupId}`);

      setShoppingItems(response.data);
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

  const createShoppingItem = async (event) => {
    event.preventDefault();

    if (!itemName.trim()) {
      return;
    }

    try {
      setIsCreating(true);

      const response = await service.post("/shopping", {
        name: itemName,
        group: groupId,
      });

      setShoppingItems((currentItems) => [response.data, ...currentItems]);

      setItemName("");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errorMessage) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const toggleShoppingItem = async (shoppingItem) => {
    try {
      const response = await service.put(`/shopping/${shoppingItem._id}`, {
        name: shoppingItem.name,
        completed: !shoppingItem.completed,
      });

      setShoppingItems((currentItems) =>
        currentItems.map((item) =>
          item._id === shoppingItem._id ? response.data : item,
        ),
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

  const deleteShoppingItem = async (shoppingItemId) => {
    try {
      await service.delete(`/shopping/${shoppingItemId}`);

      setShoppingItems((currentItems) =>
        currentItems.filter((item) => item._id !== shoppingItemId),
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

  useEffect(() => {
    getShoppingItems();
  }, [groupId]);

  if (isLoading) {
    return <p>Loading shopping list...</p>;
  }

  if (errorMessage) {
    return (
      <div className="min-h-full bg-(--mycircle-background) px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ErrorMessage message={errorMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--mycircle-background) px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to={`/groups/${groupId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-(--mycircle-muted) transition hover:text-(--mycircle-primary)"
        >
          <ArrowLeft size={18} />
          Back to group
        </Link>

        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--mycircle-secondary-tint) text-(--mycircle-secondary)">
            <ShoppingCart size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-(--mycircle-text)">
              Shopping
            </h1>

            <p className="mt-1 text-sm text-(--mycircle-muted)">
              Keep track of what your circle needs.
            </p>
          </div>
        </div>

        {shoppingItems.length === 0 ? (
          <p>No shopping items yet.</p>
        ) : (
          <ul>
            {shoppingItems.map((item) => (
              <li key={item._id}>
                <button type="button" onClick={() => toggleShoppingItem(item)}>
                  {item.completed ? "✓" : "○"}
                </button>
                {item.name}
                <button
                  type="button"
                  onClick={() => deleteShoppingItem(item._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={createShoppingItem}>
          <input
            type="text"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="What do you need?"
          />

          <button type="submit" disabled={isCreating}>
            {isCreating ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Shopping;
