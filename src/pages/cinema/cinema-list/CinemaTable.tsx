import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";
import type { Cinema } from "@/types";
import type { ColumnsType } from "antd/es/table";

interface CinemaTableProps {
  data: Cinema[];
}

const CinemaTable = ({ data }: CinemaTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();
  const columns: ColumnsType<Cinema> = [
    {
      title: t("CINEMA_NAME_COLUMN"),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string, record: Cinema, _index: number) => {
        return (
          <RouterLink to={`/admin/cinemas/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("ADDRESS_COLUMN"),
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      render: (text: string, _record: Cinema, _index: number) => {
        return text;
      },
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Cinema, b: Cinema) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ["descend", "ascend"] as const,
      render: (text: string, _record: Cinema, _index: number) => {
        return formatDate(text);
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record: Cinema) => record.id}
    />
  );
};
export default CinemaTable;
