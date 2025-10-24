import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@utils/functionUtils";
import { Link } from "react-router-dom";
import type { ServiceItem } from "@/types/order.types";

interface ServiceTableProps {
  serviceItems: ServiceItem[];
}

function ServiceTable({ serviceItems }: ServiceTableProps) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("SERVICE_NAME"),
      dataIndex: "additionalService",
      key: "name",
      width: "30%",
      render: (text: ServiceItem["additionalService"], record: ServiceItem) => {
        return (
          <Link
            to={`/admin/additional-services/${record.additionalService.id}/detail`}
          >
            {text.name}
          </Link>
        );
      },
    },
    {
      title: t("SERVICE_QUANTITY"),
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
      render: (text: number) => {
        return text;
      },
    },
    {
      title: t("SERVICE_UNIT_PRICE"),
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
    {
      title: t("SERVICE_TOTAL_PRICE"),
      dataIndex: "",
      key: "totalPrice",
      width: "30%",
      render: (_text: any, record: ServiceItem) => {
        return formatCurrency(record.price * record.quantity);
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={serviceItems}
      rowKey={(record) => record.id}
      pagination={false}
      style={{ marginTop: "2rem" }}
    />
  );
}

export default ServiceTable;
