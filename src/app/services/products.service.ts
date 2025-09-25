import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "../Store";
import type {
  Product,
  ProductsPaginatedResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsQueryParams,
  ProductSearchParams,
} from "@/types/product.types";

const ENDPOINT = API_BASE_ADMIN;

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Product"],
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all products with optional status filter
    getProducts: builder.query<Product[], boolean | undefined>({
      query: (status) => {
        const params = new URLSearchParams();
        if (status !== undefined) {
          params.append("status", status.toString());
        }
        return `products${params.toString() ? `?${params.toString()}` : ""}`;
      },
      transformResponse: (response: any) => {
        // Handle both direct array and paginated response
        return Array.isArray(response) ? response : response?.content || [];
      },
      providesTags: ["Product"],
    }),

    // Get products with pagination
    getProductsPaginated: builder.query<
      ProductsPaginatedResponse,
      ProductsQueryParams
    >({
      query: ({ status, page = 0, size = 10, name }) => {
        const params = new URLSearchParams();
        if (status !== undefined) params.append("status", status.toString());
        if (page !== undefined) params.append("page", page.toString());
        if (size !== undefined) params.append("size", size.toString());
        if (name) params.append("name", name);

        return `products?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Search products with filters
    searchProducts: builder.query<
      ProductsPaginatedResponse,
      ProductSearchParams
    >({
      query: ({ name, status, page = 0, size = 10 }) => {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (status !== undefined) params.append("status", status.toString());
        params.append("page", page.toString());
        params.append("size", size.toString());

        return `products/search?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Get active products only
    getActiveProducts: builder.query<Product[], void>({
      query: () => "products/active",
      providesTags: ["Product"],
    }),

    // Get product by ID
    getProductById: builder.query<Product, string | number>({
      query: (productId) => `products/${productId}`,
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Get product by SKU
    getProductBySku: builder.query<Product, string>({
      query: (sku) => `products/sku/${sku}`,
      providesTags: (_result, _error, sku) => [
        { type: "Product", id: `sku-${sku}` },
      ],
    }),

    // Create new product
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (newProduct) => ({
        url: "products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update product
    updateProduct: builder.mutation<
      Product,
      { productId: string | number } & UpdateProductRequest
    >({
      query: ({ productId, ...updatedProduct }) => ({
        url: `products/${productId}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string | number>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Toggle product status
    toggleProductStatus: builder.mutation<Product, string | number>({
      query: (productId) => ({
        url: `products/${productId}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),

    // Check if SKU exists
    checkSkuExists: builder.query<
      { exists: boolean },
      { sku: string; excludeId?: string | number }
    >({
      query: ({ sku, excludeId }) => {
        const params = new URLSearchParams();
        params.append("sku", sku);
        if (excludeId) params.append("excludeId", excludeId.toString());

        return `products/check-sku?${params.toString()}`;
      },
    }),

    // Check if product can be deactivated
    checkCanDeactivateProduct: builder.query<
      { canDeactivate: boolean; message?: string },
      number
    >({
      query: (productId) => `products/${productId}/can-deactivate`,
    }),

    // Get product price
    getProductPrice: builder.query<number, string | number>({
      query: (productId) => `products/${productId}/price`,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductsPaginatedQuery,
  useSearchProductsQuery,
  useGetActiveProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySkuQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
  useCheckSkuExistsQuery,
  useLazyCheckSkuExistsQuery,
  useCheckCanDeactivateProductQuery,
  useLazyCheckCanDeactivateProductQuery,
  useGetProductPriceQuery,
} = productApi;
