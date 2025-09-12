import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "../../data/constants";
import type { RootState } from "../Store";
import type { Coupon, CreateCouponRequest, UpdateCouponRequest } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const couponApi = createApi({
    reducerPath: "couponApi",
    tagTypes: ['Coupon'],
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        getCoupons: builder.query<Coupon[], void>({
            query: () => 'coupons',
            providesTags: ['Coupon'],
        }),
        getCouponById: builder.query<Coupon, string>({
            query: (id) => `coupons/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Coupon', id }],
        }),
        createCoupon: builder.mutation<Coupon, CreateCouponRequest>({
            query: (newCoupon) => ({
                url: 'coupons',
                method: 'POST',
                body: newCoupon,
            }),
            invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
        }),
        updateCoupon: builder.mutation<Coupon, UpdateCouponRequest>({
            query: ({ id, ...updatedCoupon }) => ({
                url: `coupons/${id}`,
                method: 'PUT',
                body: updatedCoupon,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Coupon', id },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
        deleteCoupon: builder.mutation<void, string>({
            query: (id) => ({
                url: `coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Coupon', id },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
    }),
});


export const {
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponApi;
