import { Table, Tag } from "antd";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "@/hooks/useSearchTable";
import { formatDate } from "@/utils/functionUtils";
import type { Movie } from "@/types";

interface MovieTableProps {
  data?: Movie[];
}

const MovieTable = ({ data }: MovieTableProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const columns = [
    {
      title: "Tên phim",
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
      title: "Năm phát hành",
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
      title: "Thể loại",
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
      title: "Lịch chiếu",
      dataIndex: "showDate",
      key: "showDate",
      render: (text: string) => {
        return <Tag color="volcano">{formatDate(text)}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      sorter: (a: any, b: any) =>
        (a.status || "").localeCompare(b.status || ""),
      render: (text: any) => {
        return text ? (
          <Tag color="success">Công khai</Tag>
        ) : (
          <Tag color="warning">Nháp</Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
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
