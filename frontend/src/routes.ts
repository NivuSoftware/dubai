import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import About from "./pages/About";
import Safety from "./pages/Safety";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

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
    path: "*",
    Component: NotFound,
  },
]);
