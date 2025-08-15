// Kiểu dữ liệu cho user
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar: string;
}

// Kiểu dữ liệu truyền vào login
export interface LoginRequest {
  email: string;
  password: string;
}

// Kiểu dữ liệu phản hồi từ login
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Kiểu dữ liệu truyền vào đăng ký  
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string; // Optional cho form validation
}

// Kiểu dữ liệu quên mật khẩu
export interface ForgotPasswordRequest {
  email: string;
}

// Kiểu dữ liệu đổi mật khẩu
export interface ChangePasswordRequest {
  token: string;
  newPassword: string;
}

// Auth state cho Redux
export interface AuthState {
  auth: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
}
