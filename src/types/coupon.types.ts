export interface Coupon {
  id: string;
  code: string;
  discount: number;
  quantity: number;
  used?: number;
  status: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponRequest {
  code: string;
  discount: number;
  quantity: number;
  status: boolean;
  startDate: string;
  endDate: string;
}

export interface UpdateCouponRequest extends CreateCouponRequest {
  id: string;
}

export interface CouponModalProps {
  coupon: Coupon;
  open: boolean;
  onCancel: () => void;
}

export interface CouponTableProps {
  data: Coupon[];
}