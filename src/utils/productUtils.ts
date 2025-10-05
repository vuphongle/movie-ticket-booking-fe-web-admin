// Utility để mapping unit values và hiển thị text có ý nghĩa
export const UNIT_OPTIONS = [
  { labelKey: "PIECE", value: "piece" },
  { labelKey: "BOX", value: "box" },
  { labelKey: "BOTTLE", value: "bottle" },
  { labelKey: "CAN", value: "can" },
  { labelKey: "PACK", value: "pack" },
  { labelKey: "CUP", value: "cup" },
  { labelKey: "BAG", value: "bag" },
  { labelKey: "SET", value: "set" },
] as const;

export type UnitValue = (typeof UNIT_OPTIONS)[number]["value"];

/**
 * Lấy text hiển thị cho unit value với i18n
 */
export const getUnitLabel = (
  value: string | null | undefined,
  t: any,
): string => {
  if (!value) return "-";

  const unitOption = UNIT_OPTIONS.find((option) => option.value === value);
  if (unitOption) {
    return t(unitOption.labelKey);
  }

  // Fallback về giá trị gốc nếu không tìm thấy
  return value;
};

/**
 * Lấy danh sách options cho Select component với i18n
 */
export const getUnitOptions = (t: any) => {
  return UNIT_OPTIONS.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }));
};
