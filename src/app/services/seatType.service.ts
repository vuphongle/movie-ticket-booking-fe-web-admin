// Seat Type API Service
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_ADMIN } from '../../data/constants';
import type { RootState } from '../Store';

const ENDPOINT = API_BASE_ADMIN;

export interface SeatTypeOption {
  id: number;
  key: string;
  label: string;
}

export const seatTypeApi = createApi({
  reducerPath: 'seatTypeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSeatTypeOptions: builder.query<SeatTypeOption[], void>({
      query: () => 'seat-types',
    }),
  }),
});

export const { useGetSeatTypeOptionsQuery } = seatTypeApi;