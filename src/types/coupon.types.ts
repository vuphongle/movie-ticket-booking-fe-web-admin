// Enums matching backend
export enum TargetType {
  ORDER = 'ORDER',
  SEAT_TYPE = 'SEAT_TYPE',
  SERVICE = 'SERVICE'
}

export enum BenefitType {
  DISCOUNT_PERCENT = 'DISCOUNT_PERCENT',
  DISCOUNT_AMOUNT = 'DISCOUNT_AMOUNT',
  FREE_PRODUCT = 'FREE_PRODUCT'
}

export enum SelectionStrategy {
  HIGHEST_PRICE_FIRST = 'HIGHEST_PRICE_FIRST',
  LOWEST_PRICE_FIRST = 'LOWEST_PRICE_FIRST',
  FIFO = 'FIFO'
}

// Coupon main interface (simplified)
export interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: boolean;
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
  createdAt?: string;
  updatedAt?: string;
}

// Coupon Detail
export interface CouponDetail {
  id: number;
  couponId: number;
  enabled: boolean;
  targetType: TargetType;
  targetRefId?: number;
  benefitType: BenefitType;
  
  // Benefit values
  percent?: number;
  amount?: number;
  giftServiceId?: number;
  giftQuantity?: number;
  
  // Conditions/Limits
  lineMaxDiscount?: number;
  minQuantity?: number;
  limitQuantityApplied?: number;
  minOrderTotal?: number;
  
  // Usage limits
  detailUsageLimit?: number;
  detailUsedCount: number;
  
  // Priority & Selection
  linePriority: number;
  selectionStrategy: SelectionStrategy;
  
  // Date range (required)
  startDate: string; // ISO datetime string - required
  endDate: string; // ISO datetime string - required
  
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Filter interface for UI
export interface CouponFilter {
  activeStatus?: 'ALL' | 'ACTIVE' | 'HIDDEN' | 'EXPIRED';
  hasEnabledDetails?: boolean;
}

// Request DTOs
export interface UpsertCouponRequest {
  code: string;
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
  
  // Benefit values
  percent?: number;
  amount?: number;
  giftServiceId?: number;
  giftQuantity?: number;
  
  // Conditions/Limits
  lineMaxDiscount?: number;
  minQuantity?: number;
  limitQuantityApplied?: number;
  minOrderTotal?: number;
  
  // Usage limits
  detailUsageLimit?: number;
  
  // Priority & Selection
  linePriority: number;
  selectionStrategy?: SelectionStrategy;
  
  // Date range (required)
  startDate: string; // ISO datetime string - required
  endDate: string; // ISO datetime string - required
  
  notes?: string;
}

// Preview & Apply DTOs
export interface TicketItem {
  seatTypeId: number;
  qty: number;
  unitPrice: number;
}

export interface ServiceItem {
  serviceId: number;
  qty: number;
  unitPrice: number;
}

export interface CouponPreviewRequest {
  tickets: TicketItem[];
  services?: ServiceItem[];
}

export interface DetailApplicationResult {
  detailId: number;
  applied: boolean;
  reason: string;
  lineDiscount: number;
  affectedQuantity: number;
}

export interface GiftItem {
  serviceId: number;
  serviceName: string;
  quantity: number;
}

export interface CouponPreviewResponse {
  totalDiscount: number;
  detailResults: DetailApplicationResult[];
  gifts: GiftItem[];
}

export interface CouponApplyRequest {
  orderId: number;
  couponCode: string;
  cart: CouponPreviewRequest;
}

export interface CouponApplyResponse {
  status: string;
  idempotentToken?: string;
  appliedDetailIds?: number[];
  previewResult?: CouponPreviewResponse;
  errorMessage?: string;
}

export interface RedemptionConfirmRequest {
  orderId: number;
  couponCode: string;
  appliedDetailIds: number[];
}

// Component Props
export interface CouponModalProps {
  coupon?: Coupon;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export interface CouponTableProps {
  data: Coupon[];
  loading?: boolean;
}

export interface CouponDetailModalProps {
  couponId: number;
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
  onUpdatePriority?: (detailId: number, newPriority: number) => void;
}

export interface CouponPreviewModalProps {
  couponId: number;
  open: boolean;
  onCancel: () => void;
}

// Filter & Search types
export interface CouponFilter {
  activeStatus?: 'ACTIVE' | 'HIDDEN' | 'EXPIRED' | 'ALL';
  hasEnabledDetails?: boolean;
}