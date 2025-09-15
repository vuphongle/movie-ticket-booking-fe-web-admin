// Base entity types
export interface Genre {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Director {
  id: string | number;
  name: string;
  bio?: string;
  nationality?: string;
  birthDate?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Actor {
  id: string | number;
  name: string;
  bio?: string;
  nationality?: string;
  birthDate?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Country {
  id: string | number;
  name: string;
  code?: string;
  flag?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Extended Movie interface
export interface Movie {
  id: string | number;
  name: string;
  description?: string;
  duration?: number;
  releaseDate?: string;
  releaseYear?: number;
  language?: string;
  poster?: string;
  trailer?: string;
  rating?: number;
  status?: string;
  countryId?: string | number;
  country?: Country;
  genres?: Genre[];
  directors?: Director[];
  actors?: Actor[];
  createdAt?: string;
  updatedAt?: string;
}

// Form data types
export interface MovieFormData {
  name: string;
  description?: string;
  duration?: number;
  releaseDate?: string;
  language?: string;
  poster?: string;
  trailer?: string;
  rating?: number;
  status?: string;
  countryId?: string | number;
  genreIds?: (string | number)[];
  directorIds?: (string | number)[];
  actorIds?: (string | number)[];
}

// Image related types
export interface Image {
  id: string | number;
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageUploadParams {
  file: File;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Review types
export interface Review {
  id: string | number;
  movieId: string | number;
  movie?: Movie;
  userId: string | number;
  user?: {
    id: string | number;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Component props interfaces
export interface ReviewTableProps {
  data: Review[];
  movieId: string | number;
}

export interface MovieReviewModalUpdateProps {
  review: Review;
  open: boolean;
  onCancel: () => void;
  onUpdateReview: (review: Review) => void;
  movieId: string | number;
}

export interface ReviewListProps {
  data: Review[];
  movieId: string | number;
}