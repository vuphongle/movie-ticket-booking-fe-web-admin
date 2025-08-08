export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, record: any) => any;
}

export interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange";
  options?: SelectOption[];
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
