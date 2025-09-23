import { Avatar, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSearchTable from "@/hooks/useSearchTable";
import { formatDate } from "@/utils/functionUtils";
import { API_DOMAIN } from "@/data/constants";
import type { Actor } from "@/types";

interface ActorTableProps {
  data: Actor[] | undefined;
}

const ActorTable = ({ data }: ActorTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();

  const columns: ColumnsType<Actor> = [
    {
      title: t("AVATAR"),
      dataIndex: "avatar",
      key: "avatar",
      render: (text: string, _record: Actor, _index: number) => {
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
      render: (text: string, record: Actor, _index: number) => {
        return (
          <RouterLink to={`/admin/actors/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("BIRTH_DATE"),
      dataIndex: "birthday",
      key: "birthday",
      render: (text: string | number, _record: Actor, _index: number) => {
        if (!text) return "";
        // Nếu là timestamp number, convert thành date
        const date = typeof text === "number" ? new Date(text) : new Date(text);
        return formatDate(date.toISOString());
      },
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Actor, b: Actor) => {
        const dateA = a.createdAt
          ? typeof a.createdAt === "number"
            ? a.createdAt
            : new Date(a.createdAt).getTime()
          : 0;
        const dateB = b.createdAt
          ? typeof b.createdAt === "number"
            ? b.createdAt
            : new Date(b.createdAt).getTime()
          : 0;
        return dateA - dateB;
      },
      sortDirections: ["descend", "ascend"],
      render: (text: string | number, _record: Actor, _index: number) => {
        if (!text) return "";
        // Nếu là timestamp number, convert thành date
        const date = typeof text === "number" ? new Date(text) : new Date(text);
        return formatDate(date.toISOString());
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record: Actor) => record.id}
      scroll={{ x: true }}
    />
  );
};

export default ActorTable;
