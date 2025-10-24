import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CinemaMovieRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

interface CinemaMovieRevenueTableProps {
  data?: CinemaMovieRevenue[];
}

function CinemaMovieRevenueTable({ data }: CinemaMovieRevenueTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<CinemaMovieRevenue> = [
    {
      title: t("REPORT_MOVIE_NAME"),
      dataIndex: "",
      key: "movie",
      render: (_text, record) => (
        <RouterLink to={`/admin/movies/${record.movieId}/detail`}>
          {record.movieName}
        </RouterLink>
      ),
    },
    {
      title: t("REPORT_TOTAL_TICKETS_SOLD"),
      dataIndex: "totalTickets",
      key: "totalTickets",
      width: "12%",
      sorter: (a, b) => a.totalTickets - b.totalTickets,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => text + " " + t("REPORT_TICKET_UNIT"),
    },
    {
      title: t("REPORT_TICKET_REVENUE"),
      dataIndex: "ticketRevenue",
      key: "ticketRevenue",
      width: "15%",
      sorter: (a, b) => a.ticketRevenue - b.ticketRevenue,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => formatCurrency(text),
    },
    {
      title: t("REPORT_SERVICE_REVENUE"),
      dataIndex: "serviceRevenue",
      key: "serviceRevenue",
      width: "15%",
      sorter: (a, b) => a.serviceRevenue - b.serviceRevenue,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => formatCurrency(text),
    },
    {
      title: t("REPORT_TOTAL_REVENUE"),
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: "15%",
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => formatCurrency(text),
    },
  ];

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
