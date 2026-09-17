import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OnlyPrivate from "./components/OnlyPrivate";
import AppLayout from "./components/AppLayout";
import Groups from "./pages/groups/Groups";
import CreateGroup from "./pages/groups/CreateGroup";
import GroupDetails from "./pages/groups/GroupDetails";
import GroupSettings from "./pages/groups/GroupSettings";
import Tasks from "./pages/tasks/Tasks";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";
import Activities from "./pages/activities/Activities";
import CreateActivity from "./pages/activities/CreateActivity";
import EditActivity from "./pages/activities/EditActivity";
import Shopping from "./pages/shopping/Shopping";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Home />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/profile"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Profile />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Groups />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/create"
        element={
          <OnlyPrivate>
            <AppLayout>
              <CreateGroup />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <OnlyPrivate>
            <AppLayout>
              <GroupDetails />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/settings"
        element={
          <OnlyPrivate>
            <AppLayout>
              <GroupSettings />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/tasks"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/tasks/create"
        element={
          <OnlyPrivate>
            <AppLayout>
              <CreateTask />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/tasks/:taskId/edit"
        element={
          <OnlyPrivate>
            <AppLayout>
              <EditTask />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/activities"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Activities />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/activities/create"
        element={
          <OnlyPrivate>
            <AppLayout>
              <CreateActivity />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/activities/:activityId/edit"
        element={
          <OnlyPrivate>
            <AppLayout>
              <EditActivity />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="/groups/:groupId/shopping"
        element={
          <OnlyPrivate>
            <AppLayout>
              <Shopping />
            </AppLayout>
          </OnlyPrivate>
        }
      />
      <Route
        path="*"
        element={
          <OnlyPrivate>
            <AppLayout>
              <NotFound />
            </AppLayout>
          </OnlyPrivate>
        }
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
