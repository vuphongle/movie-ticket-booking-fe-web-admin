import { jwtDecode } from "jwt-decode";
import { logout } from '../slices/auth.slice';

//Kiểm tra token còn hạn hay không và từ đó tự động đăng xuất
export const tokenMiddleware = store => next => action => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decodedToken.exp < currentTime) {
            store.dispatch(logout());
        }
    }

    return next(action);
};