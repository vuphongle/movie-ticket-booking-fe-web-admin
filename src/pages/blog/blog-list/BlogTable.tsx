import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "@hooks/useSearchTable";
import { formatDate } from "@utils/functionUtils";
import type { Blog, BlogType, User } from "@/types";

interface BlogTableProps {
  data: Blog[];
}

const BlogTable = ({ data }: BlogTableProps) => {
  const { getColumnSearchProps } = useSearchTable();

  const parseBlogType = (text: BlogType): string => {
    const blogTypeObj: Record<BlogType, string> = {
      PHIM_CHIEU_RAP: "Phim chiếu rạp",
      TONG_HOP_PHIM: "Tổng hợp phim",
      PHIM_NEFLIX: "Phim Netflix",
    };
    return blogTypeObj[text];
  };

  const columns: ColumnsType<Blog> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      render: (text: string, record: Blog) => {
        return (
          <RouterLink to={`/admin/blogs/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: "Tác giả",
      dataIndex: "user",
      key: "user",
      ...getColumnSearchProps("user", ["name"]),
      render: (user: User) => {
        return (
          <RouterLink to={`/admin/users/${user.id}/detail`}>
            {user.name}
          </RouterLink>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
      sorter: (a: Blog, b: Blog) => a.type.localeCompare(b.type, "vi"),
      sortDirections: ["descend", "ascend"],
      render: (type: BlogType) => {
        return (
          <Tag color={"geekblue"} style={{ marginBottom: 7 }}>
            {parseBlogType(type)}
          </Tag>
        );
      },
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      sorter: (a: Blog, b: Blog) => (a.viewCount || 0) - (b.viewCount || 0),
      sortDirections: ["descend", "ascend"],
      render: (viewCount: number | null | undefined) => {
        return viewCount || 0;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: Blog, b: Blog) => Number(a.status) - Number(b.status),
      sortDirections: ["descend", "ascend"],
      render: (status: boolean) => {
        return status ? (
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
      sorter: (a: Blog, b: Blog) =>
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
export default BlogTable;
