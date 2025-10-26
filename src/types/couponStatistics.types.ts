// Coupon Statistics Types
export interface CouponStatistics {
  // Basic counts
  totalCoupons: number;
  activeCoupons: number;
  upcomingCoupons: number;
  expiredCoupons: number;
  hiddenCoupons: number;

  // Usage statistics
  totalRedemptions: number;
  uniqueCustomers: number;
  ordersWithCoupons: number;
  ordersWithoutCoupons: number;

  // Financial metrics
  totalDiscountAmount: number;
  totalRevenueBeforeDiscount: number;
  totalRevenueAfterDiscount: number;
  averageDiscountPercentage: number;
  averageDiscountPerOrder: number;
  averageOrderValueWithCoupon: number;
  averageOrderValueWithoutCoupon: number;

  // Efficiency metrics
  couponUsageRate: number;
  orderConversionRate: number;
  discountImpactRate: number;
}

export interface CouponPerformance {
  // Coupon basic info
  couponId: number;
  couponCode: string;
  couponName: string;
  description: string;
  kind: string;
  status: boolean;
  startDate: string;
  endDate: string;

  // Performance metrics
  usageCount: number;
  uniqueCustomers: number;
  enabledDetailsCount: number;
  totalDetailsCount: number;

  // Financial metrics
  totalDiscountValue: number;
  revenueWithCoupon: number;
  revenueBeforeDiscount: number;
  averageDiscountPerOrder: number;
  averageOrderValue: number;

  // Efficiency metrics
  usageRate: number;
  conversionRate: number;
  discountPercentage: number;

  // Time metrics
  daysActive: number;
  daysRemaining: number;
  lastUsedAt: string | null;

  // Detail breakdown
  discountPercentCount: number;
  discountAmountCount: number;
  freeProductCount: number;

  // Status classification
  statusLabel: string;
}

export interface CouponUsage {
  orderId: number;
  couponCode: string;
  couponName: string;
  discountAmount: number;
  orderTotalBeforeDiscount: number;
  orderTotalAfterDiscount: number;
  customerName: string;
  customerEmail: string;
  usedAt: string;
  movieName: string;
  cinemaName: string;
}

export interface CouponTypeStatistics {
  type: string;
  category: string;
  count: number;
  usageCount: number;
  totalDiscountValue: number;
  orderCount: number;
  averageDiscount: number;
}
