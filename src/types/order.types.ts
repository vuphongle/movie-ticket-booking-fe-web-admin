// Order related types
export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "RETURNED";

export interface TicketItem {
  id: number;
  seat: {
    id: number;
    code: string;
    type: "NORMAL" | "VIP" | "COUPLE";
  };
  price: number;
}

export interface ServiceItem {
  id: number;
  additionalService: {
    id: number;
    name: string;
  };
  quantity: number;
  price: number;
}

// Backend có thể trả về date dạng array [year, month, day, hour, minute, second, nano]
export type DateArray = [
  number,
  number,
  number,
  number?,
  number?,
  number?,
  number?,
];

export interface Order {
  id: number;
  status: OrderStatus;
  showtime: {
    id: number;
    startTime: string;
    endTime: string;
    date: string | DateArray; // Backend có thể trả về array
    movie: {
      id: number;
      name: string;
    };
    auditorium: {
      id: number;
      name: string;
      cinema: {
        id: number;
        name: string;
      };
    };
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  ticketItems: TicketItem[];
  serviceItems: ServiceItem[];
  tempPrice: number | null; // Backend có thể trả về null
  discount?: number | null; // Backend có thể trả về null
  discountPrice: number | null; // Backend có thể trả về null
  totalPrice: number | null; // Backend có thể trả về null
  createdAt: string | DateArray; // Backend trả về array
  updatedAt?: string | DateArray; // Backend trả về array
  qrCodePath?: string | null;
  requestSnapshot?: string;
  returnedByUser?: {
    id: number;
    name: string;
    email: string;
  } | null;
  returnedAt?: string | DateArray | null;
  returnedReason?: string | null;
}
