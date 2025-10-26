import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  const columns: ColumnsType<CouponPerformance> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã KM",
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
      title: "Tên khuyến mại",
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
      title: "Loại",
      dataIndex: "kind",
      key: "kind",
      width: 100,
      align: "center",
      render: (kind: string) => (
        <Tag color={kind === "VOUCHER" ? "blue" : "purple"}>{kind}</Tag>
      ),
    },
    {
      title: "Thời gian HĐ",
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
      title: "Số lần SD",
      dataIndex: "usageCount",
      key: "usageCount",
      width: 100,
      align: "center",
      sorter: (a, b) => a.usageCount - b.usageCount,
    },
    {
      title: "Số KH",
      dataIndex: "uniqueCustomers",
      key: "uniqueCustomers",
      width: 90,
      align: "center",
      sorter: (a, b) => a.uniqueCustomers - b.uniqueCustomers,
    },
    {
      title: "Tổng giảm giá",
      dataIndex: "totalDiscountValue",
      key: "totalDiscountValue",
      width: 130,
      align: "right",
      sorter: (a, b) => a.totalDiscountValue - b.totalDiscountValue,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "DT trước CK",
      dataIndex: "revenueBeforeDiscount",
      key: "revenueBeforeDiscount",
      width: 130,
      align: "right",
      sorter: (a, b) => a.revenueBeforeDiscount - b.revenueBeforeDiscount,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "DT sau CK",
      dataIndex: "revenueWithCoupon",
      key: "revenueWithCoupon",
      width: 130,
      align: "right",
      sorter: (a, b) => a.revenueWithCoupon - b.revenueWithCoupon,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Tỷ lệ giảm",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      width: 100,
      align: "center",
      sorter: (a, b) => a.discountPercentage - b.discountPercentage,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusLabel",
      key: "statusLabel",
      width: 130,
      align: "center",
      filters: [
        { text: "Kích hoạt", value: "Kích hoạt" },
        { text: "Ẩn", value: "Ẩn" },
        { text: "Sắp có hiệu lực", value: "Sắp có hiệu lực" },
        { text: "Hết hạn", value: "Hết hạn" },
      ],
      onFilter: (value, record) => record.statusLabel === value,
      render: (status: string) => {
        let color = "default";
        if (status === "Kích hoạt") color = "success";
        else if (status === "Sắp có hiệu lực") color = "processing";
        else if (status === "Hết hạn") color = "warning";
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
        showTotal: (total) => `Tổng ${total} khuyến mại`,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
    />
  );
};

export default CouponPerformanceTable;
