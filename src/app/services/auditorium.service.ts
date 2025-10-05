import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "../../data/constants";
import type { RootState } from "../Store";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const auditoriumApi = createApi({
  reducerPath: "auditoriumApi",
  tagTypes: ["Auditorium"],
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
    getAuditoriumsByCinema: builder.query({
      query: (cinemaId) => `cinemas/${cinemaId}/auditoriums`,
      providesTags: ["Auditorium"],
    }),
    getAuditoriumById: builder.query({
      query: (id) => `auditoriums/${id}`,
    }),
    createAuditorium: builder.mutation({
      query: (newAuditorium) => ({
        url: "auditoriums",
        method: "POST",
        body: newAuditorium,
      }),
      invalidatesTags: [{ type: "Auditorium" }],
    }),
    updateAuditorium: builder.mutation({
      query: ({ id, ...updatedAuditorium }) => ({
        url: `auditoriums/${id}`,
        method: "PUT",
        body: updatedAuditorium,
      }),
      invalidatesTags: [{ type: "Auditorium" }],
    }),
    deleteAuditorium: builder.mutation({
      query: (id) => ({
        url: `auditoriums/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Auditorium" }],
    }),
  }),
});

export const {
  useGetAuditoriumsByCinemaQuery,
  useLazyGetAuditoriumsByCinemaQuery,
  useGetAuditoriumByIdQuery,
  useCreateAuditoriumMutation,
  useUpdateAuditoriumMutation,
  useDeleteAuditoriumMutation,
} = auditoriumApi;
