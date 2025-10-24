import { Table, type TableColumnsType } from "antd";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@utils/functionUtils";
import type { CinemaRevenue } from "@/types/dashboard.types";

interface TableCinemaRevenueProps {
  data: CinemaRevenue[];
}

function TableCinemaRevenue({ data }: TableCinemaRevenueProps) {
  const { t } = useTranslation();

  const columns: TableColumnsType<CinemaRevenue> = [
    {
      title: t("OVERVIEW_CINEMA"),
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
      title: t("OVERVIEW_TOTAL_TICKETS_SOLD"),
      dataIndex: "totalTickets",
      key: "totalTickets",
      width: "20%",
      render: (text: number) => {
        return text?.toString() || "0";
      },
    },
    {
      title: t("OVERVIEW_TOTAL_REVENUE"),
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: "25%",
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
  ];

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
