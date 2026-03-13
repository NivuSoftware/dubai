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
import AdvertiserPanel from "./pages/AdvertiserPanel";
import AdvertiserRegister from "./pages/AdvertiserRegister";
import AdminRoute from "./components/AdminRoute";
import AdvertiserRoute from "./components/AdvertiserRoute";

const AdminPanelRoute = () =>
  createElement(
    AdminRoute,
    null,
    createElement(AdminPanel)
  );

const AdvertiserPanelRoute = () =>
  createElement(
    AdvertiserRoute,
    null,
    createElement(AdvertiserPanel)
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
    path: "/login",
    Component: AdminLogin,
  },
  {
    path: "/registro-anunciante",
    Component: AdvertiserRegister,
  },
  {
    path: "/admin/panel",
    Component: AdminPanelRoute,
  },
  {
    path: "/advertiser/panel",
    Component: AdvertiserPanelRoute,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
