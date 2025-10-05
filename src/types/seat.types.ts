export interface Seat {
  id: number;
  code: string;
  type: "NORMAL" | "VIP" | "COUPLE";
  status: boolean;
  rowIndex: number;
  colIndex: number;
  auditoriumId: number;
}

export interface Auditorium {
  id: number;
  name: string;
  totalSeats: number;
  type: "STANDARD" | "IMAX" | "GOLDCLASS";
  cinemaId: number;
}

export interface SeatFormValues {
  type: "NORMAL" | "VIP" | "COUPLE";
  status: boolean;
}

export interface RowSeatUpdateValues {
  type: "NORMAL" | "VIP" | "COUPLE";
  status: boolean;
  rowIndex: number;
  auditoriumId: number;
}

export interface AuditoriumCreateValues {
  name: string;
  type: "STANDARD" | "IMAX" | "GOLDCLASS";
  totalRows: number;
  totalColumns: number;
  cinemaId: number;
}
