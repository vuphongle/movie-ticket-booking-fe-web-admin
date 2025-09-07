import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "../../data/constants";
import type { RootState } from "../Store";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const showtimesApi = createApi({
    reducerPath: "showtimesApi",
    tagTypes: ['Showtimes'],
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
        searchShowtimes: builder.query({
            query: ({ cinemaId, auditoriumId, showDate }) => {
                const params = {
                    ...(cinemaId && { cinemaId }),
                    ...(auditoriumId && { auditoriumId }),
                    ...(showDate && { showDate }),
                };
                return {
                    url: `showtimes`,
                    method: 'GET',
                    params
                };
            },
            providesTags: ['Showtimes'],
        }),
        createShowtimes: builder.mutation({
            query: (newShowtime) => ({
                url: "showtimes",
                method: "POST",
                body: newShowtime,
            }),
            invalidatesTags: ["Showtimes"],
        }),
    }),
});

export const {
    useLazySearchShowtimesQuery,
    useCreateShowtimesMutation,
} = showtimesApi;
