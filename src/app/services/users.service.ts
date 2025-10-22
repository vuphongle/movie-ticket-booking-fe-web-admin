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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: "admin/users/update-password",
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query<any[], void>({
      query: () => "admin/users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<any, string | undefined>({
      query: (id) => `admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<any, any>({
      query: (newUser) => ({
        url: "admin/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<any, { id: string | number } & any>({
      query: ({ id, ...updatedUser }) => ({
        url: `admin/users/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `admin/users/${id}/reset-password`,
        method: "POST",
      }),
    }),
    getOrdersByUser: builder.query<any[], string | undefined>({
      query: (id) => `admin/users/${id}/orders`,
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation,
  useGetOrdersByUserQuery,
} = userApi;
