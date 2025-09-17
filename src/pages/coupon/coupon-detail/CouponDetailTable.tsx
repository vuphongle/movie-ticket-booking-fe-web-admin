import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDeleteCouponDetailMutation } from "@/app/services/coupons.service";
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

  const getBenefitText = (detail: CouponDetail) => {
    switch (detail.benefitType) {
      case "DISCOUNT_PERCENT":
        return `Giảm ${detail.percent}%`;
      case "DISCOUNT_AMOUNT":
        return `Giảm ${detail.amount?.toLocaleString()} VND`;
      case "FREE_PRODUCT":
        return `Tặng ${detail.giftQuantity} sản phẩm`;
      default:
        return "N/A";
    }
  };

  const getTargetText = (detail: CouponDetail) => {
    switch (detail.targetType) {
      case "ORDER":
        return "Đơn hàng";
      case "SEAT_TYPE":
        return "Loại ghế";
      case "SERVICE":
        return "Dịch vụ";
      default:
        return "N/A";
    }
  };

  const handleToggleEnabled = async (_detail: CouponDetail) => {
    // TODO: Implement toggle functionality when API is ready
    message.info("Tính năng này sẽ được triển khai sau");
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
      title: "Kích hoạt",
      dataIndex: "enabled",
      key: "enabled",
      width: 100,
      render: (enabled: boolean, record: CouponDetail) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleEnabled(record)}
          size="small"
        />
      ),
    },
    {
      title: "Đối tượng",
      dataIndex: "targetType",
      key: "targetType",
      width: 120,
      render: (_, record: CouponDetail) => getTargetText(record),
    },
    {
      title: "Lợi ích",
      dataIndex: "benefitType",
      key: "benefitType",
      width: 150,
      render: (_, record: CouponDetail) => getBenefitText(record),
    },
    {
      title: "Ưu tiên",
      dataIndex: "linePriority",
      key: "linePriority",
      width: 80,
      sorter: (a, b) => a.linePriority - b.linePriority,
    },
    {
      title: "Đã dùng",
      dataIndex: "detailUsedCount",
      key: "detailUsedCount",
      width: 90,
      render: (count: number, record: CouponDetail) => (
        <span>
          {count}
          {record.detailUsageLimit && ` / ${record.detailUsageLimit}`}
        </span>
      ),
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
      render: (_: any, record: CouponDetail) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
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
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
      }}
    />
  );
};

export default CouponDetailTable;
