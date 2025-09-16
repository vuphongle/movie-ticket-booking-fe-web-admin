import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "@/hooks/useSearchTable";
import { formatCurrency, formatDate } from "@/utils/functionUtils";
import type { AdditionalService } from "@/types";

interface AdditionalServiceTableProps {
  data: AdditionalService[];
}

const AdditionalServiceTable = ({ data }: AdditionalServiceTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();

  const columns: ColumnsType<AdditionalService> = [
    {
      title: t("SERVICE_NAME_COL"),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string, record: AdditionalService) => {
        return (
          <RouterLink to={`/admin/additional-services/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("DESCRIPTION_COL"),
      dataIndex: "description",
      key: "description",
      render: (text: string) => {
        return text;
      },
    },
    {
      title: t("PRICE_COL"),
      dataIndex: "price",
      key: "price",
      sorter: (a: AdditionalService, b: AdditionalService) => a.price - b.price,
      sortDirections: ["descend" as const, "ascend" as const],
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
    {
      title: t("STATUS_COL"),
      dataIndex: "status",
      key: "status",
      sorter: (a: AdditionalService, b: AdditionalService) =>
        Number(a.status) - Number(b.status),
      sortDirections: ["descend" as const, "ascend" as const],
      render: (text: boolean) => {
        return text ? (
          <Tag color="success">{t("PUBLIC")}</Tag>
        ) : (
          <Tag color="warning">{t("DRAFT")}</Tag>
        );
      },
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: AdditionalService, b: AdditionalService) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ["descend" as const, "ascend" as const],
      render: (text: string) => {
        return formatDate(text);
      },
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />
  );
};
export default AdditionalServiceTable;
