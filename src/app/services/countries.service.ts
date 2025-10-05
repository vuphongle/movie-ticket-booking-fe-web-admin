import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "../Store";
import type { Country } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const countryApi = createApi({
  reducerPath: "countryApi",
  tagTypes: ["Country"],
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
    getCountries: builder.query<Country[], void>({
      query: () => "countries",
      providesTags: ["Country"],
    }),
    getCountryById: builder.query<Country, string | number>({
      query: (id) => `countries/${id}`,
    }),
    createCountry: builder.mutation<Country, Partial<Country>>({
      query: (newCountry) => ({
        url: "countries",
        method: "POST",
        body: newCountry,
      }),
      invalidatesTags: [{ type: "Country" }],
    }),
    updateCountry: builder.mutation<
      Country,
      { id: string | number } & Partial<Country>
    >({
      query: ({ id, ...updatedCountry }) => ({
        url: `countries/${id}`,
        method: "PUT",
        body: updatedCountry,
      }),
      invalidatesTags: [{ type: "Country" }],
    }),
    deleteCountry: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Country" }],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countryApi;
