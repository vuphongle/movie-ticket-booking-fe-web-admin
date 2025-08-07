import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Dashboard,
  Login,
  RevenueByCinema,
  RevenueByMovie,
} from "@pages/index";
import AppLayout from "@components/layout/AppLayout";
import PrivateRoutes from "@components/private/PrivateRoutes";
import AuthorizeRoutes from "@/components/private/AuthorizeRoutes";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route
          element={<AuthorizeRoutes requireRoles={["ADMIN", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/" element={<AppLayout />}>
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/revenue/cinema" element={<RevenueByCinema />} />
            <Route path="admin/revenue/movie" element={<RevenueByMovie />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<Login />} />
    </Routes>
  );
}

export default App;
