import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import type { CustomerRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

const columns: ColumnsType<CustomerRevenue> = [
  {
    title: "STT",
    key: "index",
    width: "5%",
    render: (_text, _record, index) => index + 1,
  },
  {
    title: "Mã KH",
    dataIndex: "customerCode",
    key: "customerCode",
    width: "10%",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "customerName",
    key: "customerName",
    width: "15%",
  },
  {
    title: "Email",
    dataIndex: "customerEmail",
    key: "customerEmail",
    width: "15%",
  },
  {
    title: "Số ĐT",
    dataIndex: "customerPhone",
    key: "customerPhone",
    width: "10%",
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
    title: "Doanh thu",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    width: "15%",
    sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    defaultSortOrder: "descend" as SortOrder,
    render: (text: number) => formatCurrency(text),
  },
];

interface RevenueByCustomerTableProps {
  data?: CustomerRevenue[];
}

function RevenueByCustomerTable({ data }: RevenueByCustomerTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.customerId}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} khách hàng`,
      }}
      style={{ marginTop: 20 }}
    />
  );
}

export default RevenueByCustomerTable;
