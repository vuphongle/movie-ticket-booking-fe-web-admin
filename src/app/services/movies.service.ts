import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@data/constants";
import type { RootState } from "../Store";

const ENDPOINT = API_BASE_ADMIN;

export const movieApi = createApi({
    reducerPath: "movieApi",
    tagTypes: ['Movie'],
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
        getMovies: builder.query({
            query: (status) => {
                if (status) {
                    return `movies?status=${status}`;
                }
                return "movies";

            },
            providesTags: ["Movie"],
        }),
        getAllMoviesInSchedule: builder.query({
            query: (date) => {
                return {
                    url: "movies/in-schedule",
                    method: "GET",
                    params: {
                        date: date,
                    },
                }
            },
        }),
        getMovieById: builder.query({
            query: (movieId) => `movies/${movieId}`,
            providesTags: (_result, _error, movieId) => [
                { type: "Movie", id: movieId },
            ],
        }),
        createMovie: builder.mutation({
            query: (newMovie) => ({
                url: "movies",
                method: "POST",
                body: newMovie,
            }),
            invalidatesTags: ["Movie"],
        }),
        updateMovie: builder.mutation({
            query: ({ movieId, ...updatedMovie }) => ({
                url: `movies/${movieId}`,
                method: "PUT",
                body: updatedMovie,
            }),
            invalidatesTags: (_result, _error, { movieId }) => [
                { type: "Movie", id: movieId },
            ],
        }),
        deleteMovie: builder.mutation({
            query: (movieId) => ({
                url: `movies/${movieId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Movie"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetMoviesQuery,
    useGetAllMoviesInScheduleQuery,
    useGetMovieByIdQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
    useDeleteMovieMutation,
} = movieApi;
