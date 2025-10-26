import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import type { CouponPerformance } from "@/types";
import { formatCurrency } from "@/utils/functionUtils";
import dayjs from "dayjs";

interface CouponPerformanceTableProps {
  data: CouponPerformance[];
  loading: boolean;
}

const CouponPerformanceTable = ({
  data,
  loading,
}: CouponPerformanceTableProps) => {
  const { t } = useTranslation();

  const columns: ColumnsType<CouponPerformance> = [
    {
      title: t("COUPON_STATISTICS_TABLE_STT"),
      key: "stt",
      width: 60,
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("COUPON_STATISTICS_TABLE_CODE"),
      dataIndex: "couponCode",
      key: "couponCode",
      width: 120,
      ellipsis: { showTitle: false },
      render: (code: string) => (
        <Tooltip title={code}>
          <span style={{ fontWeight: "bold" }}>{code || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: t("COUPON_STATISTICS_TABLE_NAME"),
      dataIndex: "couponName",
      key: "couponName",
      width: 200,
      ellipsis: { showTitle: false },
      render: (name: string, record: CouponPerformance) => (
        <Tooltip title={record.description || name}>
          <span>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: t("COUPON_STATISTICS_TABLE_KIND"),
      dataIndex: "kind",
      key: "kind",
      width: 100,
      align: "center",
      render: (kind: string) => (
        <Tag color={kind === "VOUCHER" ? "blue" : "purple"}>{kind}</Tag>
      ),
    },
    {
      title: t("COUPON_STATISTICS_TABLE_VALIDITY"),
      key: "validity",
      width: 180,
      render: (_: any, record: CouponPerformance) => {
        const start = dayjs(record.startDate).format("DD/MM/YYYY");
        const end = dayjs(record.endDate).format("DD/MM/YYYY");
        return (
          <div style={{ fontSize: "12px" }}>
            {start}
            <br />
            {end}
          </div>
        );
      },
    },
    {
      title: t("COUPON_STATISTICS_TABLE_USAGE_COUNT"),
      dataIndex: "usageCount",
      key: "usageCount",
      width: 100,
      align: "center",
      sorter: (a, b) => a.usageCount - b.usageCount,
    },
    {
      title: t("COUPON_STATISTICS_TABLE_UNIQUE_CUSTOMERS"),
      dataIndex: "uniqueCustomers",
      key: "uniqueCustomers",
      width: 90,
      align: "center",
      sorter: (a, b) => a.uniqueCustomers - b.uniqueCustomers,
    },
    {
      title: t("COUPON_STATISTICS_TABLE_TOTAL_DISCOUNT"),
      dataIndex: "totalDiscountValue",
      key: "totalDiscountValue",
      width: 130,
      align: "right",
      sorter: (a, b) => a.totalDiscountValue - b.totalDiscountValue,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: t("COUPON_STATISTICS_TABLE_REVENUE_BEFORE"),
      dataIndex: "revenueBeforeDiscount",
      key: "revenueBeforeDiscount",
      width: 130,
      align: "right",
      sorter: (a, b) => a.revenueBeforeDiscount - b.revenueBeforeDiscount,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: t("COUPON_STATISTICS_TABLE_REVENUE_AFTER"),
      dataIndex: "revenueWithCoupon",
      key: "revenueWithCoupon",
      width: 130,
      align: "right",
      sorter: (a, b) => a.revenueWithCoupon - b.revenueWithCoupon,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: t("COUPON_STATISTICS_TABLE_DISCOUNT_PERCENTAGE"),
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      width: 100,
      align: "center",
      sorter: (a, b) => a.discountPercentage - b.discountPercentage,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: t("COUPON_STATISTICS_TABLE_STATUS"),
      dataIndex: "statusLabel",
      key: "statusLabel",
      width: 130,
      align: "center",
      filters: [
        {
          text: t("COUPON_STATISTICS_FILTER_ACTIVE"),
          value: t("COUPON_STATISTICS_FILTER_ACTIVE"),
        },
        {
          text: t("COUPON_STATISTICS_FILTER_INACTIVE"),
          value: t("COUPON_STATISTICS_FILTER_INACTIVE"),
        },
        {
          text: t("COUPON_STATISTICS_FILTER_UPCOMING"),
          value: t("COUPON_STATISTICS_FILTER_UPCOMING"),
        },
        {
          text: t("COUPON_STATISTICS_FILTER_EXPIRED"),
          value: t("COUPON_STATISTICS_FILTER_EXPIRED"),
        },
      ],
      onFilter: (value, record) => record.statusLabel === value,
      render: (status: string) => {
        let color = "default";
        if (status === t("COUPON_STATISTICS_FILTER_ACTIVE")) color = "success";
        else if (status === t("COUPON_STATISTICS_FILTER_UPCOMING"))
          color = "processing";
        else if (status === t("COUPON_STATISTICS_FILTER_EXPIRED"))
          color = "warning";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.couponId}
      loading={loading}
      size="small"
      scroll={{ x: 1400 }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => t("COUPON_STATISTICS_TABLE_TOTAL", { total }),
        defaultPageSize: 10,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
    />
  );
};

export default CouponPerformanceTable;
