import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@app/slices/auth.slice";

export const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
