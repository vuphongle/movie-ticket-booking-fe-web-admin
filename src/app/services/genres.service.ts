import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "../Store";
import type { Genre } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const genreApi = createApi({
  reducerPath: "genreApi",
  tagTypes: ["Genre"],
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
    getGenres: builder.query<Genre[], void>({
      query: () => "genres",
      providesTags: ["Genre"],
    }),
    getGenreById: builder.query<Genre, string | number>({
      query: (id) => `genres/${id}`,
    }),
    createGenre: builder.mutation<Genre, Partial<Genre>>({
      query: (newGenre) => ({
        url: "genres",
        method: "POST",
        body: newGenre,
      }),
      invalidatesTags: [{ type: "Genre" }],
    }),
    updateGenre: builder.mutation<
      Genre,
      { id: string | number } & Partial<Genre>
    >({
      query: ({ id, ...updatedGenre }) => ({
        url: `genres/${id}`,
        method: "PUT",
        body: updatedGenre,
      }),
      invalidatesTags: [{ type: "Genre" }],
    }),
    deleteGenre: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `genres/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Genre" }],
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetGenreByIdQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
