import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import type { MovieCinemaRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

const columns: ColumnsType<MovieCinemaRevenue> = [
  {
    title: "Rạp chiếu",
    dataIndex: "",
    key: "cinema",
    render: (_text, record) => (
      <RouterLink to={`/admin/cinemas/${record.cinemaId}/detail`}>
        {record.cinemaName}
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

interface MovieCinemaRevenueTableProps {
  data?: MovieCinemaRevenue[];
}

function MovieCinemaRevenueTable({ data }: MovieCinemaRevenueTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => `${record.movieId}-${record.cinemaId}`}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
}

export default MovieCinemaRevenueTable;
