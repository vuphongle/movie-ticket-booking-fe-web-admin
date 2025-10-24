import { Table, Tag } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import {
  formatCurrency,
  formatDate,
  convertDateArrayToDate,
} from "../../../utils/functionUtils";
import type { Order, OrderStatus } from "@/types/order.types";

const parseOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Tag color="warning">Chờ thanh toán</Tag>;
    case "CONFIRMED":
      return <Tag color="success">Đã thanh toán</Tag>;
    case "CANCELLED":
      return <Tag color="red">Đã hủy</Tag>;
    case "RETURNED":
      return <Tag color="purple">Đã trả hàng</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
};

interface OrderTableProps {
  data: Order[];
}

const MovieTable = ({ data }: OrderTableProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const columns = [
    {
      title: "Mã đơn hàng",
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
      title: "Tên phim",
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
      title: "Suất chiếu",
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
      title: "Phòng chiếu",
      dataIndex: "showtime",
      key: "auditorium",
      render: (text: Order["showtime"]) => {
        return `${text.auditorium.name} - ${text.auditorium.cinema.name}`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: Order, b: Order) => a.status.localeCompare(b.status, "vi"),
      sortDirections: ["descend", "ascend"] as SortOrder[],
      render: (text: OrderStatus) => {
        return parseOrderStatus(text);
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
    {
      title: "Ngày đặt",
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
