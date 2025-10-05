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
import { useTranslation } from "react-i18next";

interface CouponTableProps {
  data: Coupon[];
  loading?: boolean;
  onEdit?: (coupon: Coupon) => void;
}

const CouponTable = ({ data, loading, onEdit }: CouponTableProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const { t } = useTranslation();

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const handleDelete = async (coupon: Coupon) => {
    Modal.confirm({
      title: t("COUPON_DELETE_CONFIRM_TITLE"),
      content: t("COUPON_DELETE_CONFIRM_WITH_NAME", { name: coupon.name }),
      okText: t("DELETE"),
      cancelText: t("CANCEL"),
      okType: "danger",
      onOk: async () => {
        try {
          await deleteCoupon(coupon.id).unwrap();
          message.success(t("COUPON_DELETE_SUCCESS"));
        } catch {
          message.error(t("COUPON_DELETE_ERROR"));
        }
      },
    });
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = !coupon.status;
    const confirmTitle = newStatus
      ? t("COUPON_ACTIVATE_CONFIRM_TITLE")
      : t("COUPON_DEACTIVATE_CONFIRM_TITLE");
    const confirmContent = newStatus
      ? t("COUPON_ACTIVATE_CONFIRM_MESSAGE", { name: coupon.name })
      : t("COUPON_DEACTIVATE_CONFIRM_MESSAGE", { name: coupon.name });

    Modal.confirm({
      title: confirmTitle,
      content: confirmContent,
      okText: newStatus ? t("COUPON_ACTIVATE") : t("COUPON_DEACTIVATE"),
      cancelText: t("CANCEL"),
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
          message.success(
            newStatus
              ? t("COUPON_ACTIVATE_SUCCESS")
              : t("COUPON_DEACTIVATE_SUCCESS"),
          );
        } catch {
          message.error(
            newStatus
              ? t("COUPON_ACTIVATE_ERROR")
              : t("COUPON_DEACTIVATE_ERROR"),
          );
        }
      },
    });
  };

  const getActionMenuItems = (record: Coupon): MenuProps["items"] => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: t("EDIT"),
      onClick: () => onEdit?.(record),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: t("DELETE"),
      danger: true,
      onClick: () => handleDelete(record),
    },
  ];

  const columns: ColumnsType<Coupon> = [
    {
      title: t("COUPON_TABLE_STATUS"),
      dataIndex: "status",
      key: "status",
      width: 90,
      filters: [
        { text: t("COUPON_STATUS_ACTIVE"), value: "active" },
        { text: t("COUPON_STATUS_INACTIVE"), value: "inactive" },
        { text: t("COUPON_STATUS_UPCOMING"), value: "scheduled" },
        { text: t("COUPON_STATUS_EXPIRED"), value: "expired" },
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
          checkedChildren={t("ACTIVE")}
          unCheckedChildren={t("INACTIVE")}
          style={{ opacity: status ? 1 : 0.6 }}
        />
      ),
    },
    {
      title: t("COUPON_TABLE_NAME"),
      dataIndex: "name",
      key: "name",
      width: "25%",
      ...getColumnSearchProps("name"),
      render: (_, record: Coupon) => <CouponNameDisplay coupon={record} />,
    },
    {
      title: t("COUPON_TABLE_CODE"),
      dataIndex: "code",
      key: "code",
      width: 90,
      ...getColumnSearchProps("code"),
      render: (code: string | null) => <CouponCodeDisplay code={code} />,
    },
    {
      title: t("COUPON_TABLE_KIND"),
      dataIndex: "kind",
      key: "kind",
      width: 80,
      filters: [
        { text: t("COUPON_KIND_DISPLAY"), value: "DISPLAY" },
        { text: t("COUPON_KIND_VOUCHER"), value: "VOUCHER" },
      ],
      onFilter: (value, record) => record.kind === value,
      render: (kind) => <CouponKindDisplay kind={kind} />,
    },

    {
      title: t("COUPON_TABLE_VALIDITY_PERIOD"),
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
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 90,
      sorter: (a, b) =>
        new Date(a.createdAt || "").getTime() -
        new Date(b.createdAt || "").getTime(),
      render: (text: string) => (text ? formatDate(text) : "—"),
    },
    {
      title: t("COUPON_TABLE_ACTIONS"),
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
          `${range[0]}-${range[1]} ${t("PAGINATION_TOTAL")} ${total} ${t("PAGINATION_ITEMS")}`,
        responsive: true,
        size: "small",
      }}
    />
  );
};

export default CouponTable;
