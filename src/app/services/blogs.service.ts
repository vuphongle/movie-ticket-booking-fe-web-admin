import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@data/constants";
import type { RootState } from "@/app/Store";
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from "@/types";

const ENDPOINT = API_BASE_ADMIN;

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getBlogs: builder.query<Blog[], void>({
      query: () => "blogs",
      providesTags: ["Blog"],
    }),
    getOwnBlogs: builder.query<Blog[], void>({
      query: () => "blogs/own-blogs",
      providesTags: ["Blog"],
    }),
    getBlogById: builder.query<Blog, number | string | undefined>({
      query: (blogId) => `blogs/${blogId}`,
      providesTags: (_result, _error, blogId) => [{ type: "Blog", id: blogId }],
    }),
    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      query: (newBlog) => ({
        url: "blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation<
      Blog,
      { blogId: number | string | undefined } & UpdateBlogRequest
    >({
      query: ({ blogId, ...updatedBlog }) => ({
        url: `blogs/${blogId}`,
        method: "PUT",
        body: updatedBlog,
      }),
      invalidatesTags: (_result, _error, { blogId }) => [
        { type: "Blog", id: blogId },
      ],
    }),
    deleteBlog: builder.mutation<void, number>({
      query: (blogId) => ({
        url: `blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetOwnBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
