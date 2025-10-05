export interface Cinema {
  id: number;
  name: string;
  address: string;
  mapLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface CinemaCreateValues {
  name: string;
  address: string;
  mapLocation: string;
}

export interface CinemaUpdateValues extends CinemaCreateValues {
  cinemaId: number;
}
