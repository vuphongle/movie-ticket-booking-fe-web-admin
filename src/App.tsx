import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Dashboard,
  Login,
  RevenueByCinema,
  RevenueByMovie,
  ForgotPassword,
  ChangePassword,
} from "@/pages/index";
import AppLayout from "@/components/layout/AppLayout";
import PrivateRoutes from "@/components/private/PrivateRoutes";
import AuthorizeRoutes from "@/components/private/AuthorizeRoutes";
import ShowTimesList from "@/pages/showtimes/ShowTimesList";
import ScheduleList from "@pages/schedule/ScheduleList";
import CouponList from "@pages/coupon/CouponList";
import MovieList from "@/pages/movie/movie-list/MovieList";
import MovieDetail from "@/pages/movie/movie-detail/MovieDetail";
import MovieCreate from "@/pages/movie/movie-create/MovieCreate";
import CinemaList from "@/pages/cinema/cinema-list/CinemaList";
import CinemaDetail from "@/pages/cinema/cinema-detail/CinemaDetail";
import CinemaCreate from "@/pages/cinema/cinema-create/CinemaCreate";
import BasePriceList from "./pages/ticket-price/base-price/BasePriceList";

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
          <Route path="/admin" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cinemas">
              <Route index element={<CinemaList />} />
              <Route path=":cinemaId/detail" element={<CinemaDetail />} />
              <Route path="create" element={<CinemaCreate />} />
            </Route>
            <Route path="movies">
              <Route index element={<MovieList />} />
              <Route path=":movieId/detail" element={<MovieDetail />} />
              <Route path="create" element={<MovieCreate />} />
            </Route>
            <Route path="revenue/cinema" element={<RevenueByCinema />} />
            <Route path="revenue/movie" element={<RevenueByMovie />} />
            <Route path="ticket-prices">
              <Route path="base-price" element={<BasePriceList />} />
            </Route>
            <Route path="showtimes" element={<ShowTimesList />} />
            <Route path="schedules" element={<ScheduleList />} />
            <Route path="coupons" element={<CouponList />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
