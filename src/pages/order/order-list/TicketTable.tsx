import { Table, Tag } from "antd";
import { formatCurrency } from "@utils/functionUtils";
import type { TicketItem } from "@/types/order.types";

type SeatType = "NORMAL" | "VIP" | "COUPLE";

const parseSeatType = (seatType: SeatType) => {
  switch (seatType) {
    case "NORMAL":
      return <Tag color="default">Ghế thường</Tag>;
    case "VIP":
      return <Tag color="gold">Ghế VIP</Tag>;
    case "COUPLE":
      return <Tag color="magenta">Ghế COUPLE</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
};

interface TicketTableProps {
  ticketItems: TicketItem[];
}

function TicketTable({ ticketItems }: TicketTableProps) {
  const columns = [
    {
      title: "Thông tin ghế",
      dataIndex: "seat",
      key: "code",
      width: "30%",
      render: (text: TicketItem["seat"]) => {
        return text.code;
      },
    },
    {
      title: "Loại ghế",
      dataIndex: "seat",
      key: "type",
      width: "40%",
      render: (text: TicketItem["seat"]) => {
        return parseSeatType(text.type);
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      width: "30%",
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={ticketItems}
      rowKey={(record) => record.id}
      pagination={false}
    />
  );
}

export default TicketTable;
