import { TargetType, BenefitType } from "@/types";

export const TARGET_TYPE_COLORS: Record<TargetType, string> = {
  TICKET: "blue",
  ADDITIONAL_SERVICE: "green", 
  PRODUCT: "purple",
};

export const BENEFIT_TYPE_COLORS: Record<BenefitType, string> = {
  DISCOUNT_PERCENT: "orange",
  DISCOUNT_AMOUNT: "red",
  FREE_PRODUCT: "green",
};

export const RESPONSIVE_TABLE_BREAKPOINTS = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
} as const;