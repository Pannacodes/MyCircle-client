import { CircleAlert } from "lucide-react";

function ErrorMessage({
  message = "Something went wrong. Please try again.",
  id,
}) {
  return (
    <div
      id={id}
      className="flex items-start gap-3 rounded-xl border border-(--mycircle-error) bg-(--mycircle-surface) p-4"
    >
      <CircleAlert
        size={20}
        className="mt-0.5 shrink-0 text-(--mycircle-error)"
      />

      <div>
        <p className="text-sm font-semibold text-(--mycircle-text)">
          Something went wrong
        </p>

        <p className="mt-1 text-sm text-(--mycircle-muted)">
          {message}
        </p>
      </div>
    </div>
  );
}

export default ErrorMessage;