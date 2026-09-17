import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  CalendarDays,
  CheckSquare,
  House,
  Settings,
  ShoppingBasket,
} from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import service from "../services/index.services";

const groupLinks = [
  { label: "Dashboard", icon: House, suffix: "" },
  { label: "Tasks", icon: CheckSquare, suffix: "/tasks", module: "tasks" },
  {
    label: "Activities",
    icon: CalendarDays,
    suffix: "/activities",
    module: "activities",
  },
  {
    label: "Shopping",
    icon: ShoppingBasket,
    suffix: "/shopping",
    module: "shopping",
  },
  { label: "Settings", icon: Settings, suffix: "/settings" },
];

function AppLayout({ children }) {
  const { groupId } = useParams();
  const { pathname } = useLocation();
  const [enabledModules, setEnabledModules] = useState([]);
  const isGroupRoute = Boolean(groupId);

  useEffect(() => {
    if (!groupId) {
      setEnabledModules([]);
      return;
    }

    const getEnabledModules = async () => {
      try {
        const response = await service.get(`/groups/${groupId}`);
        setEnabledModules(response.data.enabledModules || []);
      } catch (error) {
        console.log(error);
        setEnabledModules([]);
      }
    };

    const handleGroupUpdated = (event) => {
      if (event.detail?.groupId === groupId) {
        getEnabledModules();
      }
    };

    window.addEventListener("mycircle:group-updated", handleGroupUpdated);
    getEnabledModules();

    return () => {
      window.removeEventListener("mycircle:group-updated", handleGroupUpdated);
    };
  }, [groupId]);

  return (
    <>
      <Navbar />

      {isGroupRoute && (
        <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-60 border-r border-(--mycircle-border) bg-(--mycircle-surface) px-4 py-6 lg:block">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-(--mycircle-muted)">
            Your circle
          </p>

          <nav aria-label="Group navigation" className="mt-4 space-y-1">
            {groupLinks
              .filter(
                ({ module }) => !module || enabledModules.includes(module),
              )
              .map(({ label, icon: Icon, suffix }) => {
              const href = `/groups/${groupId}${suffix}`;
              const isActive =
                suffix === ""
                  ? pathname === href
                  : pathname.startsWith(href);

              return (
                <NavLink
                  key={label}
                  to={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-(--mycircle-primary-tint) text-(--mycircle-primary)"
                      : "text-(--mycircle-muted) hover:bg-(--mycircle-raised) hover:text-(--mycircle-text)"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  {label}
                </NavLink>
                );
              })}
          </nav>
        </aside>
      )}

      <main
        className={`min-h-screen pt-16 ${isGroupRoute ? "lg:ml-60" : ""}`}
      >
        {children}
      </main>
    </>
  );
}

export default AppLayout;
