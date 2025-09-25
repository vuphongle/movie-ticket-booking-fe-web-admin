import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip, message } from "antd";
import type { ColumnType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { useDeleteCouponDetailMutation } from "@/app/services/coupons.service";
import type { CouponDetail } from "@/types";

interface CouponDetailTableSimpleProps {
  data: CouponDetail[];
  loading?: boolean;
  onEdit: (detail: CouponDetail) => void;
  onRefresh: () => void;
}

const CouponDetailTableSimple = ({
  data,
  loading,
  onEdit,
  onRefresh,
}: CouponDetailTableSimpleProps) => {
  const { t } = useTranslation();

  const [deleteDetail] = useDeleteCouponDetailMutation();

  const handleDelete = async (detail: CouponDetail) => {
    try {
      await deleteDetail(detail.id).unwrap();
      message.success(t("COUPON_DETAIL_DELETE_SUCCESS"));
      onRefresh();
    } catch (error: any) {
      message.error(error.data?.message || t("COUPON_DETAIL_DELETE_ERROR"));
    }
  };

  const getTargetDisplay = (detail: CouponDetail) => {
    switch (detail.targetType) {
      case "ORDER":
        return t("TARGET_ORDER");
      default:
        return detail.targetType;
    }
  };

  const columns: ColumnType<CouponDetail>[] = [
    {
      title: t("COUPON_DETAIL_ID"),
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: t("COUPON_DETAIL_TARGET_TYPE"),
      dataIndex: "targetType",
      key: "targetType",
      render: (_, detail) => getTargetDisplay(detail),
    },
    {
      title: t("COUPON_DETAIL_GIFT_SERVICE"),
      dataIndex: "giftServiceId",
      key: "giftServiceId",
      render: (giftServiceId) => giftServiceId || t("NOT_APPLICABLE"),
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      width: 150,
      render: (_, detail) => (
        <Space>
          <Tooltip title={t("EDIT")}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(detail)}
            />
          </Tooltip>
          <Tooltip title={t("DELETE")}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(detail)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => t("TOTAL_ITEMS", { total }),
      }}
      scroll={{ x: 800 }}
    />
  );
};

export default CouponDetailTableSimple;
