import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "@hooks/useSearchTable";
import { formatCurrency, formatDate } from "@utils/functionUtils";

interface Order {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  showtime: {
    startTime: string;
    endTime: string;
    date: string;
    movie: {
      id: number;
      name: string;
    };
    auditorium: {
      name: string;
      cinema: {
        name: string;
      };
    };
  };
}

interface OrderListByUserProps {
  data: Order[];
}

const parseOrderStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Tag color="warning">Chờ thanh toán</Tag>;
    case "CONFIRMED":
      return <Tag color="success">Đã thanh toán</Tag>;
    case "CANCELLED":
      return <Tag color="red">Đã hủy</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
};

const OrderListByUser = ({ data }: OrderListByUserProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
      render: (id: number, record: Order) => {
        return (
          <RouterLink to={`/admin/orders/${record.id}/detail`}>{id}</RouterLink>
        );
      },
    },
    {
      title: "Tên phim",
      dataIndex: "showtime",
      key: "movie",
      render: (showtime: Order["showtime"]) => {
        return (
          <RouterLink to={`/admin/orders/${showtime.movie.id}/detail`}>
            {showtime.movie.name}
          </RouterLink>
        );
      },
    },
    {
      title: "Suất chiếu",
      dataIndex: "showtime",
      key: "time",
      render: (showtime: Order["showtime"]) => {
        return (
          <>
            <Tag color="volcano">
              {showtime.startTime} - {showtime.endTime}
            </Tag>
            <Tag color="green">{formatDate(showtime.date)}</Tag>
          </>
        );
      },
    },
    {
      title: "Phòng chiếu",
      dataIndex: "showtime",
      key: "auditorium",
      render: (showtime: Order["showtime"]) => {
        return `${showtime.auditorium.name} - ${showtime.auditorium.cinema.name}`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: Order, b: Order) => a.status.localeCompare(b.status, "vi"),
      sortDirections: ["descend", "ascend"],
      render: (status: string) => {
        return parseOrderStatus(status);
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => {
        return formatCurrency(totalPrice);
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ["descend", "ascend"],
      render: (createdAt: string) => {
        return formatDate(createdAt);
      },
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />
  );
};
export default OrderListByUser;
