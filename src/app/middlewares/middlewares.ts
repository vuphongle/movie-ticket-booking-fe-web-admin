import { logout } from "../slices/auth.slice";
import type { AnyAction, MiddlewareAPI, Dispatch } from "@reduxjs/toolkit";

// Middleware to check HTTP status code
export const checkStatusMiddleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (action.type.endsWith('rejected')) {
        const { payload, error } = action;
        if (error && payload.status === 401) {
            dispatch(logout());
        }
    }
    return next(action);
};