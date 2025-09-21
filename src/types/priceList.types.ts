// Target types for price items
export enum PriceTargetType {
  PRODUCT = 'PRODUCT',
  ADDITIONAL_SERVICE = 'ADDITIONAL_SERVICE', 
  TICKET = 'TICKET',
  // Legacy - kept for compatibility
  ORDER = 'ORDER',
  SEAT_TYPE = 'SEAT_TYPE',
  SERVICE = 'SERVICE'
}

// Import existing types from ticketPrice.types.ts
import type {
  SeatType,
  GraphicsType,
  ScreeningTimeType,
  DayType,
  AuditoriumType
} from './ticketPrice.types';
import type { Product } from './product.types';
import type { AdditionalService } from './additionalService.types';

// PriceList interfaces
export interface PriceList {
  id: number;
  name: string;
  status: boolean;
  priority: number;
  validFrom?: string; // ISO date string
  validTo?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  priceItems?: PriceItem[];
  priceItemsCount?: number; // Count of price items
}

export interface CreatePriceListRequest {
  name: string;
  status?: boolean;
  priority: number;
  validFrom?: string;
  validTo?: string;
}

export interface UpdatePriceListRequest extends CreatePriceListRequest {
  id: number;
}

// PriceItem interfaces
export interface PriceItem {
  id: number;
  priceListId: number;
  targetType: PriceTargetType;
  targetId?: number; // nullable when targetType = TICKET
  
  // Fields for tickets (when targetType = TICKET)
  seatType?: SeatType; // nullable, null = wildcard
  graphicsType?: GraphicsType; // nullable, null = wildcard  
  screeningTimeType?: ScreeningTimeType; // nullable, null = wildcard
  dayType?: DayType; // nullable, null = wildcard
  auditoriumType?: AuditoriumType; // nullable, null = wildcard
  
  price: number; // Applied price
  minQty?: number; // Minimum quantity to apply this price
  priority: number; // Higher number = higher priority
  status: boolean; // Active status
  
  // Populated fields
  priceList?: PriceList;
  product?: Product; // Populated when targetType = PRODUCT
  additionalService?: AdditionalService; // Populated when targetType = ADDITIONAL_SERVICE
}

export interface CreatePriceItemRequest {
  priceListId: number;
  targetType: PriceTargetType;
  targetId?: number;
  
  // Ticket-specific fields
  seatType?: SeatType;
  graphicsType?: GraphicsType;
  screeningTimeType?: ScreeningTimeType;
  dayType?: DayType;
  auditoriumType?: AuditoriumType;
  
  price: number;
  minQty?: number;
  priority: number;
  status?: boolean;
}

export interface UpdatePriceItemRequest extends CreatePriceItemRequest {
  id: number;
}

// Utility interfaces for filtering and searching
export interface PriceListFilter {
  name?: string;
  status?: boolean;
  validAt?: string; // Check validity at specific date
}

export interface PriceItemFilter {
  priceListId?: number;
  targetType?: PriceTargetType;
  targetId?: number;
  status?: boolean;
  effectiveAt?: string; // Check effectiveness at specific date
  
  // Ticket-specific filters
  seatType?: SeatType;
  graphicsType?: GraphicsType;
  screeningTimeType?: ScreeningTimeType;
  dayType?: DayType;
  auditoriumType?: AuditoriumType;
}

// Response type aliases for consistency
export type PriceListResponse = PriceList;
export type PriceItemResponse = PriceItem;

export interface PaginatedPriceListResponse {
  content: PriceList[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PaginatedPriceItemResponse {
  content: PriceItem[];
  totalElements: number;
  totalPages: number;  
  size: number;
  number: number;
}