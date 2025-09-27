import { Table, Button, Modal, Dropdown, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  DeleteOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import useSearchTable from "@/hooks/useSearchTable";
import { formatDate } from "@/utils/functionUtils";
import {
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} from "@/app/services/coupons.service";
import { message } from "antd";
import type { Coupon } from "@/types";
import {
  CouponNameDisplay,
  CouponCodeDisplay,
  CouponKindDisplay,
  CouponDateRangeDisplay,
} from "./components";

interface CouponTableProps {
  data: Coupon[];
  loading?: boolean;
  onEdit?: (coupon: Coupon) => void;
}

const CouponTable = ({ data, loading, onEdit }: CouponTableProps) => {
  const { getColumnSearchProps } = useSearchTable();

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const handleDelete = async (coupon: Coupon) => {
    Modal.confirm({
      title: "Delete Coupon",
      content: `Are you sure you want to delete coupon "${coupon.name}"? This action cannot be undone.`,
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteCoupon(coupon.id).unwrap();
          message.success("Coupon deleted successfully");
        } catch {
          message.error("Failed to delete coupon");
        }
      },
    });
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = !coupon.status;
    const statusText = newStatus ? "activate" : "deactivate";

    Modal.confirm({
      title: `${newStatus ? "Activate" : "Deactivate"} Coupon`,
      content: `Are you sure you want to ${statusText} coupon "${coupon.name}"?`,
      okText: newStatus ? "Activate" : "Deactivate",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await updateCoupon({
            id: coupon.id,
            kind: coupon.kind,
            code: coupon.code || undefined,
            name: coupon.name,
            description: coupon.description || undefined,
            status: newStatus,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
          }).unwrap();
          message.success(`Coupon ${statusText}d successfully`);
        } catch {
          message.error(`Failed to ${statusText} coupon`);
        }
      },
    });
  };

  const getActionMenuItems = (record: Coupon): MenuProps["items"] => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => onEdit?.(record),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: () => handleDelete(record),
    },
  ];

  const columns: ColumnsType<Coupon> = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Scheduled", value: "scheduled" },
        { text: "Expired", value: "expired" },
      ],
      onFilter: (value, record) => {
        const now = new Date();
        const start = new Date(record.startDate);
        const end = new Date(record.endDate);

        switch (value) {
          case "active":
            return record.status && now >= start && now <= end;
          case "inactive":
            return !record.status;
          case "scheduled":
            return record.status && now < start;
          case "expired":
            return record.status && now > end;
          default:
            return true;
        }
      },
      render: (status: boolean, record: Coupon) => (
        <Switch
          size="small"
          checked={status}
          loading={isUpdating}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          style={{ opacity: status ? 1 : 0.6 }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      ...getColumnSearchProps("name"),
      render: (_, record: Coupon) => <CouponNameDisplay coupon={record} />,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 90,
      ...getColumnSearchProps("code"),
      render: (code: string | null) => <CouponCodeDisplay code={code} />,
    },
    {
      title: "Kind",
      dataIndex: "kind",
      key: "kind",
      width: 80,
      filters: [
        { text: "Display", value: "DISPLAY" },
        { text: "Voucher", value: "VOUCHER" },
      ],
      onFilter: (value, record) => record.kind === value,
      render: (kind) => <CouponKindDisplay kind={kind} />,
    },

    {
      title: "Date Range",
      key: "dateRange",
      width: 110,
      render: (_, record: Coupon) => (
        <CouponDateRangeDisplay
          startDate={record.startDate}
          endDate={record.endDate}
        />
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 90,
      sorter: (a, b) =>
        new Date(a.createdAt || "").getTime() -
        new Date(b.createdAt || "").getTime(),
      render: (text: string) => (text ? formatDate(text) : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      align: "center",
      fixed: "right",
      render: (_, record: Coupon) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<SettingOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading || isDeleting || isUpdating}
      scroll={{ x: 900 }}
      size="small"
      pagination={{
        total: data.length,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        responsive: true,
        size: "small",
      }}
    />
  );
};

export default CouponTable;
