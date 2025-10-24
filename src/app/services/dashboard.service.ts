import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@data/constants";
import type { RootState } from "../Store";
import type {
  DashboardData,
  MovieRevenue,
  CinemaRevenue,
  RevenueQueryParams,
  MovieCinemaRevenue,
  CinemaMovieRevenue,
  RevenueDetailQueryParams,
  CustomerRevenue,
  CustomerMovieRevenue,
} from "@/types/dashboard.types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  tagTypes: ["Dashboard", "Revenue"],
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
    getDashboardData: builder.query<DashboardData, void>({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
    }),
    getRevenueByMovie: builder.query<MovieRevenue[], RevenueQueryParams>({
      query: ({ startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }
        return {
          url: `revenue/movie`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Revenue"],
    }),
    getRevenueByCinema: builder.query<CinemaRevenue[], RevenueQueryParams>({
      query: ({ startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }
        return {
          url: `revenue/cinema`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Revenue"],
    }),
    exportRevenueByMovie: builder.query<Blob, RevenueQueryParams>({
      query: ({ startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }
        return {
          url: `revenue/movie/export`,
          method: "GET",
          params,
          responseHandler: (response: Response) => response.blob(),
        };
      },
    }),
    exportRevenueByCinema: builder.query<Blob, RevenueQueryParams>({
      query: ({ startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }
        return {
          url: `revenue/cinema/export`,
          method: "GET",
          params,
          responseHandler: (response: Response) => response.blob(),
        };
      },
    }),
    // Thống kê theo 1 phim cụ thể
    getRevenueByMovieId: builder.query<
      MovieCinemaRevenue[],
      RevenueDetailQueryParams
    >({
      query: ({ id, startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/movie/${id}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Revenue"],
    }),
    // Export theo 1 phim cụ thể
    exportRevenueByMovieId: builder.query<Blob, RevenueDetailQueryParams>({
      query: ({ id, startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/movie/${id}/export`,
          method: "GET",
          params,
          responseHandler: (response: Response) => response.blob(),
        };
      },
    }),
    // Thống kê theo 1 rạp cụ thể
    getRevenueByCinemaId: builder.query<
      CinemaMovieRevenue[],
      RevenueDetailQueryParams
    >({
      query: ({ id, startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/cinema/${id}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Revenue"],
    }),
    // Export theo 1 rạp cụ thể
    exportRevenueByCinemaId: builder.query<Blob, RevenueDetailQueryParams>({
      query: ({ id, startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/cinema/${id}/export`,
          method: "GET",
          params,
          responseHandler: (response: Response) => response.blob(),
        };
      },
    }),
    // Thống kê theo khách hàng
    getRevenueByCustomer: builder.query<CustomerRevenue[], RevenueQueryParams>({
      query: ({ startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/customer`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Revenue"],
    }),
    // Export theo khách hàng
    exportRevenueByCustomer: builder.query<Blob, RevenueQueryParams>({
      query: ({ startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/customer/export`,
          method: "GET",
          params,
          responseHandler: (response: Response) => response.blob(),
        };
      },
    }),
    // Thống kê theo 1 khách hàng cụ thể
    getRevenueByCustomerId: builder.query<
      CustomerMovieRevenue[],
      RevenueDetailQueryParams
    >({
      query: ({ id, startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/customer/${id}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Revenue"],
    }),
    // Export theo 1 khách hàng cụ thể
    exportRevenueByCustomerId: builder.query<Blob, RevenueDetailQueryParams>({
      query: ({ id, startDate, endDate }) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return {
          url: `revenue/customer/${id}/export`,
          method: "GET",
          params,
          responseHandler: (response: Response) => response.blob(),
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDashboardDataQuery,
  useGetRevenueByMovieQuery,
  useGetRevenueByCinemaQuery,
  useLazyGetRevenueByCinemaQuery,
  useLazyGetRevenueByMovieQuery,
  useLazyExportRevenueByCinemaQuery,
  useLazyExportRevenueByMovieQuery,
  useLazyGetRevenueByMovieIdQuery,
  useLazyExportRevenueByMovieIdQuery,
  useLazyGetRevenueByCinemaIdQuery,
  useLazyExportRevenueByCinemaIdQuery,
  useLazyGetRevenueByCustomerQuery,
  useLazyExportRevenueByCustomerQuery,
  useLazyGetRevenueByCustomerIdQuery,
  useLazyExportRevenueByCustomerIdQuery,
} = dashboardApi;
