import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@data/constants";
import type { RootState } from "../Store";
import type {
  DashboardData,
  MovieRevenue,
  CinemaRevenue,
  RevenueQueryParams,
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
    useLazyExportRevenueByMovieQuery
} = dashboardApi;
