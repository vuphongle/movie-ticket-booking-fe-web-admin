import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@app/slices/auth.slice";
import { authApi } from "@/app/services/auth.service";
import { userApi } from "@/app/services/users.service";
import { cinemaApi } from "@/app/services/cinemas.service";
import { auditoriumApi } from "@/app/services/auditorium.service";
import { showtimesApi } from "@/app/services/showtimes.service";
import { movieApi } from "@/app/services/movies.service";
import { scheduleApi } from "@/app/services/schedules.service";
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
      checkStatusMiddleware,
      tokenMiddleware,
    ),
});

export type RootState = ReturnType<typeof Store.getState>;
