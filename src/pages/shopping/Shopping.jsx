import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import service from "../../services/index.services";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--mycircle-background) text-sm text-(--mycircle-muted)">
        Loading shopping list...
      </div>
    );
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
          <EmptyState
            icon={ShoppingCart}
            title="Your shopping list is clear."
            description="Add something your circle needs to pick up."
            action={
              <a
                href="#shopping-item"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--mycircle-secondary) px-5 text-sm font-semibold text-white hover:brightness-95"
              >
                <Plus size={18} aria-hidden="true" />
                Add an item
              </a>
            }
          />
        ) : (
          <ul className="space-y-3">
            {shoppingItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-3 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(46,42,38,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => toggleShoppingItem(item)}
                  aria-label={
                    item.completed
                      ? `Mark ${item.name} as needed`
                      : `Mark ${item.name} as complete`
                  }
                  className="shrink-0 rounded-full"
                >
                  {item.completed ? (
                    <CheckCircle2
                      size={21}
                      className="text-(--mycircle-success)"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      size={21}
                      className="text-(--mycircle-secondary)"
                      aria-hidden="true"
                    />
                  )}
                </button>

                <span
                  className={`flex-1 text-sm font-semibold ${
                    item.completed
                      ? "text-(--mycircle-muted) line-through"
                      : ""
                  }`}
                >
                  {item.name}
                </span>

                <button
                  type="button"
                  onClick={() => deleteShoppingItem(item._id)}
                  aria-label={`Delete ${item.name}`}
                  className="rounded-lg p-2 text-(--mycircle-muted) hover:text-(--mycircle-error)"
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          id="shopping-item"
          onSubmit={createShoppingItem}
          className="mt-6 flex flex-col gap-3 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-4 sm:flex-row"
        >
          <input
            type="text"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="What do you need?"
            className="h-11 min-w-0 flex-1 rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-base outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-secondary) focus:ring-2 focus:ring-(--mycircle-secondary-tint)"
          />

          <Button type="submit" disabled={isCreating} variant="secondary">
            {isCreating ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Shopping;
