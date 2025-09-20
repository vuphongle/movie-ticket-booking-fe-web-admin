import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "../../data/constants";
import type { RootState } from "../Store";
import type { 
    Coupon, 
    CouponDetail,
    UpsertCouponRequest, 
    UpsertCouponDetailRequest,
    CouponPreviewRequest,
    CouponPreviewResponse,
    CouponApplyRequest,
    CouponApplyResponse,
    RedemptionConfirmRequest
} from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const couponApi = createApi({
    reducerPath: "couponApi",
    tagTypes: ['Coupon', 'CouponDetail'],
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
        // Header endpoints
        getCoupons: builder.query<Coupon[], void>({
            query: () => 'coupons',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Coupon' as const, id })),
                        { type: 'Coupon', id: 'LIST' },
                    ]
                    : [{ type: 'Coupon', id: 'LIST' }],
        }),
        getCouponById: builder.query<Coupon, number>({
            query: (id) => `coupons/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Coupon', id }],
        }),
        createCoupon: builder.mutation<Coupon, UpsertCouponRequest>({
            query: (newCoupon) => ({
                url: 'coupons',
                method: 'POST',
                body: newCoupon,
            }),
            invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
        }),
        updateCoupon: builder.mutation<Coupon, { id: number } & UpsertCouponRequest>({
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
        deleteCoupon: builder.mutation<void, number>({
            query: (id) => ({
                url: `coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Coupon', id },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
        duplicateCoupon: builder.mutation<Coupon, number>({
            query: (id) => ({
                url: `coupons/${id}/duplicate`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
        }),

        // Detail endpoints
        getCouponDetails: builder.query<CouponDetail[], number>({
            query: (couponId) => `coupons/${couponId}/details`,
            providesTags: (result, _error, couponId) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'CouponDetail' as const, id })),
                        { type: 'CouponDetail', id: `LIST-${couponId}` },
                    ]
                    : [{ type: 'CouponDetail', id: `LIST-${couponId}` }],
        }),
        createCouponDetail: builder.mutation<CouponDetail, { couponId: number } & UpsertCouponDetailRequest>({
            query: ({ couponId, ...detail }) => ({
                url: `coupons/${couponId}/details`,
                method: 'POST',
                body: detail,
            }),
            invalidatesTags: (_result, _error, { couponId }) => [
                { type: 'CouponDetail', id: `LIST-${couponId}` },
                { type: 'Coupon', id: couponId },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
        updateCouponDetail: builder.mutation<CouponDetail, { detailId: number } & UpsertCouponDetailRequest>({
            query: ({ detailId, ...detail }) => ({
                url: `coupon-details/${detailId}`,
                method: 'PUT',
                body: detail,
            }),
            invalidatesTags: (_result, _error, { detailId }) => [
                { type: 'CouponDetail', id: detailId },
                { type: 'CouponDetail', id: 'LIST' },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
        deleteCouponDetail: builder.mutation<void, number>({
            query: (detailId) => ({
                url: `coupon-details/${detailId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, _detailId) => [
                { type: 'CouponDetail', id: _detailId },
                { type: 'CouponDetail', id: 'LIST' },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
        duplicateCouponDetail: builder.mutation<CouponDetail, number>({
            query: (detailId) => ({
                url: `coupon-details/${detailId}/duplicate`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, _detailId) => [
                { type: 'CouponDetail', id: 'LIST' },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),

        // Preview & Apply endpoints
        previewCoupon: builder.mutation<CouponPreviewResponse, { couponId: number } & CouponPreviewRequest>({
            query: ({ couponId, ...previewData }) => ({
                url: `coupons/${couponId}/preview`,
                method: 'POST',
                body: previewData,
            }),
        }),
        applyCoupon: builder.mutation<CouponApplyResponse, CouponApplyRequest>({
            query: (applyData) => ({
                url: 'coupons/apply',
                method: 'POST',
                body: applyData,
            }),
        }),

        // Redemption endpoints
        confirmRedemption: builder.mutation<void, RedemptionConfirmRequest>({
            query: (confirmData) => ({
                url: 'redemptions/confirm',
                method: 'POST',
                body: confirmData,
            }),
            invalidatesTags: [
                { type: 'CouponDetail', id: 'LIST' },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
        revertRedemption: builder.mutation<void, RedemptionConfirmRequest>({
            query: (revertData) => ({
                url: 'redemptions/revert',
                method: 'POST',
                body: revertData,
            }),
            invalidatesTags: [
                { type: 'CouponDetail', id: 'LIST' },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    // Header hooks
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useDuplicateCouponMutation,

    // Detail hooks
    useGetCouponDetailsQuery,
    useCreateCouponDetailMutation,
    useUpdateCouponDetailMutation,
    useDeleteCouponDetailMutation,
    useDuplicateCouponDetailMutation,

    // Preview & Apply hooks
    usePreviewCouponMutation,
    useApplyCouponMutation,

    // Redemption hooks
    useConfirmRedemptionMutation,
    useRevertRedemptionMutation,
} = couponApi;
