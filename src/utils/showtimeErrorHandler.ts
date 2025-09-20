import { message } from "antd";
import { ShowtimeErrorCode } from "@/types/showtime.types";
import { calculateSlotSpans } from "@/data/showtimeSlots";
import i18n from "@/locales/i18n";

interface ErrorResponse {
  data?: {
    message?: string;
    code?: string;
    error?: string;
  };
  status?: number;
}

/**
 * Map error codes từ BE sang thông báo phù hợp
 */
export function getShowtimeErrorMessage(error: ErrorResponse): string {
  const errorCode = error.data?.code || error.data?.error;
  const defaultMessage = error.data?.message || i18n.t("BAD_INPUT_ERROR");

  switch (errorCode) {
    case ShowtimeErrorCode.SLOT_CONFLICT:
      return i18n.t("SLOT_CONFLICT_ERROR");
    
    case ShowtimeErrorCode.INVALID_SLOT:
      return i18n.t("INVALID_SLOT_ERROR");
    
    case ShowtimeErrorCode.SPAN_OVERFLOW:
      return i18n.t("SPAN_OVERFLOW_ERROR");
    
    case ShowtimeErrorCode.MOVIE_TOO_LONG:
      return i18n.t("MOVIE_TOO_LONG_ERROR");
    
    case ShowtimeErrorCode.BAD_INPUT:
      return i18n.t("BAD_INPUT_ERROR");
    
    default:
      return defaultMessage;
  }
}

/**
 * Handle và hiển thị error message cho showtime operations
 */
export function handleShowtimeError(error: ErrorResponse): void {
  const errorMessage = getShowtimeErrorMessage(error);
  message.error(errorMessage);
}

/**
 * Validate slot selection trước khi submit
 */
export function validateSlotSelection(
  movieDuration: number, 
  slotId: number, 
  maxSlots: number = 6
): { isValid: boolean; errorMessage?: string } {
  
  if (!movieDuration || movieDuration <= 0) {
    return {
      isValid: false,
      errorMessage: i18n.t("BAD_INPUT_ERROR")
    };
  }

  if (!slotId || slotId < 1 || slotId > maxSlots) {
    return {
      isValid: false,
      errorMessage: i18n.t("SLOT_REQUIRED")
    };
  }

  // Calculate spans using consistent function  
  const spans = calculateSlotSpans(movieDuration);

  if (spans > 2) {
    return {
      isValid: false,
      errorMessage: i18n.t("MOVIE_TOO_LONG_ERROR")
    };
  }

  // Check if selection overflows
  const endSlot = slotId + spans - 1;
  if (endSlot > maxSlots) {
    return {
      isValid: false,
      errorMessage: i18n.t("SPAN_OVERFLOW_ERROR")
    };
  }

  return { isValid: true };
}

/**
 * Check if error is related to showtime operations
 */
export function isShowtimeError(error: ErrorResponse): boolean {
  const errorCode = error.data?.code || error.data?.error;
  return Object.values(ShowtimeErrorCode).includes(errorCode as ShowtimeErrorCode);
}

/**
 * Parse error response and extract meaningful information
 */
export function parseShowtimeError(error: any): ErrorResponse {
  // Handle different error formats from RTK Query
  if (error?.data) {
    return error;
  }
  
  if (error?.error) {
    return {
      data: {
        message: error.error,
        code: error.status?.toString()
      },
      status: error.status
    };
  }

  return {
    data: {
      message: i18n.t("BAD_INPUT_ERROR"),
      code: "UNKNOWN_ERROR"
    }
  };
}