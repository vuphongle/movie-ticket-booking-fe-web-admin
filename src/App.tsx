import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { Dashboard } from "@pages/index";
import AppLayout from "@components/layout/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="admin/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
