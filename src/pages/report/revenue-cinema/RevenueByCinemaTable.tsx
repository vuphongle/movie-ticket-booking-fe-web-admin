import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import type { CinemaRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

const columns: ColumnsType<CinemaRevenue> = [
  {
    title: "Rạp chiếu",
    dataIndex: "",
    key: "cinema",
    render: (_text, record) => {
      return (
        <RouterLink to={`/admin/cinemas/${record.cinemaId}/detail`}>
          {record.cinemaName}
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
      return text + " Vé";
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

interface RevenueByCinemaTableProps {
  data?: CinemaRevenue[];
}

function RevenueByCinemaTable({ data }: RevenueByCinemaTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.cinemaId}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
}

export default RevenueByCinemaTable;
