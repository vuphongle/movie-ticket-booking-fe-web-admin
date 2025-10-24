import { Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@utils/functionUtils";
import type { TicketItem } from "@/types/order.types";

type SeatType = "NORMAL" | "VIP" | "COUPLE";

interface TicketTableProps {
  ticketItems: TicketItem[];
}

function TicketTable({ ticketItems }: TicketTableProps) {
  const { t } = useTranslation();

  const parseSeatType = (seatType: SeatType) => {
    switch (seatType) {
      case "NORMAL":
        return <Tag color="default">{t("TICKET_SEAT_NORMAL")}</Tag>;
      case "VIP":
        return <Tag color="gold">{t("TICKET_SEAT_VIP")}</Tag>;
      case "COUPLE":
        return <Tag color="magenta">{t("TICKET_SEAT_COUPLE")}</Tag>;
      default:
        return <Tag color="default">{t("ORDER_STATUS_UNKNOWN")}</Tag>;
    }
  };

  const columns = [
    {
      title: t("TICKET_SEAT_INFO"),
      dataIndex: "seat",
      key: "code",
      width: "30%",
      render: (text: TicketItem["seat"]) => {
        return text.code;
      },
    },
    {
      title: t("TICKET_SEAT_TYPE"),
      dataIndex: "seat",
      key: "type",
      width: "40%",
      render: (text: TicketItem["seat"]) => {
        return parseSeatType(text.type);
      },
    },
    {
      title: t("TICKET_PRICE"),
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
