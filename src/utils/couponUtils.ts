import type { Coupon } from '@/types';

/**
 * Utility functions for Coupon operations
 */

export type ActiveStatus = 'ACTIVE' | 'HIDDEN' | 'EXPIRED';

/**
 * Calculate active status based on coupon properties
 */
export const getActiveStatus = (coupon: Coupon): ActiveStatus => {
  const now = new Date();
  
  if (!coupon.status) {
    return 'HIDDEN';
  }
  
  const startAt = new Date(coupon.startAt);
  const endAt = new Date(coupon.endAt);
  
  if (now > endAt) {
    return 'EXPIRED';
  }
  
  if (now < startAt) {
    return 'HIDDEN'; // Not yet started
  }
  
  return 'ACTIVE';
};

/**
 * Format time window for display - Date only
 */
export const formatTimeWindow = (coupon: Coupon): string => {
  try {
    const startAt = new Date(coupon.startAt);
    const endAt = new Date(coupon.endAt);
    
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    return `${formatter.format(startAt)} - ${formatter.format(endAt)}`;
  } catch {
    return 'N/A';
  }
};

/**
 * Get display text for active status
 */
export const getActiveStatusText = (status: ActiveStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Kích hoạt';
    case 'HIDDEN':
      return 'Ẩn';
    case 'EXPIRED':
      return 'Hết hạn';
    default:
      return 'Không xác định';
  }
};

/**
 * Get color for active status
 */
export const getActiveStatusColor = (status: ActiveStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'HIDDEN':
      return 'default';
    case 'EXPIRED':
      return 'error';
    default:
      return 'default';
  }
};