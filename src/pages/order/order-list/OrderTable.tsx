import { Table, Tag } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSearchTable from "../../../hooks/useSearchTable";
import {
  formatCurrency,
  formatDate,
  convertDateArrayToDate,
} from "../../../utils/functionUtils";
import type { Order, OrderStatus } from "@/types/order.types";

interface OrderTableProps {
  data: Order[];
}

const MovieTable = ({ data }: OrderTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();

  const parseOrderStatus = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Tag color="warning">{t("ORDER_STATUS_PENDING")}</Tag>;
      case "CONFIRMED":
        return <Tag color="success">{t("ORDER_STATUS_CONFIRMED")}</Tag>;
      case "CANCELLED":
        return <Tag color="red">{t("ORDER_STATUS_CANCELLED")}</Tag>;
      case "RETURNED":
        return <Tag color="purple">{t("ORDER_STATUS_RETURNED")}</Tag>;
      default:
        return <Tag color="default">{t("ORDER_STATUS_UNKNOWN")}</Tag>;
    }
  };

  const columns = [
    {
      title: t("ORDER_CODE"),
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
      render: (text: number, record: Order) => {
        return (
          <RouterLink to={`/admin/orders/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("ORDER_MOVIE_NAME"),
      dataIndex: "showtime",
      key: "movie",
      ...getColumnSearchProps("id"),
      render: (text: Order["showtime"], record: Order) => {
        return (
          <RouterLink to={`/admin/orders/${record.id}/detail`}>
            {text.movie.name}
          </RouterLink>
        );
      },
    },
    {
      title: t("ORDER_SHOWTIME"),
      dataIndex: "showtime",
      key: "time",
      render: (text: Order["showtime"]) => {
        return (
          <>
            <Tag color="volcano">
              {text.startTime} - {text.endTime}
            </Tag>
            <Tag color="green">{formatDate(text.date)}</Tag>
          </>
        );
      },
    },
    {
      title: t("ORDER_AUDITORIUM"),
      dataIndex: "showtime",
      key: "auditorium",
      render: (text: Order["showtime"]) => {
        return `${text.auditorium.name} - ${text.auditorium.cinema.name}`;
      },
    },
    {
      title: t("ORDER_STATUS"),
      dataIndex: "status",
      key: "status",
      sorter: (a: Order, b: Order) => a.status.localeCompare(b.status, "vi"),
      sortDirections: ["descend", "ascend"] as SortOrder[],
      render: (text: OrderStatus) => {
        return parseOrderStatus(text);
      },
    },
    {
      title: t("ORDER_TOTAL_PRICE"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
    {
      title: t("ORDER_CREATED_DATE"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Order, b: Order) => {
        const dateA = convertDateArrayToDate(a.createdAt);
        const dateB = convertDateArrayToDate(b.createdAt);
        return dateA.getTime() - dateB.getTime();
      },
      sortDirections: ["descend", "ascend"] as SortOrder[],
      render: (text: string | number[]) => {
        return formatDate(text);
      },
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />
  );
};
export default MovieTable;
