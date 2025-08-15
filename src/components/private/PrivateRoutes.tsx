import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "@app/Store";

function PrivateRoutes() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/admin/forgot-password") {
    return <Navigate to={"/admin/login"} />;
  }

  return <Outlet />;
}

export default PrivateRoutes;
