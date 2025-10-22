import type { User } from "./auth.types";

// Blog type enum
export type BlogType = "PHIM_CHIEU_RAP" | "TONG_HOP_PHIM" | "PHIM_NEFLIX";

// View history interface
export interface ViewHistory {
  id: number;
  userId: number;
  blogId: number;
  viewedAt: string;
}

// Blog interface
export interface Blog {
  id: number;
  title: string;
  content: string;
  description: string;
  status: boolean;
  type: BlogType;
  thumbnail?: string;
  user: User;
  viewHistories?: ViewHistory[] | null;
  createdAt: string;
  updatedAt: string;
}

// Create blog request
export interface CreateBlogRequest {
  title: string;
  content: string;
  description: string;
  status: boolean;
  type: BlogType;
  thumbnail?: string;
}

// Update blog request
export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  description?: string;
  status?: boolean;
  type?: BlogType;
  thumbnail?: string;
}
