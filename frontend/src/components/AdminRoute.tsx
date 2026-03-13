import { Navigate } from "react-router";
import { ReactElement } from "react";
import { ADMIN_TOKEN_KEY } from "../services/authService";

interface AdminRouteProps {
  children: ReactElement;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
