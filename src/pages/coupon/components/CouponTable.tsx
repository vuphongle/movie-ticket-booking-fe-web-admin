import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSearchTable from "@/hooks/useSearchTable";
import type { CouponTableProps, Coupon } from "@/types";
import { formatTimeWindow } from "@/utils/couponUtils";

const CouponTable = ({ data, loading = false }: CouponTableProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const { t } = useTranslation();

  // Computed classification logic (học từ ScheduleTable)
  const getCouponClassification = (record: Coupon): number => {
    const now = new Date();
    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);

    if (!record.status) return 0; // Disabled
    if (now < startDate) return 1; // Upcoming
    if (now >= startDate && now <= endDate) return 2; // Active
    return 3; // Expired
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: t("COUPON_TABLE_CODE"),
      dataIndex: "code",
      key: "code",
      width: 120,
      ...getColumnSearchProps("code"),
      render: (text: string, record: Coupon) => (
        <RouterLink to={`/admin/coupons/${record.id}/detail`}>
          <span style={{ fontWeight: "bold", color: "#1890ff" }}>{text}</span>
        </RouterLink>
      ),
    },
    {
      title: t("COUPON_NAME_LABEL"),
      dataIndex: "name",
      key: "name",
      width: 200,
      ...getColumnSearchProps("name"),
      ellipsis: { showTitle: false },
      render: (text: string, record: Coupon) => (
        <Tooltip title={record.description || text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t("COUPON_TABLE_VALIDITY_PERIOD"),
      dataIndex: "timeWindow",
      key: "timeWindow",
      width: 180,
      sorter: (a: Coupon, b: Coupon) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      sortDirections: ["descend", "ascend"],
      render: (_: any, record: Coupon) => (
        <span style={{ fontSize: "12px" }}>{formatTimeWindow(record)}</span>
      ),
    },
    {
      title: t("COUPON_TABLE_STATUS"),
      dataIndex: "activeStatus",
      key: "activeStatus",
      width: 100,
      filters: [
        { text: t("COUPON_STATUS_ACTIVE"), value: 2 },
        { text: t("COUPON_STATUS_UPCOMING"), value: 1 },
        { text: t("COUPON_STATUS_INACTIVE"), value: 0 },
        { text: t("COUPON_STATUS_EXPIRED"), value: 3 },
      ],
      onFilter: (value, record) => getCouponClassification(record) === value,
      sorter: (a: Coupon, b: Coupon) => {
        return getCouponClassification(a) - getCouponClassification(b);
      },
      sortDirections: ["descend", "ascend"],
      render: (_: any, record: Coupon) => {
        const classification = getCouponClassification(record);
        const color =
          classification === 0
            ? "default"
            : classification === 1
              ? "processing"
              : classification === 2
                ? "success"
                : "warning";
        const statusText =
          classification === 0
            ? t("COUPON_STATUS_INACTIVE")
            : classification === 1
              ? t("COUPON_STATUS_UPCOMING")
              : classification === 2
                ? t("COUPON_STATUS_ACTIVE")
                : t("COUPON_STATUS_EXPIRED");

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
      loading={loading}
      size="small"
      scroll={{ x: 800 }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
      }}
    />
  );
};

export default CouponTable;
