import { Table, type TableColumnsType } from "antd";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency } from "@utils/functionUtils";
import type { CinemaRevenue } from "@/types/dashboard.types";

const columns: TableColumnsType<CinemaRevenue> = [
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
    render: (text: number) => {
      return text?.toString() || "0";
    },
  },
  {
    title: "Tổng doanh thu",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    width: "25%",
    render: (text: number) => {
      return formatCurrency(text);
    },
  },
];

interface TableCinemaRevenueProps {
  data: CinemaRevenue[];
}

function TableCinemaRevenue({ data }: TableCinemaRevenueProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.cinemaId}
      pagination={{ pageSize: 5 }}
    />
  );
}

export default TableCinemaRevenue;
