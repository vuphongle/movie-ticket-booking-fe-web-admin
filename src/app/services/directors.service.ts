import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "../Store";
import type { Director } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const directorApi = createApi({
    reducerPath: "directorApi",
    tagTypes: ['Director'],
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
        getDirectors: builder.query<Director[], void>({
            query: () => "directors",
            providesTags: ["Director"],
        }),
        getDirectorById: builder.query<Director, string | number>({
            query: (directorId) => `directors/${directorId}`,
            providesTags: (_result, _error, directorId) => [
                { type: "Director", id: directorId },
            ],
        }),
        createDirector: builder.mutation<Director, Partial<Director>>({
            query: (newDirector) => ({
                url: "directors",
                method: "POST",
                body: newDirector,
            }),
            invalidatesTags: ["Director"],
        }),
        updateDirector: builder.mutation<Director, { directorId: string | number } & Partial<Director>>({
            query: ({ directorId, ...updatedDirector }) => ({
                url: `directors/${directorId}`,
                method: "PUT",
                body: updatedDirector,
            }),
            invalidatesTags: (_result, _error, { directorId }) => [
                { type: "Director", id: directorId },
            ],
        }),
        deleteDirector: builder.mutation<void, string | number>({
            query: (directorId) => ({
                url: `directors/${directorId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Director"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetDirectorsQuery,
    useGetDirectorByIdQuery,
    useCreateDirectorMutation,
    useUpdateDirectorMutation,
    useDeleteDirectorMutation,
} = directorApi;
