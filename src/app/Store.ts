import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@app/slices/auth.slice";
import { authApi } from "@/app/services/auth.service";
import { userApi } from "@/app/services/users.service";
import { cinemaApi } from "@/app/services/cinemas.service";
import { auditoriumApi } from "@/app/services/auditorium.service";
import { showtimesApi } from "@/app/services/showtimes.service";
import { movieApi } from "@/app/services/movies.service";
import { scheduleApi } from "@/app/services/schedules.service";
import { couponApi } from "@/app/services/coupons.service";
import { genreApi } from "@/app/services/genres.service";
import { directorApi } from "@/app/services/directors.service";
import { actorApi } from "@/app/services/actors.service";
import { countryApi } from "@/app/services/countries.service";
import { imageApi } from "@/app/services/images.service";
import { reviewApi } from "@/app/services/reviews.service";
import { seatApi } from "@/app/services/seats.service";
import { baseTicketPriceApi } from "@/app/services/baseTicketPrice.service";
import { checkStatusMiddleware } from "@app/middlewares/middlewares";
import { tokenMiddleware } from "@app/middlewares/tokenMiddleware";

export const Store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [cinemaApi.reducerPath]: cinemaApi.reducer,
    [auditoriumApi.reducerPath]: auditoriumApi.reducer,
    [showtimesApi.reducerPath]: showtimesApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [genreApi.reducerPath]: genreApi.reducer,
    [directorApi.reducerPath]: directorApi.reducer,
    [actorApi.reducerPath]: actorApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [seatApi.reducerPath]: seatApi.reducer,
    [baseTicketPriceApi.reducerPath]: baseTicketPriceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      cinemaApi.middleware,
      auditoriumApi.middleware,
      showtimesApi.middleware,
      movieApi.middleware,
      scheduleApi.middleware,
      couponApi.middleware,
      genreApi.middleware,
      directorApi.middleware,
      actorApi.middleware,
      countryApi.middleware,
      imageApi.middleware,
      reviewApi.middleware,
      seatApi.middleware,
      baseTicketPriceApi.middleware,
      checkStatusMiddleware,
      tokenMiddleware,
    ),
});

export type RootState = ReturnType<typeof Store.getState>;
