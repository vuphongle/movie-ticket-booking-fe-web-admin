import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "../Store";
import type { Actor } from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const actorApi = createApi({
  reducerPath: "actorApi",
  tagTypes: ["Actor"],
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
    getActors: builder.query<Actor[], void>({
      query: () => "actors",
      providesTags: ["Actor"],
    }),
    getActorById: builder.query<Actor, string | number>({
      query: (actorId) => `actors/${actorId}`,
      providesTags: (_result, _error, actorId) => [
        { type: "Actor", id: actorId },
      ],
    }),
    createActor: builder.mutation<Actor, Partial<Actor>>({
      query: (newActor) => ({
        url: "actors",
        method: "POST",
        body: newActor,
      }),
      invalidatesTags: ["Actor"],
    }),
    updateActor: builder.mutation<
      Actor,
      { actorId: string | number } & Partial<Actor>
    >({
      query: ({ actorId, ...updatedActor }) => ({
        url: `actors/${actorId}`,
        method: "PUT",
        body: updatedActor,
      }),
      invalidatesTags: (_result, _error, { actorId }) => [
        { type: "Actor", id: actorId },
      ],
    }),
    deleteActor: builder.mutation<void, string | number>({
      query: (actorId) => ({
        url: `actors/${actorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Actor"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetActorsQuery,
  useGetActorByIdQuery,
  useCreateActorMutation,
  useUpdateActorMutation,
  useDeleteActorMutation,
} = actorApi;
