import { Link } from "react-router-dom";
import { ArrowLeft, CircleOff } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-(--mycircle-background) px-4 py-12">
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-(--mycircle-primary-tint) text-(--mycircle-primary)">
          <CircleOff size={30} />
        </div>

        <p className="text-sm font-semibold text-(--mycircle-primary)">404</p>

        <h1 className="mt-2 text-3xl font-bold text-(--mycircle-text)">
          Woops, you seem to be lost.
        </h1>

        <p className="mt-3 max-w-md text-(--mycircle-muted)">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mb-6 mt-6">
          <img
            src="/lost.gif"
            alt="A playful illustration for a page that was not found"
            className="mx-auto h-40 w-40 object-contain"
          />
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-(--mycircle-primary) px-5 text-sm font-semibold text-white transition hover:bg-(--mycircle-primary-hover)"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
