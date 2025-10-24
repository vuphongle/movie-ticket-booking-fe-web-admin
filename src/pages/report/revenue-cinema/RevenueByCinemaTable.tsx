import { Table } from "antd";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CinemaRevenue } from "@/types/dashboard.types";
import { formatCurrency } from "@utils/functionUtils";

interface RevenueByCinemaTableProps {
  data?: CinemaRevenue[];
}

function RevenueByCinemaTable({ data }: RevenueByCinemaTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<CinemaRevenue> = [
    {
      title: t("REPORT_CINEMA"),
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
      title: t("REPORT_TOTAL_TICKETS_SOLD"),
      dataIndex: "totalTickets",
      key: "totalTickets",
      width: "20%",
      sorter: (a, b) => a.totalTickets - b.totalTickets,
      sortDirections: ["descend" as SortOrder, "ascend" as SortOrder],
      render: (text: number) => {
        return text + " " + t("REPORT_TICKET_UNIT");
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
      rowKey={(record) => record.cinemaId}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
}

export default RevenueByCinemaTable;
