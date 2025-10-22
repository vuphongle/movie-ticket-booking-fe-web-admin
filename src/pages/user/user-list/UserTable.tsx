import { Avatar, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import { API_DOMAIN } from "@data/constants";
import useSearchTable from "@hooks/useSearchTable";
import { formatDate } from "@utils/functionUtils";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  enabled: boolean;
  avatar: string;
  createdAt: string;
}

interface UserTableProps {
  data: User[];
}

const UserTable = ({ data }: UserTableProps) => {
  const { getColumnSearchProps } = useSearchTable();

  const columns: ColumnsType<User> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => {
        const imageUrl = avatar.startsWith("/api")
          ? `${API_DOMAIN}${avatar}`
          : avatar;
        return <Avatar size={64} src={<img src={imageUrl} alt="avatar" />} />;
      },
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a: User, b: User) => a.name.localeCompare(b.name, "vi"),
      sortDirections: ["descend", "ascend"],
      render: (text: string, record: User) => {
        return (
          <RouterLink to={`/admin/users/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a: User, b: User) => a.email.localeCompare(b.email, "vi"),
      sortDirections: ["descend", "ascend"],
      render: (email: string) => {
        return email;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      render: (phone?: string) => {
        return phone ? phone : "Chưa cập nhật";
      },
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      sorter: (a: User, b: User) => a.role.localeCompare(b.role, "vi"),
      sortDirections: ["descend", "ascend"],
      render: (role: string, record: User) => {
        return (
          <Tag color={record.role === "ADMIN" ? "geekblue" : "volcano"}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      key: "enabled",
      sorter: (a: User, b: User) => Number(a.enabled) - Number(b.enabled),
      sortDirections: ["descend", "ascend"],
      render: (enabled: boolean) => {
        return enabled ? (
          <Tag color="success">Kích hoạt</Tag>
        ) : (
          <Tag color="warning">Chưa kích hoạt</Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: User, b: User) =>
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
export default UserTable;
