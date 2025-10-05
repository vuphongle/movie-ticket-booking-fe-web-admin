import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "../Store";
import type { Image } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const imageApi = createApi({
  reducerPath: "imageApi",
  tagTypes: ["Image"],
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
    getImages: builder.query<Image[], void>({
      query: () => "images",
      providesTags: ["Image"],
    }),
    uploadImage: builder.mutation<Image, FormData>({
      query: (formData) => ({
        url: "images",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Image"],
    }),
    deleteImage: builder.mutation<void, string | number>({
      query: (imageId) => ({
        url: `images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Image"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetImagesQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
} = imageApi;
