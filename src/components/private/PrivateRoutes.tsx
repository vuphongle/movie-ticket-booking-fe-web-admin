import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import type { RootState } from "../../app/Store";

function PrivateRoutes() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/admin/login"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default PrivateRoutes;
