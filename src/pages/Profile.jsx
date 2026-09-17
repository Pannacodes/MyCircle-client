
import { useContext } from "react";
import { AuthContext } from "./../context/auth.context";
import { Mail, UserRound } from "lucide-react";

function Profile() {
  const { loggedUsername, loggedUserEmail } = useContext(AuthContext);

  const initials = loggedUsername
    ? loggedUsername.slice(0, 2).toUpperCase()
    : "MC";

  return (
    <div className="min-h-screen bg-(--mycircle-background) px-4 py-8 text-(--mycircle-text) sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) p-5 shadow-[0_1px_3px_rgba(46,42,38,0.06)] sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--mycircle-secondary-tint) text-lg font-bold text-(--mycircle-secondary)">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-(--mycircle-primary)">
                Personal space
              </p>
              <h1 className="mt-1 text-2xl font-bold">My profile</h1>
            </div>
          </div>

          <div className="mt-8 divide-y divide-(--mycircle-border) rounded-xl border border-(--mycircle-border)">
            <div className="flex items-center gap-3 p-4">
              <UserRound
                size={19}
                className="shrink-0 text-(--mycircle-secondary)"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-(--mycircle-muted)">
                  Username
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {loggedUsername || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4">
              <Mail
                size={19}
                className="shrink-0 text-(--mycircle-secondary)"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-(--mycircle-muted)">
                  Email
                </p>
                <p className="mt-1 break-all text-sm font-semibold">
                  {loggedUserEmail || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
