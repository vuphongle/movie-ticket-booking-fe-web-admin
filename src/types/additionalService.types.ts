export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  type: "SINGLE" | "COMBO";
  productId?: number; // Chỉ có khi type = SINGLE
  defaultQuantity?: number; // Chỉ có khi type = SINGLE
  status: boolean;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  items?: AdditionalServiceItem[]; // Chỉ có khi type = COMBO
}

export interface AdditionalServiceItem {
  id: string;
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  unit: string;
  thumbnail: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdditionalServiceRequest {
  name: string;
  description: string;
  type: "SINGLE" | "COMBO";
  productId?: number; // Required khi type = SINGLE
  defaultQuantity?: number; // Required khi type = SINGLE
  status: boolean;
  thumbnail?: string;
  items?: AdditionalServiceItemRequest[]; // Required khi type = COMBO
}

export interface AdditionalServiceItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateAdditionalServiceRequest {
  name?: string;
  description?: string;
  type?: "SINGLE" | "COMBO";
  productId?: number;
  defaultQuantity?: number;
  status?: boolean;
  thumbnail?: string;
  items?: AdditionalServiceItemRequest[];
}

export interface AdditionalServiceImage {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}