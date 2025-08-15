import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_AUTH_PUBLIC, API_DOMAIN } from "@/data/constants";
import type { ApiResponse } from "@/types/common.types";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
} from "@/types/auth.types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_AUTH_PUBLIC,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse): LoginResponse => {
        return {
          ...response,
          user: {
            ...response.user,
            avatar: response.user.avatar.startsWith("/api")
              ? `${API_DOMAIN}${response.user.avatar}`
              : response.user.avatar,
          },
        };
      },
    }),

    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: ({ email }) => ({
        url: "auth/forgot-password",
        method: "GET",
        params: { email },
      }),
    }),

    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
} = authApi;
