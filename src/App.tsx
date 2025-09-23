import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Dashboard,
  Login,
  RevenueByCinema,
  RevenueByMovie,
  ForgotPassword,
  ChangePassword,
  ProductList,
  ProductCreate,
  ProductDetail,
} from "@/pages/index";
import AppLayout from "@/components/layout/AppLayout";
import PrivateRoutes from "@/components/private/PrivateRoutes";
import AuthorizeRoutes from "@/components/private/AuthorizeRoutes";
import ShowTimesList from "@/pages/showtimes/ShowTimesList";
import ScheduleList from "@pages/schedule/ScheduleList";
import CouponList from "@pages/coupon/CouponList";
import CouponForm from "@pages/coupon/CouponForm";
import CouponDetail from "@pages/coupon/coupon-detail/CouponDetail";
import MovieList from "@/pages/movie/movie-list/MovieList";
import MovieDetail from "@/pages/movie/movie-detail/MovieDetail";
import MovieCreate from "@/pages/movie/movie-create/MovieCreate";
import CinemaList from "@/pages/cinema/cinema-list/CinemaList";
import CinemaDetail from "@/pages/cinema/cinema-detail/CinemaDetail";
import CinemaCreate from "@/pages/cinema/cinema-create/CinemaCreate";
import PriceListPage from "@/pages/price-management/price-list/PriceListPage";
import PriceListDetail from "@/pages/price-management/price-list/PriceListDetail";
import AdditionalServiceCreate from "@/pages/additional-service/additional-service-create/AdditionalServiceCreate";
import AdditionalServiceList from "@/pages/additional-service/additional-service-list/AdditionalServiceList";
import AdditionalServiceDetail from "@/pages/additional-service/additional-service-detail/AdditionalServiceDetail";
import GenreList from "@/pages/genre-list/GenreList";
import CountryList from "./pages/country-list/CountryList";

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
            <Route path="price-lists">
              <Route index element={<PriceListPage />} />
              <Route path=":priceListId/detail" element={<PriceListDetail />} />
            </Route>
            <Route path="showtimes" element={<ShowTimesList />} />
            <Route path="schedules" element={<ScheduleList />} />
            <Route path="coupons">
              <Route index element={<CouponList />} />
              <Route path="create" element={<CouponForm />} />
              <Route path=":id/edit" element={<CouponForm />} />
              <Route path=":couponId/detail" element={<CouponDetail />} />
            </Route>
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="additional-services">
              <Route index element={<AdditionalServiceList />} />
              <Route
                path=":additionalServiceId/detail"
                element={<AdditionalServiceDetail />}
              />
              <Route path="create" element={<AdditionalServiceCreate />} />
            </Route>
            <Route path="genres">
              <Route index element={<GenreList />} />
            </Route>
            <Route path="countries">
              <Route index element={<CountryList />} />
            </Route>
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path=":productId/detail" element={<ProductDetail />} />
              <Route path="create" element={<ProductCreate />} />
            </Route>
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
