import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@app/slices/auth.slice";
import { authApi } from "@/app/services/auth.service";
import { userApi } from "@/app/services/users.service";
import { checkStatusMiddleware } from "@app/middlewares/middlewares";
import { tokenMiddleware } from "@app/middlewares/tokenMiddleware";

export const Store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      checkStatusMiddleware,
      tokenMiddleware,
    ),
});

export type RootState = ReturnType<typeof Store.getState>;
