import { jwtDecode } from "jwt-decode";
import { logout } from "../slices/auth.slice";
import type { AnyAction, MiddlewareAPI, Dispatch } from "@reduxjs/toolkit";

export const tokenMiddleware =
  (store: MiddlewareAPI) =>
  (next: Dispatch<AnyAction>) =>
  (action: AnyAction) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      const decodedToken = jwtDecode<{ exp?: number }>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp !== undefined && decodedToken.exp < currentTime) {
        store.dispatch(logout());
      }
    }

    return next(action);
  };
