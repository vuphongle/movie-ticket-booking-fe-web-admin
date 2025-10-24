import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { useTranslation } from "react-i18next";
import type { CustomerRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

interface RevenueByCustomerTableProps {
  data?: CustomerRevenue[];
}

function RevenueByCustomerTable({ data }: RevenueByCustomerTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<CustomerRevenue> = [
    {
      title: t("REPORT_STT"),
      key: "index",
      width: "5%",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("REPORT_CUSTOMER_CODE"),
      dataIndex: "customerCode",
      key: "customerCode",
      width: "10%",
    },
    {
      title: t("REPORT_CUSTOMER_NAME"),
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
    },
    {
      title: t("REPORT_EMAIL"),
      dataIndex: "customerEmail",
      key: "customerEmail",
      width: "15%",
    },
    {
      title: t("REPORT_PHONE"),
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: "10%",
    },
    {
      title: t("REPORT_TOTAL_ORDERS"),
      dataIndex: "totalOrders",
      key: "totalOrders",
      width: "10%",
      sorter: (a, b) => a.totalOrders - b.totalOrders,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
    },
    {
      title: t("REPORT_TOTAL_TICKETS"),
      dataIndex: "totalTickets",
      key: "totalTickets",
      width: "10%",
      sorter: (a, b) => a.totalTickets - b.totalTickets,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => text + " " + t("REPORT_TICKET_UNIT"),
    },
    {
      title: t("REPORT_REVENUE"),
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: "15%",
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      defaultSortOrder: "descend" as SortOrder,
      render: (text: number) => formatCurrency(text),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.customerId}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) =>
          `${t("REPORT_TOTAL")} ${total} ${t("REPORT_TOTAL_CUSTOMERS")}`,
      }}
      style={{ marginTop: 20 }}
    />
  );
}

export default RevenueByCustomerTable;
