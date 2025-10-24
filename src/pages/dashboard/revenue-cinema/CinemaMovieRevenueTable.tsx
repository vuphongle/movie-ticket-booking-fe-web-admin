import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import type { CinemaMovieRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

const columns: ColumnsType<CinemaMovieRevenue> = [
  {
    title: "Tên phim",
    dataIndex: "",
    key: "movie",
    render: (_text, record) => (
      <RouterLink to={`/admin/movies/${record.movieId}/detail`}>
        {record.movieName}
      </RouterLink>
    ),
  },
  {
    title: "Tổng vé bán ra",
    dataIndex: "totalTickets",
    key: "totalTickets",
    width: "12%",
    sorter: (a, b) => a.totalTickets - b.totalTickets,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => text + " Vé",
  },
  {
    title: "Doanh thu vé",
    dataIndex: "ticketRevenue",
    key: "ticketRevenue",
    width: "15%",
    sorter: (a, b) => a.ticketRevenue - b.ticketRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => formatCurrency(text),
  },
  {
    title: "Doanh thu DV",
    dataIndex: "serviceRevenue",
    key: "serviceRevenue",
    width: "15%",
    sorter: (a, b) => a.serviceRevenue - b.serviceRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => formatCurrency(text),
  },
  {
    title: "Tổng doanh thu",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    width: "15%",
    sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => formatCurrency(text),
  },
];

interface CinemaMovieRevenueTableProps {
  data?: CinemaMovieRevenue[];
}

function CinemaMovieRevenueTable({ data }: CinemaMovieRevenueTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => `${record.cinemaId}-${record.movieId}`}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
}

export default CinemaMovieRevenueTable;
