import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "../../data/constants";
import type { RootState } from "../Store";
import type {
  Coupon,
  CouponDetail,
  CouponDetailRule,
  UpsertCouponRequest,
  UpsertCouponDetailRequest,
  UpsertCouponDetailRuleRequest,
} from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const couponApi = createApi({
  reducerPath: "couponApi",
  tagTypes: ["Coupon", "CouponDetail", "CouponDetailRule"],
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
    // COUPON endpoints
    getCoupons: builder.query<Coupon[], void>({
      query: () => "admin/coupons",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Coupon" as const, id })),
              { type: "Coupon", id: "LIST" },
            ]
          : [{ type: "Coupon", id: "LIST" }],
    }),
    getCouponById: builder.query<Coupon, number>({
      query: (id) => `admin/coupons/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Coupon", id }],
    }),
    createCoupon: builder.mutation<Coupon, UpsertCouponRequest>({
      query: (newCoupon) => ({
        url: "admin/coupons",
        method: "POST",
        body: newCoupon,
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    updateCoupon: builder.mutation<
      Coupon,
      { id: number } & UpsertCouponRequest
    >({
      query: ({ id, ...updatedCoupon }) => ({
        url: `admin/coupons/${id}`,
        method: "PUT",
        body: updatedCoupon,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    deleteCoupon: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),

    // COUPON DETAIL endpoints
    getCouponDetails: builder.query<CouponDetail[], number>({
      query: (couponId) => ({
        url: "admin/coupon-details",
        params: { couponId },
      }),
      providesTags: (result, _error, couponId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CouponDetail" as const,
                id,
              })),
              { type: "CouponDetail", id: `LIST-${couponId}` },
            ]
          : [{ type: "CouponDetail", id: `LIST-${couponId}` }],
    }),
    getCouponDetailById: builder.query<CouponDetail, number>({
      query: (id) => `admin/coupon-details/${id}`,
      providesTags: (_result, _error, id) => [{ type: "CouponDetail", id }],
    }),
    createCouponDetail: builder.mutation<
      CouponDetail,
      UpsertCouponDetailRequest
    >({
      query: (detail) => ({
        url: "admin/coupon-details",
        method: "POST",
        body: detail,
      }),
      invalidatesTags: (_result, _error, { couponId }) => [
        { type: "CouponDetail", id: `LIST-${couponId}` },
        { type: "Coupon", id: couponId },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    updateCouponDetail: builder.mutation<
      CouponDetail,
      { id: number } & UpsertCouponDetailRequest
    >({
      query: ({ id, ...detail }) => ({
        url: `admin/coupon-details/${id}`,
        method: "PUT",
        body: detail,
      }),
      invalidatesTags: (_result, _error, { id, couponId }) => [
        { type: "CouponDetail", id },
        { type: "CouponDetail", id: `LIST-${couponId}` },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    deleteCouponDetail: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/coupon-details/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, _id) => [
        { type: "CouponDetail", id: _id },
        { type: "CouponDetail", id: "LIST" },
        { type: "Coupon", id: "LIST" },
      ],
    }),

    // COUPON DETAIL RULE endpoints
    getCouponDetailRules: builder.query<CouponDetailRule[], number>({
      query: (couponDetailId) => ({
        url: "admin/coupon-detail-rules",
        params: { couponDetailId },
      }),
      providesTags: (result, _error, couponDetailId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CouponDetailRule" as const,
                id,
              })),
              { type: "CouponDetailRule", id: `LIST-${couponDetailId}` },
            ]
          : [{ type: "CouponDetailRule", id: `LIST-${couponDetailId}` }],
    }),
    createCouponDetailRule: builder.mutation<
      CouponDetailRule,
      UpsertCouponDetailRuleRequest
    >({
      query: (rule) => ({
        url: "admin/coupon-detail-rules",
        method: "POST",
        body: rule,
      }),
      invalidatesTags: (_result, _error, { couponDetailId }) => [
        { type: "CouponDetailRule", id: `LIST-${couponDetailId}` },
      ],
    }),
    updateCouponDetailRule: builder.mutation<
      CouponDetailRule,
      { id: number } & UpsertCouponDetailRuleRequest
    >({
      query: ({ id, ...rule }) => ({
        url: `admin/coupon-detail-rules/${id}`,
        method: "PUT",
        body: rule,
      }),
      invalidatesTags: (_result, _error, { id, couponDetailId }) => [
        { type: "CouponDetailRule", id },
        { type: "CouponDetailRule", id: `LIST-${couponDetailId}` },
      ],
    }),
    deleteCouponDetailRule: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/coupon-detail-rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, _id) => [
        { type: "CouponDetailRule", id: _id },
        { type: "CouponDetailRule", id: "LIST" },
      ],
    }),
  }),
});

export const {
  // Coupon hooks
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,

  // Coupon Detail hooks
  useGetCouponDetailsQuery,
  useGetCouponDetailByIdQuery,
  useCreateCouponDetailMutation,
  useUpdateCouponDetailMutation,
  useDeleteCouponDetailMutation,

  // Coupon Detail Rule hooks
  useGetCouponDetailRulesQuery,
  useCreateCouponDetailRuleMutation,
  useUpdateCouponDetailRuleMutation,
  useDeleteCouponDetailRuleMutation,
} = couponApi;
