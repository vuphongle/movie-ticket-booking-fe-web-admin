import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { Dashboard, Login } from "@pages/index";
import AppLayout from "@components/layout/AppLayout";
import PrivateRoutes from "@components/private/PrivateRoutes";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="admin/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
    </Routes>
  );
}

export default App;
