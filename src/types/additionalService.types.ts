export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  status: boolean;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdditionalServiceRequest {
  name: string;
  description: string;
  price: number;
  status: boolean;
  thumbnail: string;
}

export interface UpdateAdditionalServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  status?: boolean;
  thumbnail?: string;
}

export interface AdditionalServiceImage {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}