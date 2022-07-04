import React, { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../services/context/UserAuthContext";

export const ProtectedRoute: FC = () => {
  const { user } = useUserAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
