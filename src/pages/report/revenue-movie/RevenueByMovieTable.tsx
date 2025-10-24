import { Table } from "antd";
import type { ColumnType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@utils/functionUtils";
import type { MovieRevenue } from "@/types/dashboard.types";

interface RevenueByMovieTableProps {
  data?: MovieRevenue[];
}

function RevenueByMovieTable({ data }: RevenueByMovieTableProps) {
  const { t } = useTranslation();

  const columns: ColumnType<MovieRevenue>[] = [
    {
      title: t("REPORT_MOVIE_NAME"),
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
      title: t("REPORT_TOTAL_TICKETS_SOLD"),
      dataIndex: "totalTickets",
      key: "totalTickets",
      width: "20%",
      sorter: (a, b) => a.totalTickets - b.totalTickets,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => {
        return text + " " + t("REPORT_TICKET_UNIT_LOWER");
      },
    },
    {
      title: t("REPORT_TOTAL_REVENUE"),
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
