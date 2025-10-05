import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type {
  AdditionalService,
  AdditionalServiceItem,
  CreateAdditionalServiceRequest,
  UpdateAdditionalServiceRequest,
} from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const additionalServiceApi = createApi({
  reducerPath: "additionalServiceApi",
  tagTypes: ["AdditionalService"],
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { accessToken: string } };
      const token = state.auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAdditionalServices: builder.query<AdditionalService[], void>({
      query: () => "additional-services",
      providesTags: ["AdditionalService"],
    }),
    getAdditionalServiceById: builder.query<AdditionalService, string>({
      query: (additionalServiceId) =>
        `additional-services/${additionalServiceId}`,
      providesTags: (_result, _error, additionalServiceId) => [
        { type: "AdditionalService", id: additionalServiceId },
      ],
    }),
    getAdditionalServicePrice: builder.query<number, string>({
      query: (additionalServiceId) =>
        `../public/additional-services/${additionalServiceId}/price`,
    }),
    getAdditionalServiceItems: builder.query<AdditionalServiceItem[], string>({
      query: (additionalServiceId) =>
        `../public/additional-services/${additionalServiceId}/items`,
      providesTags: (_result, _error, additionalServiceId) => [
        { type: "AdditionalService", id: `items-${additionalServiceId}` },
      ],
    }),
    createAdditionalService: builder.mutation<
      AdditionalService,
      CreateAdditionalServiceRequest
    >({
      query: (newAdditionalService) => ({
        url: "additional-services",
        method: "POST",
        body: newAdditionalService,
      }),
      invalidatesTags: ["AdditionalService"],
    }),
    updateAdditionalService: builder.mutation<
      AdditionalService,
      { additionalServiceId: string } & UpdateAdditionalServiceRequest
    >({
      query: ({ additionalServiceId, ...updatedAdditionalService }) => ({
        url: `additional-services/${additionalServiceId}`,
        method: "PUT",
        body: updatedAdditionalService,
      }),
      invalidatesTags: (_result, _error, { additionalServiceId }) => [
        { type: "AdditionalService", id: additionalServiceId },
        { type: "AdditionalService", id: `items-${additionalServiceId}` },
      ],
    }),
    deleteAdditionalService: builder.mutation<void, string>({
      query: (additionalServiceId) => ({
        url: `additional-services/${additionalServiceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdditionalService"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAdditionalServicesQuery,
  useGetAdditionalServiceByIdQuery,
  useGetAdditionalServicePriceQuery,
  useGetAdditionalServiceItemsQuery,
  useCreateAdditionalServiceMutation,
  useUpdateAdditionalServiceMutation,
  useDeleteAdditionalServiceMutation,
} = additionalServiceApi;
