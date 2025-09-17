import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useDeleteCouponDetailMutation,
  useUpdateCouponDetailMutation,
} from "@/app/services/coupons.service";
import type { CouponDetail } from "@/types";

interface CouponDetailTableProps {
  couponId: number;
  data: CouponDetail[];
  loading?: boolean;
  onEdit?: (detail: CouponDetail) => void;
}

const CouponDetailTable = ({
  couponId: _couponId,
  data,
  loading = false,
  onEdit,
}: CouponDetailTableProps) => {
  const [deleteDetail, { isLoading: isDeleting }] =
    useDeleteCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdating }] =
    useUpdateCouponDetailMutation();

  const getBenefitText = (detail: CouponDetail) => {
    switch (detail.benefitType) {
      case "DISCOUNT_PERCENT":
        return `Giảm ${detail.percent}%${detail.lineMaxDiscount ? ` (tối đa ${detail.lineMaxDiscount?.toLocaleString()} VND)` : ""}`;
      case "DISCOUNT_AMOUNT":
        return `Giảm ${detail.amount?.toLocaleString()} VND`;
      case "FREE_PRODUCT":
        return `Tặng ${detail.giftQuantity} sản phẩm`;
      default:
        return "N/A";
    }
  };

  const getSeatTypeName = (seatTypeId: number) => {
    const seatTypeMap = {
      1: "Ghế thường",
      2: "Ghế VIP",
      3: "Ghế đôi",
    };
    return (
      seatTypeMap[seatTypeId as keyof typeof seatTypeMap] ||
      `Ghế loại ${seatTypeId}`
    );
  };

  const getTargetText = (detail: CouponDetail) => {
    switch (detail.targetType) {
      case "ORDER":
        return "Toàn đơn hàng";
      case "SEAT_TYPE":
        return detail.targetRefId
          ? getSeatTypeName(detail.targetRefId)
          : "Tất cả loại ghế";
      case "SERVICE":
        return detail.targetRefId
          ? `Dịch vụ ${detail.targetRefId}`
          : "Tất cả dịch vụ";
      default:
        return "N/A";
    }
  };

  const getConditionsText = (detail: CouponDetail) => {
    const conditions = [];
    if (detail.minOrderTotal) {
      conditions.push(
        `Đơn tối thiểu: ${detail.minOrderTotal.toLocaleString()} VND`
      );
    }
    if (detail.minQuantity) {
      conditions.push(`SL tối thiểu: ${detail.minQuantity}`);
    }
    if (detail.limitQuantityApplied) {
      conditions.push(`Giới hạn áp dụng: ${detail.limitQuantityApplied}`);
    }
    return conditions.length > 0 ? conditions.join("\n") : "-";
  };

  const handleToggleEnabled = async (detail: CouponDetail) => {
    try {
      await updateDetail({
        detailId: detail.id,
        enabled: !detail.enabled,
        targetType: detail.targetType,
        benefitType: detail.benefitType,
        percent: detail.percent,
        amount: detail.amount,
        giftServiceId: detail.giftServiceId,
        giftQuantity: detail.giftQuantity,
        lineMaxDiscount: detail.lineMaxDiscount,
        minQuantity: detail.minQuantity,
        limitQuantityApplied: detail.limitQuantityApplied,
        minOrderTotal: detail.minOrderTotal,
        detailUsageLimit: detail.detailUsageLimit,
        linePriority: detail.linePriority,
        selectionStrategy: detail.selectionStrategy,
        notes: detail.notes,
        targetRefId: detail.targetRefId,
      }).unwrap();

      message.success(
        detail.enabled
          ? "Đã tắt coupon detail thành công"
          : "Đã bật coupon detail thành công"
      );
    } catch (error: any) {
      message.error(error.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = (detail: CouponDetail) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa chi tiết coupon này?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      okButtonProps: { loading: isDeleting },
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteDetail(detail.id)
            .unwrap()
            .then(() => {
              message.success("Xóa chi tiết coupon thành công");
              resolve();
            })
            .catch((error: any) => {
              message.error(
                error.data?.message || "Lỗi khi xóa chi tiết coupon"
              );
              reject();
            });
        });
      },
    });
  };

  const columns: ColumnsType<CouponDetail> = [
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      key: "enabled",
      width: 100,
      render: (enabled: boolean, record: CouponDetail) => (
        <Switch
          checked={enabled}
          loading={isUpdating}
          onChange={() => handleToggleEnabled(record)}
          size="small"
        />
      ),
    },
    {
      title: "Ưu tiên",
      dataIndex: "linePriority",
      key: "linePriority",
      width: 80,
      sorter: (a, b) => a.linePriority - b.linePriority,
      render: (priority: number) => (
        <span style={{ fontWeight: "bold" }}>{priority}</span>
      ),
    },
    {
      title: "Đối tượng áp dụng",
      dataIndex: "targetType",
      key: "targetType",
      width: 180,
      render: (_, record: CouponDetail) => getTargetText(record),
    },
    {
      title: "Lợi ích",
      dataIndex: "benefitType",
      key: "benefitType",
      width: 220,
      render: (_, record: CouponDetail) => getBenefitText(record),
    },
    {
      title: "Điều kiện",
      key: "conditions",
      width: 200,
      render: (_, record: CouponDetail) => (
        <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
          {getConditionsText(record)}
        </div>
      ),
    },
    {
      title: "Sử dụng",
      dataIndex: "detailUsedCount",
      key: "detailUsedCount",
      width: 100,
      render: (count: number, record: CouponDetail) => (
        <span>
          <strong>{count}</strong>
          {record.detailUsageLimit ? ` / ${record.detailUsageLimit}` : " / ∞"}
        </span>
      ),
    },
    {
      title: "Chiến lược",
      dataIndex: "selectionStrategy",
      key: "selectionStrategy",
      width: 120,
      render: (strategy: string) => {
        const strategyMap = {
          HIGHEST_PRICE_FIRST: "Giá cao trước",
          LOWEST_PRICE_FIRST: "Giá thấp trước",
          FIFO: "Theo thứ tự",
        };
        return strategyMap[strategy as keyof typeof strategyMap] || strategy;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      render: (notes: string) => notes || "-",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_: any, record: CouponDetail) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
            title="Chỉnh sửa"
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
      loading={loading}
      size="small"
      scroll={{ x: 1200 }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
        pageSizeOptions: ["10", "20", "50", "100"],
        defaultPageSize: 20,
      }}
    />
  );
};

export default CouponDetailTable;
