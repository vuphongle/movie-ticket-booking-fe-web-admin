import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Modal, Switch, message, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useState } from "react";
import {
  useDeleteCouponDetailMutation,
  useDuplicateCouponDetailMutation,
  useUpdateCouponDetailMutation,
} from "@/app/services/coupons.service";
import { formatDate } from "@/utils/functionUtils";
import type { Coupon, CouponDetail } from "@/types";
import CouponDetailModalSimplified from "./CouponDetailModalSimplified";
import { TargetTypeDisplay, BenefitTypeDisplay } from "./components";

interface CouponDetailsTabProps {
  couponId: number;
  coupon: Coupon;
  details: CouponDetail[];
  loading: boolean;
  onRefresh: () => void;
}

const CouponDetailsTab = ({
  couponId,
  coupon: _coupon,
  details,
  loading,
  onRefresh,
}: CouponDetailsTabProps) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<CouponDetail | null>(null);

  const [deleteDetail, { isLoading: isDeleting }] =
    useDeleteCouponDetailMutation();
  const [duplicateDetail, { isLoading: isDuplicating }] =
    useDuplicateCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdatingDetail }] =
    useUpdateCouponDetailMutation();

  const handleCreateDetail = () => {
    setEditingDetail(null);
    setDetailModalOpen(true);
  };

  const handleEditDetail = (detail: CouponDetail) => {
    setEditingDetail(detail);
    setDetailModalOpen(true);
  };

  const handleDeleteDetail = async (detail: CouponDetail) => {
    Modal.confirm({
      title: "Delete Coupon Detail",
      content:
        "Are you sure you want to delete this coupon detail? This action cannot be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDetail(detail.id).unwrap();
          message.success("Coupon detail deleted successfully");
          onRefresh();
        } catch {
          message.error("Failed to delete coupon detail");
        }
      },
    });
  };

  const handleDuplicateDetail = async (detail: CouponDetail) => {
    try {
      await duplicateDetail(detail.id).unwrap();
      message.success("Coupon detail duplicated successfully");
      onRefresh();
    } catch {
      message.error("Failed to duplicate coupon detail");
    }
  };

  const handleToggleDetailEnabled = async (detail: CouponDetail) => {
    const newEnabled = !detail.enabled;
    try {
      await updateDetail({
        detailId: detail.id,
        enabled: newEnabled,
        targetType: detail.targetType,
        targetRefId: detail.targetRefId,
        benefitType: detail.benefitType,
        notes: detail.notes,
        terms: detail.terms
          ? {
              percent: detail.terms.percent,
              amount: detail.terms.amount,
              giftServiceId: detail.terms.giftServiceId,
              giftQuantity: detail.terms.giftQuantity,
              limitQuantityApplied: detail.terms.limitQuantityApplied,
            }
          : undefined,
      }).unwrap();
      message.success(
        `Coupon detail ${newEnabled ? "enabled" : "disabled"} successfully`
      );
      onRefresh();
    } catch {
      message.error(
        `Failed to ${newEnabled ? "enable" : "disable"} coupon detail`
      );
    }
  };

  const handleModalSuccess = () => {
    onRefresh();
    setDetailModalOpen(false);
    setEditingDetail(null);
  };

  const handleModalCancel = () => {
    setDetailModalOpen(false);
    setEditingDetail(null);
  };

  const getActionMenuItems = (record: CouponDetail): MenuProps["items"] => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => handleEditDetail(record),
    },
    {
      key: "duplicate",
      icon: <CopyOutlined />,
      label: "Duplicate",
      onClick: () => handleDuplicateDetail(record),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: () => handleDeleteDetail(record),
    },
  ];

  const columns: ColumnsType<CouponDetail> = [
    {
      title: "Status",
      dataIndex: "enabled",
      key: "enabled",
      width: 80,
      filters: [
        { text: "Enabled", value: true },
        { text: "Disabled", value: false },
      ],
      onFilter: (value, record) => record.enabled === value,
      render: (enabled: boolean, record: CouponDetail) => (
        <Switch
          size="small"
          checked={enabled}
          loading={isUpdatingDetail}
          onChange={() => handleToggleDetailEnabled(record)}
          style={{ opacity: enabled ? 1 : 0.5 }}
        />
      ),
    },
    {
      title: "Target",
      key: "target",
      width: 120,
      render: (_, record) => (
        <TargetTypeDisplay
          targetType={record.targetType}
          targetRefId={record.targetRefId}
        />
      ),
    },
    {
      title: "Benefit",
      key: "benefit",
      width: 130,
      render: (_, record) => (
        <BenefitTypeDisplay
          benefitType={record.benefitType}
          terms={record as any} // Backend data is flattened, not nested
        />
      ),
    },
    {
      title: "Usage Count",
      key: "usageCount",
      width: 90,
      align: "center",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {(record as any).detailUsedCount || 0}
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (text: string) => (text ? formatDate(text) : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" size="small" icon={<SettingOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateDetail}
        >
          Add Detail
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={details}
        rowKey="id"
        loading={loading || isDeleting || isDuplicating || isUpdatingDetail}
        scroll={{ x: 900 }}
        size="small"
        pagination={{
          total: details.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
          size: "small",
        }}
      />

      <CouponDetailModalSimplified
        open={detailModalOpen}
        couponId={couponId}
        detail={editingDetail}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CouponDetailsTab;
