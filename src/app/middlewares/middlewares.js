import { logout } from "../slices/auth.slice";

// Tự động xử lý phiên đăng nhập hết hạn hoặc token không hợp lệ
export const checkStatusMiddleware = ({ dispatch }) => (next) => (action) => {
    if (action.type.endsWith('rejected')) {
        const { payload, error } = action;
        if (error && payload.status === 401) {
            dispatch(logout());
        }
    }
    return next(action);
};