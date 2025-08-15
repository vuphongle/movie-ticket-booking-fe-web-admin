// Kiểu dữ liệu lỗi từ API
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Base query error type
export interface BaseQueryError {
  status: number;
  data: ApiError;
}
