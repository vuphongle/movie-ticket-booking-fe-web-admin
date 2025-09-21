import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN } from "@/data/constants";
import type { RootState } from "@/app/Store";
import type {
  PriceList,
  CreatePriceListRequest,
  UpdatePriceListRequest,
  PriceListFilter,
  PaginatedPriceListResponse
} from "@/types";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_BASE_ADMIN;

export const priceListApi = createApi({
  reducerPath: "priceListApi",
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
  tagTypes: ["PriceList"],
  endpoints: (builder) => ({
    // Get all price lists
    getPriceLists: builder.query<PriceList[], PriceListFilter | void>({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter?.name) params.append("name", filter.name);
        if (filter?.status !== undefined) params.append("status", filter.status.toString());
        if (filter?.validAt) params.append("validAt", filter.validAt);
        
        // Include price items count
        params.append("includePriceItemsCount", "true");
        
        const queryString = params.toString();
        return `price-lists${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["PriceList"],
    }),

    // Get paginated price lists
    getPriceListsPaginated: builder.query<
      PaginatedPriceListResponse,
      { page?: number; size?: number; sort?: string; filter?: PriceListFilter }
    >({
      query: ({ page = 0, size = 10, sort = "id,desc", filter }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sort: sort,
        });
        
        if (filter?.name) params.append("name", filter.name);
        if (filter?.status !== undefined) params.append("status", filter.status.toString());
        if (filter?.validAt) params.append("validAt", filter.validAt);
        
        return `price-lists/paginated?${params.toString()}`;
      },
      providesTags: ["PriceList"],
    }),

    // Get price list by ID
    getPriceListById: builder.query<PriceList, number>({
      query: (id) => `price-lists/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PriceList", id }],
    }),

    // Get active price lists (status = true and valid at current time)
    getActivePriceLists: builder.query<PriceList[], string | void>({
      query: (validAt) => {
        const params = new URLSearchParams();
        params.append("status", "true");
        if (validAt) {
          params.append("validAt", validAt);
        } else {
          params.append("validAt", new Date().toISOString());
        }
        return `price-lists?${params.toString()}`;
      },
      providesTags: ["PriceList"],
    }),

    // Create price list
    createPriceList: builder.mutation<PriceList, CreatePriceListRequest>({
      query: (newPriceList) => ({
        url: "price-lists",
        method: "POST",
        body: newPriceList,
      }),
      invalidatesTags: ["PriceList"],
    }),

    // Update price list
    updatePriceList: builder.mutation<PriceList, UpdatePriceListRequest>({
      query: ({ id, ...updatedPriceList }) => ({
        url: `price-lists/${id}`,
        method: "PUT",
        body: updatedPriceList,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PriceList", id },
        "PriceList",
      ],
    }),

    // Delete price list
    deletePriceList: builder.mutation<void, number>({
      query: (id) => ({
        url: `price-lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PriceList", id },
        "PriceList",
      ],
    }),

    // Toggle price list status
    togglePriceListStatus: builder.mutation<PriceList, number>({
      query: (id) => ({
        url: `price-lists/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PriceList", id },
        "PriceList",
      ],
    }),

    // Check if price list can be deleted
    checkCanDeletePriceList: builder.query<
      { canDelete: boolean; message?: string },
      number
    >({
      query: (id) => `price-lists/${id}/can-delete`,
    }),

    // Validate price list dates
    validatePriceListDates: builder.mutation<
      { valid: boolean; message?: string },
      { validFrom?: string; validTo?: string }
    >({
      query: (dates) => ({
        url: "price-lists/validate-dates",
        method: "POST",
        body: dates,
      }),
    }),

    // Clone price list with all price items
    clonePriceList: builder.mutation<
      PriceList,
      { 
        id: number; 
        name: string; 
        priority?: number;
        status?: boolean;
        validFrom?: string;
        validTo?: string;
      }
    >({
      query: ({ id, ...cloneData }) => ({
        url: `price-lists/${id}/clone`,
        method: "POST",
        body: cloneData,
      }),
      invalidatesTags: ["PriceList"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPriceListsQuery,
  useGetPriceListsPaginatedQuery,
  useGetPriceListByIdQuery,
  useGetActivePriceListsQuery,
  useCreatePriceListMutation,
  useUpdatePriceListMutation,
  useDeletePriceListMutation,
  useTogglePriceListStatusMutation,
  useCheckCanDeletePriceListQuery,
  useLazyCheckCanDeletePriceListQuery,
  useValidatePriceListDatesMutation,
  useClonePriceListMutation,
} = priceListApi;