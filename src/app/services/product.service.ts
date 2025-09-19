import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "@/data/constants";
import type { Product } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = `${API_DOMAIN}/products`;

export const productApi = createApi({
    reducerPath: "productApi",
    tagTypes: ["Product"],
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as { auth: { accessToken: string } };
            const token = state.auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => "",
            providesTags: ["Product"],
        }),
        getProductsByStatus: builder.query<Product[], boolean>({
            query: (status) => `status/${status}`,
            providesTags: ["Product"],
        }),
        getProductById: builder.query<Product, number>({
            query: (productId) => `${productId}`,
            providesTags: (_result, _error, productId) => [
                { type: "Product", id: productId },
            ],
        }),
        getProductBySku: builder.query<Product, string>({
            query: (sku) => `sku/${sku}`,
            providesTags: (_result, _error, sku) => [
                { type: "Product", id: sku },
            ],
        }),
        searchProductsByName: builder.query<Product[], string>({
            query: (name) => `search?name=${encodeURIComponent(name)}`,
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation<Product, Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
            query: (newProduct) => ({
                url: "",
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation<Product, { productId: number } & Partial<Product>>({
            query: ({ productId, ...updatedProduct }) => ({
                url: `${productId}`,
                method: "PUT",
                body: updatedProduct,
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                { type: "Product", id: productId },
            ],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (productId) => ({
                url: `${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        toggleProductStatus: builder.mutation<Product, number>({
            query: (productId) => ({
                url: `${productId}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: (_result, _error, productId) => [
                { type: "Product", id: productId },
            ],
        }),
        getProductPrice: builder.query<number, number>({
            query: (productId) => `${productId}/price`,
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetProductsQuery,
    useGetProductsByStatusQuery,
    useGetProductByIdQuery,
    useGetProductBySkuQuery,
    useSearchProductsByNameQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useToggleProductStatusMutation,
    useGetProductPriceQuery,
} = productApi;