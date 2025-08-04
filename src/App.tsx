import "./App.css";
import { Route, Routes } from "react-router-dom";
// import AppLayout from "@components/layout/AppLayout";
import Overview from "@pages/dashboard/OverView";
import RevenueCinema from "@pages/dashboard/RevenueCinema";
import RevenueMovie from "@pages/dashboard/RevenueMovie";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<AppLayout />}> */}
        <Route path="/" element={<Overview />} />
        <Route path="revenue-cinema" element={<RevenueCinema />} />
        <Route path="revenue-movie" element={<RevenueMovie />} />

        {/* Thêm các route khác tại đây .....*/}
      {/* </Route> */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
