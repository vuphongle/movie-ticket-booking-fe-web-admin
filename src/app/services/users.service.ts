import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "@/data/constants";
import type { RootState } from "@/app/Store";
import type { ChangePasswordRequest } from "@/types/auth.types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_DOMAIN,
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
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => {
        return {
          url: "users/update-password",
          method: "PUT",
          body: data,
        };
      },
    }),
  }),
});

export const { useChangePasswordMutation } = userApi;
