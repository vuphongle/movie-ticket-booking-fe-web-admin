import { Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "@/hooks/useSearchTable";
import { formatDate } from "@/utils/functionUtils";
import type { Movie } from "@/types";

interface MovieTableProps {
  data?: Movie[];
}

const MovieTable = ({ data }: MovieTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();
  const columns = [
    {
      title: t("MOVIE_NAME_COL"),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string, record: Movie) => {
        return (
          <RouterLink to={`/admin/movies/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("RELEASE_YEAR_COL"),
      dataIndex: "releaseYear",
      key: "releaseYear",
      width: "12%",
      ...getColumnSearchProps("releaseYear"),
      sorter: (a: any, b: any) => (a.releaseYear || 0) - (b.releaseYear || 0),
      render: (text: number) => {
        return text;
      },
    },
    {
      title: t("GENRES_COL"),
      dataIndex: "genres",
      key: "genres",
      render: (text: any) => {
        return text?.map((category: any) => (
          <Tag color={"geekblue"} key={category.id} style={{ marginBottom: 7 }}>
            {category.name}
          </Tag>
        ));
      },
    },
    {
      title: t("SHOW_DATE_COL"),
      dataIndex: "showDate",
      key: "showDate",
      render: (text: string) => {
        return <Tag color="volcano">{formatDate(text)}</Tag>;
      },
    },
    {
      title: t("STATUS_COL"),
      dataIndex: "status",
      key: "status",
      width: "10%",
      sorter: (a: any, b: any) =>
        (a.status || "").localeCompare(b.status || ""),
      render: (text: any) => {
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
      width: "15%",
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => {
        return formatDate(text);
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data || []}
      rowKey={(record: any) => record.id}
    />
  );
};
export default MovieTable;
