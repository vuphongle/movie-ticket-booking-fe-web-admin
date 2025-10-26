import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "../../data/constants";
import type { RootState } from "../Store";
import type {
  CouponStatistics,
  CouponPerformance,
  CouponUsage,
  CouponTypeStatistics,
} from "@/types/couponStatistics.types";

const ENDPOINT = API_BASE_ADMIN;

export const couponStatisticsApi = createApi({
  reducerPath: "couponStatisticsApi",
  tagTypes: ["CouponStatistics"],
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
    // Get overall statistics
    getCouponStatistics: builder.query<
      CouponStatistics,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/coupon-statistics",
        params,
      }),
      providesTags: ["CouponStatistics"],
    }),

    // Get performance for all coupons
    getCouponPerformance: builder.query<
      CouponPerformance[],
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/coupon-statistics/performance",
        params,
      }),
      providesTags: ["CouponStatistics"],
    }),

    // Get performance for specific coupon
    getCouponPerformanceById: builder.query<
      CouponPerformance,
      { couponId: number; startDate?: string; endDate?: string }
    >({
      query: ({ couponId, ...params }) => ({
        url: `/coupon-statistics/performance/${couponId}`,
        params,
      }),
      providesTags: ["CouponStatistics"],
    }),

    // Get usage history
    getCouponUsageHistory: builder.query<
      CouponUsage[],
      { couponId?: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/coupon-statistics/usage",
        params,
      }),
      providesTags: ["CouponStatistics"],
    }),

    // Get type statistics
    getCouponTypeStatistics: builder.query<
      CouponTypeStatistics[],
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/coupon-statistics/by-type",
        params,
      }),
      providesTags: ["CouponStatistics"],
    }),

    // Export to Excel
    exportCouponPerformance: builder.mutation<
      Blob,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/coupon-statistics/export",
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetCouponStatisticsQuery,
  useGetCouponPerformanceQuery,
  useGetCouponPerformanceByIdQuery,
  useGetCouponUsageHistoryQuery,
  useGetCouponTypeStatisticsQuery,
  useExportCouponPerformanceMutation,
} = couponStatisticsApi;
