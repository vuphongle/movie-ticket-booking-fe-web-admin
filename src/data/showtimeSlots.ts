/**
 * Hệ thống ca chiếu cố định
 * 6 ca chiếu, mỗi ca 150 phút (2.5 giờ)
 * Buffer mặc định = 20 phút (trailer + vệ sinh)
 */

import i18n from "@/locales/i18n";

export interface TimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
}

/**
 * Generate time slots with translations
 */
function getTimeSlots(): TimeSlot[] {
  return [
    {
      id: 1,
      label: i18n.t("SLOT_1"),
      startTime: "08:00",
      endTime: "10:30",
      duration: 150,
    },
    {
      id: 2,
      label: i18n.t("SLOT_2"),
      startTime: "10:30",
      endTime: "13:00",
      duration: 150,
    },
    {
      id: 3,
      label: i18n.t("SLOT_3"),
      startTime: "13:00",
      endTime: "15:30",
      duration: 150,
    },
    {
      id: 4,
      label: i18n.t("SLOT_4"),
      startTime: "15:30",
      endTime: "18:00",
      duration: 150,
    },
    {
      id: 5,
      label: i18n.t("SLOT_5"),
      startTime: "18:00",
      endTime: "20:30",
      duration: 150,
    },
    {
      id: 6,
      label: i18n.t("SLOT_6"),
      startTime: "20:30",
      endTime: "23:00",
      duration: 150,
    },
  ];
}

export const TIME_SLOTS: TimeSlot[] = getTimeSlots();

// Buffer time for trailers and cleaning (in minutes)
export const DEFAULT_BUFFER_TIME = 20;

// Maximum number of slots a movie can span
export const MAX_SLOT_SPANS = 2;

/**
 * Calculate effective runtime including buffer time
 */
export function calculateEffectiveRuntime(movieDuration: number): number {
  return movieDuration + DEFAULT_BUFFER_TIME;
}

/**
 * Calculate how many slots a movie needs
 */
export function calculateSlotSpans(movieDuration: number): number {
  const effectiveRuntime = calculateEffectiveRuntime(movieDuration);
  return Math.ceil(effectiveRuntime / 150);
}

/**
 * Get slot by ID (regenerate to get updated translations)
 */
export function getSlotById(slotId: number): TimeSlot | undefined {
  return getTimeSlots().find((slot) => slot.id === slotId);
}

/**
 * Get start time for a slot
 */
export function getSlotStartTime(slotId: number): string | null {
  const slot = getSlotById(slotId);
  return slot ? slot.startTime : null;
}

/**
 * Get end time for a movie spanning multiple slots
 */
export function getSlotEndTime(
  startSlotId: number,
  spans: number,
): string | null {
  const endSlotId = startSlotId + spans - 1;
  const endSlot = getSlotById(endSlotId);
  return endSlot ? endSlot.endTime : null;
}

/**
 * Check if combination doesn't overflow available slots
 */
export function isValidSlotCombination(
  startSlotId: number,
  spans: number,
): boolean {
  // Check if spans exceed maximum allowed
  if (spans > MAX_SLOT_SPANS) {
    return false;
  }

  // Check if combination doesn't overflow available slots
  const endSlotId = startSlotId + spans - 1;
  return endSlotId <= getTimeSlots().length;
}

/**
 * Get preview time range for a slot selection (shows slot boundaries for blocking)
 */
export function getPreviewTimeRange(
  slotId: number,
  spans: number,
): {
  startTime: string;
  endTime: string;
} | null {
  if (!isValidSlotCombination(slotId, spans)) {
    return null;
  }

  const startTime = getSlotStartTime(slotId);
  const endTime = getSlotEndTime(slotId, spans);

  if (!startTime || !endTime) {
    return null;
  }

  return { startTime, endTime };
}

/**
 * Get actual runtime time range (shows real movie end time)
 */
export function getActualTimeRange(
  slotId: number,
  movieDuration: number,
): {
  startTime: string;
  endTime: string;
} | null {
  const startTime = getSlotStartTime(slotId);
  if (!startTime) return null;

  // Calculate actual end time = start + runtime + buffer
  const effectiveRuntime = calculateEffectiveRuntime(movieDuration);
  const [startHour, startMin] = startTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = startTotalMinutes + effectiveRuntime;

  const endHour = Math.floor(endTotalMinutes / 60);
  const endMin = endTotalMinutes % 60;

  const endTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

  return { startTime, endTime };
}

/**
 * Get available slots for a movie (excluding invalid combinations)
 */
export function getAvailableSlots(movieDuration: number): TimeSlot[] {
  const spans = calculateSlotSpans(movieDuration);
  const slots = getTimeSlots();

  return slots.filter((slot) => isValidSlotCombination(slot.id, spans));
}

/**
 * Convert slot selection to start/end times for API (uses slot boundaries for blocking)
 */
export function slotToApiTimes(
  slotId: number,
  movieDuration: number,
): {
  startTime: string;
  endTime: string;
} | null {
  const spans = calculateSlotSpans(movieDuration);
  return getPreviewTimeRange(slotId, spans);
}

/**
 * Convert slot selection to actual runtime times for display
 */
export function slotToActualTimes(
  slotId: number,
  movieDuration: number,
): {
  startTime: string;
  endTime: string;
} | null {
  return getActualTimeRange(slotId, movieDuration);
}

/**
 * Check if a movie requires multiple slots
 */
export function requiresMultipleSlots(movieDuration: number): boolean {
  return calculateSlotSpans(movieDuration) > 1;
}

/**
 * Calculate actual end time from existing showtime data
 */
export function calculateActualEndTime(
  startTime: string,
  movieDuration: number,
): string {
  const effectiveRuntime = calculateEffectiveRuntime(movieDuration);
  const [startHour, startMin] = startTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = startTotalMinutes + effectiveRuntime;

  const endHour = Math.floor(endTotalMinutes / 60);
  const endMin = endTotalMinutes % 60;

  return `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
}

/**
 * Get slot options for Select component
 */
export function getSlotSelectOptions(movieDuration?: number) {
  const slots = getTimeSlots();

  if (!movieDuration) {
    return slots.map((slot) => ({
      label: slot.label,
      value: slot.id,
      disabled: false,
    }));
  }

  const spans = calculateSlotSpans(movieDuration);

  return slots.map((slot) => {
    // Check if this slot + spans would overflow
    const wouldOverflow = slot.id + spans - 1 > slots.length;

    return {
      label: slot.label,
      value: slot.id,
      disabled: wouldOverflow,
    };
  });
}
