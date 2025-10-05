import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "@/app/Store";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    updateReview: builder.mutation({
      query: ({ reviewId, ...updatedReview }) => ({
        url: `reviews/${reviewId}`,
        method: "PUT",
        body: updatedReview,
      }),
    }),
    deleteReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `reviews/${reviewId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useUpdateReviewMutation, useDeleteReviewMutation } = reviewApi;
