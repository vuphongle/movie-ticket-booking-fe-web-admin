import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { BaseTicketPrice, CreateBaseTicketPriceRequest, UpdateBaseTicketPriceRequest } from "@/types";
import type { RootState } from "@/app/Store";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const baseTicketPriceApi = createApi({
    reducerPath: "baseTicketPriceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    tagTypes: ['BaseTicketPrice'],
    endpoints: (builder) => ({
        getBaseTicketPrices: builder.query<BaseTicketPrice[], void>({
            query: () => 'base-ticket-prices',
            providesTags: ['BaseTicketPrice'],
        }),
        getBaseTicketPriceById: builder.query<BaseTicketPrice, number>({
            query: (id) => `base-ticket-prices/${id}`,
        }),
        createBaseTicketPrice: builder.mutation<BaseTicketPrice, CreateBaseTicketPriceRequest>({
            query: (newBaseTicketPrice) => ({
                url: 'base-ticket-prices',
                method: 'POST',
                body: newBaseTicketPrice,
            }),
            invalidatesTags: [{ type: 'BaseTicketPrice' }],
        }),
        updateBaseTicketPrice: builder.mutation<BaseTicketPrice, UpdateBaseTicketPriceRequest>({
            query: ({ id, ...updatedBaseTicketPrice }) => ({
                url: `base-ticket-prices/${id}`,
                method: 'PUT',
                body: updatedBaseTicketPrice,
            }),
            invalidatesTags: [{ type: 'BaseTicketPrice' }],
        }),
        deleteBaseTicketPrice: builder.mutation<void, number>({
            query: (id) => ({
                url: `base-ticket-prices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'BaseTicketPrice' }],
        }),
    }),
});


export const {
    useGetBaseTicketPricesQuery,
    useGetBaseTicketPriceByIdQuery,
    useCreateBaseTicketPriceMutation,
    useUpdateBaseTicketPriceMutation,
    useDeleteBaseTicketPriceMutation,
} = baseTicketPriceApi;
