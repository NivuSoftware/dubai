import { createBrowserRouter } from "react-router";
import { createElement } from "react";
import Home from "./pages/Home";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import About from "./pages/About";
import Safety from "./pages/Safety";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";

const AdminPanelRoute = () =>
  createElement(
    AdminRoute,
    null,
    createElement(AdminPanel)
  );

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/profiles",
    Component: Profiles,
  },
  {
    path: "/profile/:id",
    Component: ProfileDetail,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/safety",
    Component: Safety,
  },
  {
    path: "/contact",
    Component: Contact,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/panel",
    Component: AdminPanelRoute,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
