import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const scheduleApi = createApi({
    reducerPath: "scheduleApi",
    tagTypes: ['Schedule'],
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as any;
            const token = state.auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        getSchedules: builder.query({
            query: (params?: any) => ({
                url: 'schedules',
                params
            }),
            providesTags: ['Schedule'],
        }),
        getScheduleById: builder.query({
            query: (id: string | number) => `schedules/${id}`,
        }),
        createSchedule: builder.mutation({
            query: (newSchedule: any) => ({
                url: 'schedules',
                method: 'POST',
                body: newSchedule,
            }),
            invalidatesTags: [{ type: 'Schedule' }],
        }),
        updateSchedule: builder.mutation({
            query: ({ id, ...updatedSchedule }: { id: string | number; [key: string]: any }) => ({
                url: `schedules/${id}`,
                method: 'PUT',
                body: updatedSchedule,
            }),
            invalidatesTags: [{ type: 'Schedule' }],
        }),
        deleteSchedule: builder.mutation({
            query: (id: string | number) => ({
                url: `schedules/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Schedule' }],
        }),
    }),
});


export const {
    useGetSchedulesQuery,
    useGetScheduleByIdQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
} = scheduleApi;
