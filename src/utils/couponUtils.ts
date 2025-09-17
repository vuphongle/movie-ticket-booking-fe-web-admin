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
  
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);

  if (now > endDate) {
    return 'EXPIRED';
  }

  if (now < startDate) {
    return 'HIDDEN'; // Not yet started
  }
  
  return 'ACTIVE';
};

/**
 * Format time window for display - Date only
 */
export const formatTimeWindow = (coupon: Coupon): string => {
  try {
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
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