import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_AUTH_PUBLIC, API_DOMAIN } from "@/data/constants";
import type { ApiResponse } from "@/types/common.types";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
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

    registerAccount: builder.mutation<ApiResponse, RegisterRequest>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: ({ email }) => ({
        url: "auth/forgot-password",
        method: "GET",
        params: { email },
      }),
    }),

    checkForgotPasswordToken: builder.query<ApiResponse, string>({
      query: (token) => ({
        url: `auth/check-forgot-password-token/${token}`,
        method: "GET",
      }),
    }),

    checkRegisterToken: builder.query<ApiResponse, string>({
      query: (token) => ({
        url: `auth/check-register-token/${token}`,
        method: "GET",
      }),
    }),

    changePassword: builder.mutation<ApiResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    // Có thể thêm endpoint logout nếu cần
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
  useRegisterAccountMutation,
  useForgotPasswordMutation,
  useCheckForgotPasswordTokenQuery,
  useChangePasswordMutation,
  useCheckRegisterTokenQuery,
  useLogoutMutation,
} = authApi;
