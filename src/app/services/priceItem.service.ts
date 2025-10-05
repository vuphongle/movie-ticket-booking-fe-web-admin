import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_ADMIN, API_BASE_AUTH_PUBLIC } from "@/data/constants";
import type { RootState } from "@/app/Store";
import type {
  PriceItem,
  CreatePriceItemRequest,
  UpdatePriceItemRequest,
  PriceItemFilter,
  PriceTargetType,
} from "@/types";

export const priceItemApi = createApi({
  reducerPath: "priceItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/", // Will be overridden per endpoint
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Only add auth for admin endpoints
      if (
        endpoint?.startsWith("get") ||
        endpoint?.startsWith("create") ||
        endpoint?.startsWith("update") ||
        endpoint?.startsWith("delete") ||
        endpoint?.startsWith("toggle")
      ) {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["PriceItem"],
  endpoints: (builder) => ({
    // Get all price items
    getPriceItems: builder.query<PriceItem[], PriceItemFilter | void>({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter?.priceListId)
          params.append("priceListId", filter.priceListId.toString());
        if (filter?.targetType) params.append("targetType", filter.targetType);
        if (filter?.targetId)
          params.append("targetId", filter.targetId.toString());
        if (filter?.status !== undefined)
          params.append("status", filter.status.toString());
        if (filter?.effectiveAt)
          params.append("effectiveAt", filter.effectiveAt);

        // Ticket-specific filters
        if (filter?.seatType) params.append("seatType", filter.seatType);
        if (filter?.graphicsType)
          params.append("graphicsType", filter.graphicsType);
        if (filter?.screeningTimeType)
          params.append("screeningTimeType", filter.screeningTimeType);
        if (filter?.dayType) params.append("dayType", filter.dayType);
        if (filter?.auditoriumType)
          params.append("auditoriumType", filter.auditoriumType);

        const queryString = params.toString();
        return `${API_BASE_ADMIN}price-items${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["PriceItem"],
    }),

    // Get price item by ID
    getPriceItemById: builder.query<PriceItem, number>({
      query: (id) => `${API_BASE_ADMIN}price-items/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PriceItem", id }],
    }),

    // Get price items by price list ID
    getPriceItemsByPriceListId: builder.query<PriceItem[], number>({
      query: (priceListId) =>
        `${API_BASE_ADMIN}price-items/by-price-list/${priceListId}`,
      providesTags: (_result, _error, priceListId) => [
        { type: "PriceItem", id: `LIST_${priceListId}` },
      ],
    }),

    // Get price items by target type
    getPriceItemsByTargetType: builder.query<PriceItem[], PriceTargetType>({
      query: (targetType) =>
        `${API_BASE_ADMIN}price-items/by-target-type/${targetType}`,
      providesTags: (_result, _error, targetType) => [
        { type: "PriceItem", id: `TYPE_${targetType}` },
      ],
    }),

    // Get effective price items (status = true and effective at current time)
    getEffectivePriceItems: builder.query<PriceItem[], PriceItemFilter | void>({
      query: (filter) => {
        if (filter?.effectiveAt) {
          return `${API_BASE_AUTH_PUBLIC}price-items/effective/${filter.effectiveAt}`;
        } else {
          return `${API_BASE_AUTH_PUBLIC}price-items/effective`;
        }
      },
      providesTags: ["PriceItem"],
    }),

    // Create price item
    createPriceItem: builder.mutation<PriceItem, CreatePriceItemRequest>({
      query: (newPriceItem) => ({
        url: `${API_BASE_ADMIN}price-items`,
        method: "POST",
        body: newPriceItem,
      }),
      invalidatesTags: (_result, _error, { priceListId }) => [
        "PriceItem",
        { type: "PriceItem", id: `LIST_${priceListId}` },
      ],
    }),

    // Update price item
    updatePriceItem: builder.mutation<PriceItem, UpdatePriceItemRequest>({
      query: ({ id, ...updatedPriceItem }) => ({
        url: `${API_BASE_ADMIN}price-items/${id}`,
        method: "PUT",
        body: updatedPriceItem,
      }),
      invalidatesTags: (_result, _error, { id, priceListId }) => [
        { type: "PriceItem", id },
        { type: "PriceItem", id: `LIST_${priceListId}` },
        "PriceItem",
      ],
    }),

    // Delete price item
    deletePriceItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_BASE_ADMIN}price-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PriceItem", id },
        "PriceItem",
      ],
    }),

    // Toggle price item status
    togglePriceItemStatus: builder.mutation<PriceItem, number>({
      query: (id) => ({
        url: `${API_BASE_ADMIN}price-items/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PriceItem", id },
        "PriceItem",
      ],
    }),

    // Calculate price for ticket
    calculateTicketPrice: builder.query<
      { price: number; appliedPriceItem?: PriceItem },
      {
        seatType: string;
        graphicsType: string;
        screeningTimeType: string;
        dayType: string;
        auditoriumType: string;
        effectiveAt?: string;
      }
    >({
      query: (conditions) => {
        const params = new URLSearchParams();
        params.append("seatType", conditions.seatType);
        params.append("graphicsType", conditions.graphicsType);
        params.append("screeningTimeType", conditions.screeningTimeType);
        params.append("dayType", conditions.dayType);
        params.append("auditoriumType", conditions.auditoriumType);

        if (conditions.effectiveAt) {
          return `${API_BASE_AUTH_PUBLIC}price-items/ticket/price/at/${conditions.effectiveAt}?${params.toString()}`;
        } else {
          return `${API_BASE_AUTH_PUBLIC}price-items/ticket/price?${params.toString()}`;
        }
      },
    }),

    // Validate price item conflicts - placeholder for future implementation
    // validatePriceItemConflicts: builder.mutation<
    //   { hasConflicts: boolean; conflicts?: PriceItem[]; message?: string },
    //   CreatePriceItemRequest | UpdatePriceItemRequest
    // >({
    //   query: (priceItem) => ({
    //     url: `${API_BASE_ADMIN}price-items/validate-conflicts`,
    //     method: "POST",
    //     body: priceItem,
    //   }),
    // }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPriceItemsQuery,
  useGetPriceItemByIdQuery,
  useGetPriceItemsByPriceListIdQuery,
  useGetPriceItemsByTargetTypeQuery,
  useGetEffectivePriceItemsQuery,
  useCreatePriceItemMutation,
  useUpdatePriceItemMutation,
  useDeletePriceItemMutation,
  useTogglePriceItemStatusMutation,
  useCalculateTicketPriceQuery,
  useLazyCalculateTicketPriceQuery,
  // useValidatePriceItemConflictsMutation, // TODO: Implement in backend
} = priceItemApi;
