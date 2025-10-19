// Dashboard types
export interface DashboardData {
  revenueToday?: number;
  countLatestUsers?: number;
  totalTicketsCurrentMonth?: number;
  revenueCurrentMonth?: number;
  topViewBlogs?: TopViewBlog[];
  revenueByMonth?: RevenueByMonth[];
  movieRevenues?: MovieRevenue[];
  cinemaRevenues?: CinemaRevenue[];
}

export interface TopViewBlog {
  id: number;
  title: string;
  viewCount: number;
}

export interface RevenueByMonth {
  month: number;
  year: number;
  revenue: number;
}

export interface MovieRevenue {
  movieId: number;
  movieName: string;
  totalTickets: number;
  totalRevenue: number;
}

export interface CinemaRevenue {
  cinemaId: number;
  cinemaName: string;
  totalTickets: number;
  totalRevenue: number;
}

export interface RevenueQueryParams {
  startDate?: string;
  endDate?: string;
}
