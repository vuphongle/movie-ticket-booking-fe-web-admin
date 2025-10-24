import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CustomerMovieRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

interface CustomerMovieRevenueTableProps {
  data?: CustomerMovieRevenue[];
}

function CustomerMovieRevenueTable({ data }: CustomerMovieRevenueTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<CustomerMovieRevenue> = [
    {
      title: t("REPORT_STT"),
      key: "index",
      width: "5%",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("REPORT_MOVIE_CODE"),
      dataIndex: "movieCode",
      key: "movieCode",
      width: "10%",
    },
    {
      title: t("REPORT_MOVIE_NAME"),
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
      title: t("REPORT_TICKET_REVENUE_SHORT"),
      dataIndex: "ticketRevenue",
      key: "ticketRevenue",
      width: "12%",
      sorter: (a, b) => a.ticketRevenue - b.ticketRevenue,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => formatCurrency(text),
    },
    {
      title: t("REPORT_SERVICE_REVENUE_SHORT"),
      dataIndex: "serviceRevenue",
      key: "serviceRevenue",
      width: "12%",
      sorter: (a, b) => a.serviceRevenue - b.serviceRevenue,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => formatCurrency(text),
    },
    {
      title: t("REPORT_TOTAL_REVENUE_SHORT"),
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
      rowKey={(record) => `${record.customerId}-${record.movieId}`}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
}

export default CustomerMovieRevenueTable;
