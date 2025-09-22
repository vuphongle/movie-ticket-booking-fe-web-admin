export interface ShowtimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface SlotSelection {
  slotId: number;
  spans: number;
  startTime: string;
  endTime: string;
}

export interface ShowtimeFormData {
  auditoriumId: string;
  movieId: number;
  date: string;
  slotId: number;
  graphicsType: string;
  translationType: string;
}

export interface ShowtimeApiPayload {
  auditoriumId: string;
  movieId: number;
  date: string;
  startTime: string;
  endTime: string;
  graphicsType: string;
  translationType: string;
}

// Bulk showtime creation types
export interface BulkShowtimeFormData {
  movieId: number;
  auditoriumId: string;
  dateFrom: string;
  dateTo: string;
  slotId: number;
  graphicsType: string;
  translationType: string;
  daysOfWeek: number[];
  conflictPolicy: 'FAIL' | 'SKIP';
}

export interface BulkShowtimeApiPayload {
  movieId: number;
  auditoriumId: number;
  dateFrom: string;
  dateTo: string;
  startTime: string;
  endTime: string;
  graphicsType: string;
  translationType: string;
  daysOfWeek: number[];
  conflictPolicy: 'FAIL' | 'SKIP';
}

export interface ConflictDetail {
  date: string;
  conflictMovie?: string;
  conflictTimeRange?: string;
  reason: string;
}

export interface BulkShowtimeResponse {
  totalRequested: number;
  successfullyCreated: number;
  conflictsDetected: number;
  skipped: number;
  createdShowtimes: Showtime[];
  conflicts: ConflictDetail[];
  skippedDates: string[];
  message: string;
}

export interface ShowtimeResponse {
  cinema: {
    id: string;
    name: string;
  };
  auditoriums: AuditoriumResponse[];
}

export interface AuditoriumResponse {
  auditorium: {
    id: string;
    name: string;
  };
  showtimes: Showtime[];
}

export interface Showtime {
  id: string;
  movie: {
    id: number;
    name: string;
    duration: number;
    showDate: string;
    graphics: string[];
    translations: string[];
  };
  date: string;
  startTime: string;
  endTime: string;
  graphicsType: string;
  translationType: string;
  status: string;
}

export interface ShowtimeError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Error codes from BE
export enum ShowtimeErrorCode {
  SLOT_CONFLICT = "409_SLOT_CONFLICT",
  INVALID_SLOT = "422_INVALID_SLOT", 
  SPAN_OVERFLOW = "422_SPAN_OVERFLOW",
  MOVIE_TOO_LONG = "422_MOVIE_TOO_LONG",
  BAD_INPUT = "400_BAD_INPUT",
}

export interface SlotValidationResult {
  isValid: boolean;
  errorCode?: ShowtimeErrorCode;
  message?: string;
}

export interface MovieWithSlotInfo {
  id: number;
  name: string;
  duration: number;
  showDate: string;
  graphics: string[];
  translations: string[];
  spans: number;
  effectiveRuntime: number;
  availableSlots: ShowtimeSlot[];
}