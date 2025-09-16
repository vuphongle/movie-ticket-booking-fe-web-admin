export type SeatType = 'NORMAL' | 'VIP' | 'COUPLE';
export type GraphicsType = '_2D' | '_3D';
export type ScreeningTimeType = 'SUAT_CHIEU_SOM' | 'SUAT_CHIEU_THEO_LICH';
export type DayType = 'WEEKDAY' | 'WEEKEND';
export type AuditoriumType = 'STANDARD' | 'IMAX' | 'GOLDCLASS';

export interface BaseTicketPrice {
  id: number;
  seatType: SeatType;
  graphicsType: GraphicsType;
  screeningTimeType: ScreeningTimeType;
  dayType: DayType;
  auditoriumType: AuditoriumType;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBaseTicketPriceRequest {
  seatType: SeatType;
  graphicsType: GraphicsType;
  screeningTimeType: ScreeningTimeType;
  dayType: DayType;
  auditoriumType: AuditoriumType;
  price: number;
}

export interface UpdateBaseTicketPriceRequest extends CreateBaseTicketPriceRequest {
  id: number;
}