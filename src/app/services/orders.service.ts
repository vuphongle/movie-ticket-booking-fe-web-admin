import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@data/constants";
import type { RootState } from "@/app/Store";
import type { Order } from "@/types/order.types";

const ENDPOINT = API_BASE_ADMIN;

export const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: ["Order"],
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
        getOrders: builder.query<Order[], void>({
            query: () => "orders",
            providesTags: ["Order"],
        }),
        getOrderById: builder.query<Order, number>({
            query: (orderId) => `orders/${orderId}`,
            providesTags: (_result, _error, orderId) => [
                { type: "Order", id: orderId },
            ],
        }),
        createOrder: builder.mutation<Order, Partial<Order>>({
            query: (newOrder) => ({
                url: "orders",
                method: "POST",
                body: newOrder,
            }),
            invalidatesTags: ["Order"],
        }),
        updateOrder: builder.mutation<Order, { orderId: number } & Partial<Order>>({
            query: ({ orderId, ...updatedOrder }) => ({
                url: `orders/${orderId}`,
                method: "PUT",
                body: updatedOrder,
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: "Order", id: orderId },
            ],
        }),
        deleteOrder: builder.mutation<void, number>({
            query: (orderId) => ({
                url: `orders/${orderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
