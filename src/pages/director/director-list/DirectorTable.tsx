import { Table, Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSearchTable from "@/hooks/useSearchTable";
import { formatDate } from "@/utils/functionUtils";
import { API_DOMAIN } from "@/data/constants";
import type { Director } from "@/types/movie.types";

interface DirectorTableProps {
  data: Director[];
}

const DirectorTable = ({ data }: DirectorTableProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const { t } = useTranslation();

  const columns: ColumnsType<Director> = [
    {
      title: t("AVATAR"),
      dataIndex: "avatar",
      key: "avatar",
      render: (text: string | undefined) => {
        if (!text) return <Avatar size={64} />;
        const imageUrl = text.startsWith("/api")
          ? `${API_DOMAIN}${text}`
          : text;
        return <Avatar size={64} src={<img src={imageUrl} alt="avatar" />} />;
      },
    },
    {
      title: t("NAME"),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string, record: Director) => {
        return (
          <RouterLink to={`/admin/directors/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("BIRTH_DATE"),
      dataIndex: "birthDate",
      key: "birthDate",
      render: (text: string | undefined) => {
        return text ? formatDate(text) : "-";
      },
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Director, b: Director) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateA.getTime() - dateB.getTime();
      },
      sortDirections: ["descend", "ascend"],
      render: (text: string | undefined) => {
        return text ? formatDate(text) : "-";
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record: Director) => record.id}
    />
  );
};

export default DirectorTable;
