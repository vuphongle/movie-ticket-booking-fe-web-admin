// Enums matching backend
export enum CouponKind {
  DISPLAY = 'DISPLAY',
  VOUCHER = 'VOUCHER'
}

export enum TargetType {
  PRODUCT = 'PRODUCT',
  ADDITIONAL_SERVICE = 'ADDITIONAL_SERVICE',
  TICKET = 'TICKET'
}

export enum BenefitType {
  DISCOUNT_PERCENT = 'DISCOUNT_PERCENT',
  DISCOUNT_AMOUNT = 'DISCOUNT_AMOUNT',
  FREE_PRODUCT = 'FREE_PRODUCT'
}

// Coupon main interface (updated)
export interface Coupon {
  id: number;
  kind: CouponKind;
  code?: string; // Optional for DISPLAY type coupons
  name: string;
  description?: string;
  status: boolean;
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
  createdAt?: string;
  updatedAt?: string;
}

// Coupon Detail Terms (new interface)
export interface CouponDetailTerms {
  id: number;
  
  // Benefit values (moved from CouponDetail)
  percent?: number;
  amount?: number;
  giftServiceId?: number;
  giftQuantity?: number;
  
  // Limit conditions (moved from CouponDetail)
  limitQuantityApplied?: number;
  
  // Usage tracking (moved from CouponDetail)
  detailUsedCount: number;
  
  createdAt?: string;
  updatedAt?: string;
}

// Coupon Detail (updated to match cleaned backend entity)
export interface CouponDetail {
  id: number;
  couponId: number;
  enabled: boolean;
  targetType: TargetType;
  targetRefId?: number;
  benefitType: BenefitType;
  
  // Terms relationship (1-1) 
  terms?: CouponDetailTerms;
  
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Filter interface for UI
export interface CouponFilter {
  activeStatus?: 'ALL' | 'ACTIVE' | 'HIDDEN' | 'EXPIRED';
  hasEnabledDetails?: boolean;
}

// Request DTOs (updated)
export interface TermsData {
  // Benefit values (moved from main request)
  percent?: number;
  amount?: number;
  giftServiceId?: number;
  giftQuantity?: number;
  
  // Limit conditions (moved from main request)
  limitQuantityApplied?: number;
}

export interface UpsertCouponRequest {
  kind: CouponKind;
  code?: string; // Optional, required only for VOUCHER type
  name: string;
  description?: string;
  status: boolean;
  startDate: string;
  endDate: string;
}

export interface UpsertCouponDetailRequest {
  enabled: boolean;
  targetType: TargetType;
  targetRefId?: number;
  benefitType: BenefitType;
  
  // Terms data (embedded, matches backend TermsData inner class)
  terms?: TermsData;
  
  notes?: string;
}

// Component Props
export interface CouponDetailModalProps {
  couponId: number;
  coupon?: Coupon;
  detail?: CouponDetail;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export interface CouponDetailTableProps {
  couponId: number;
  data: CouponDetail[];
  loading?: boolean;
  onEdit?: (detail: CouponDetail) => void;
  onDelete?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onToggleEnabled?: (id: number, enabled: boolean) => void;
}

// Filter & Search types (updated)
export interface CouponFilter {
  keyword?: string; // Search by name/description/code
  kind?: CouponKind | 'ALL';
  status?: boolean | 'ALL';
  dateRange?: [string, string]; // Apply date range filter
}

export interface CouponListParams {
  keyword?: string;
  kind?: CouponKind;
  status?: boolean;
  startDate?: string; // Filter by date range
  endDate?: string;
  page?: number;
  size?: number;
}