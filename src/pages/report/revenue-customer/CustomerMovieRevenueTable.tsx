import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import type { CustomerMovieRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

const columns: ColumnsType<CustomerMovieRevenue> = [
  {
    title: "STT",
    key: "index",
    width: "5%",
    render: (_text, _record, index) => index + 1,
  },
  {
    title: "Mã phim",
    dataIndex: "movieCode",
    key: "movieCode",
    width: "10%",
  },
  {
    title: "Tên phim",
    dataIndex: "",
    key: "movie",
    width: "20%",
    render: (_text, record) => (
      <RouterLink to={`/admin/movies/${record.movieId}/detail`}>
        {record.movieName}
      </RouterLink>
    ),
  },
  {
    title: "Số đơn hàng",
    dataIndex: "totalOrders",
    key: "totalOrders",
    width: "10%",
    sorter: (a, b) => a.totalOrders - b.totalOrders,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
  },
  {
    title: "Tổng vé",
    dataIndex: "totalTickets",
    key: "totalTickets",
    width: "10%",
    sorter: (a, b) => a.totalTickets - b.totalTickets,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => text + " Vé",
  },
  {
    title: "DT vé",
    dataIndex: "ticketRevenue",
    key: "ticketRevenue",
    width: "12%",
    sorter: (a, b) => a.ticketRevenue - b.ticketRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => formatCurrency(text),
  },
  {
    title: "DT dịch vụ",
    dataIndex: "serviceRevenue",
    key: "serviceRevenue",
    width: "12%",
    sorter: (a, b) => a.serviceRevenue - b.serviceRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    render: (text: number) => formatCurrency(text),
  },
  {
    title: "Tổng DT",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    width: "15%",
    sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    defaultSortOrder: "descend" as SortOrder,
    render: (text: number) => formatCurrency(text),
  },
];

interface CustomerMovieRevenueTableProps {
  data?: CustomerMovieRevenue[];
}

function CustomerMovieRevenueTable({ data }: CustomerMovieRevenueTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => `${record.customerId}-${record.movieId}`}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
}

export default CustomerMovieRevenueTable;
