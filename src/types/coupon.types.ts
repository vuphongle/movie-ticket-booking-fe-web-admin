// Enums matching backend
export enum CouponType {
  DISCOUNT = "DISCOUNT",
  GIFT = "GIFT",
}

export enum CouponStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export enum CouponTargetType {
  ORDER = "ORDER",
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
}

export enum CouponBenefitType {
  DISCOUNT_PERCENT = "DISCOUNT_PERCENT",
  DISCOUNT_AMOUNT = "DISCOUNT_AMOUNT",
}

export enum CouponStackingPolicy {
  EXCLUSIVE = "EXCLUSIVE",
  STACKABLE = "STACKABLE",
}

// Coupon main interface (matching new BE schema)
export interface Coupon {
  id: number;
  type: CouponType;
  code: string;
  name: string;
  description?: string;
  status: CouponStatus;
  visible: boolean;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  stackingPolicy: CouponStackingPolicy;
  orderMinTotal?: number;
  orderMaxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Coupon Detail (matching new BE schema)
export interface CouponDetail {
  id: number;
  couponId: number;
  targetType: CouponTargetType;
  giftServiceId?: number; // ID reference for target (movie_id, product_id, cinema_id...)
  createdAt?: string;
  updatedAt?: string;
}

// Coupon Detail Rule (new entity)
export interface CouponDetailRule {
  id: number;
  couponDetailId: number;
  benefitType: CouponBenefitType;
  percent?: number;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Request DTOs (matching new BE schema)
export interface UpsertCouponRequest {
  type: CouponType;
  code: string;
  name: string;
  description?: string;
  status: CouponStatus;
  visible: boolean;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  stackingPolicy: CouponStackingPolicy;
  orderMinTotal?: number;
  orderMaxDiscount?: number;
  usageLimit?: number;
}

export interface UpsertCouponDetailRequest {
  couponId: number;
  targetType: CouponTargetType;
  giftServiceId?: number;
}

export interface UpsertCouponDetailRuleRequest {
  couponDetailId: number;
  benefitType: CouponBenefitType;
  percent?: number;
  amount?: number;
}

// Filter interface for UI
export interface CouponFilter {
  activeStatus?: "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED";
  hasEnabledDetails?: boolean;
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
}
