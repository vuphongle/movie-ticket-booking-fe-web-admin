import { Table } from "antd";
import type { ColumnType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency } from "@utils/functionUtils";
import type { MovieRevenue } from "@/types/dashboard.types";

const columns: ColumnType<MovieRevenue>[] = [
  {
    title: "Tên phim",
    dataIndex: "",
    key: "movie",
    width: "55%",
    render: (_text, record) => {
      return (
        <RouterLink to={`/admin/movies/${record.movieId}/detail`}>
          {record.movieName}
        </RouterLink>
      );
    },
  },
  {
    title: "Tổng vé bán ra",
    dataIndex: "totalTickets",
    key: "totalTickets",
    width: "20%",
    sorter: (a, b) => a.totalTickets - b.totalTickets,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => {
      return text + " vé";
    },
  },
  {
    title: "Tổng doanh thu",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    width: "25%",
    sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => {
      return formatCurrency(text);
    },
  },
];

interface RevenueByMovieTableProps {
  data?: MovieRevenue[];
}

function RevenueByMovieTable({ data }: RevenueByMovieTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.movieId}
      style={{ marginTop: 20 }}
    />
  );
}

export default RevenueByMovieTable;
