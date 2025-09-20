// Product entity types
export interface Product {
  id: string | number;
  sku: string;
  name: string;
  description?: string;
  unit?: string;
  quantity?: number; // Số lượng tồn kho
  thumbnail?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Form data types
export interface ProductFormData {
  sku: string;
  name: string;
  description?: string;
  unit?: string;
  quantity?: number;
  thumbnail?: string;
  status: boolean;
}

// Request types for API
export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  unit?: string;
  quantity?: number;
  thumbnail?: string;
  status: boolean;
}

export interface UpdateProductRequest {
  sku: string;
  name: string;
  description?: string;
  unit?: string;
  quantity?: number;
  thumbnail?: string;
  status: boolean;
}

// Response types
export interface ProductResponse {
  id: string | number;
  sku: string;
  name: string;
  description?: string;
  unit?: string;
  quantity?: number;
  thumbnail?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ProductsListResponse {
  data: Product[];
  total?: number;
}

export interface ProductsPaginatedResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Query parameters
export interface ProductsQueryParams {
  status?: boolean;
  page?: number;
  size?: number;
  name?: string;
}

export interface ProductSearchParams {
  name?: string;
  status?: boolean;
  page?: number;
  size?: number;
}

// Component props interfaces
export interface ProductTableProps {
  data?: Product[];
  loading?: boolean;
}

export interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (values: ProductFormData) => void;
  loading?: boolean;
}

// Utility types
export interface ProductSelectOption {
  label: string;
  value: string | number;
}

export interface ProductStatusOption {
  label: string;
  value: boolean;
}

// Error types
export interface ProductApiError {
  message: string;
  errors?: string[];
  status?: number;
}

// Filter types
export interface ProductFilters {
  name?: string;
  status?: boolean;
}

// Sort types
export interface ProductSort {
  field: keyof Product;
  order: 'asc' | 'desc';
}

// Table column types
export interface ProductTableColumn {
  title: string;
  dataIndex: keyof Product;
  key: string;
  render?: (text: any, record: Product) => React.ReactNode;
  sorter?: boolean | ((a: Product, b: Product) => number);
  width?: string | number;
}