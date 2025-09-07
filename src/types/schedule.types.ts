// Movie types
export interface Movie {
  id: string | number;
  name: string;
  description?: string;
  duration?: number;
  releaseDate?: string;
  director?: string;
  cast?: string;
  genre?: string;
  language?: string;
  country?: string;
  poster?: string;
  trailer?: string;
  rating?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Schedule types
export interface Schedule {
  id: string | number;
  movieId: string | number;
  movie: Movie;
  startDate: string;
  endDate: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Form data types
export interface ScheduleFormData {
  movieId: string | number;
  startDate: string;
  endDate: string;
}

// Props types
export interface ScheduleTableProps {
  data: Schedule[];
  movies: Movie[];
}

export interface ModalUpdateProps {
  open: boolean;
  onCancel: () => void;
  schedule: Schedule;
  movies: Movie[];
}
