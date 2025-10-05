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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      title: t("COUPON_DETAIL_DELETE_CONFIRM_TITLE"),
      content: t("COUPON_DETAIL_DELETE_CONFIRM_CONTENT"),
      okText: t("COUPON_DETAIL_DELETE_OK"),
      cancelText: t("COUPON_DETAIL_DELETE_CANCEL"),
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDetail(detail.id).unwrap();
          message.success(t("COUPON_DETAIL_DELETE_SUCCESS"));
          onRefresh();
        } catch {
          message.error(t("DELETE_DETAIL_ERROR"));
        }
      },
    });
  };

  const handleDuplicateDetail = async (detail: CouponDetail) => {
    try {
      await duplicateDetail(detail.id).unwrap();
      message.success(t("COUPON_DETAIL_DUPLICATE_SUCCESS"));
      onRefresh();
    } catch {
      message.error(t("COUPON_DETAIL_DUPLICATE_ERROR"));
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
        newEnabled
          ? t("COUPON_DETAIL_ENABLE_SUCCESS")
          : t("COUPON_DETAIL_DISABLE_SUCCESS"),
      );
      onRefresh();
    } catch {
      message.error(t("STATUS_UPDATE_ERROR"));
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
      label: t("COUPON_DETAIL_EDIT_MENU"),
      onClick: () => handleEditDetail(record),
    },
    {
      key: "duplicate",
      icon: <CopyOutlined />,
      label: t("COUPON_DETAIL_DUPLICATE_MENU"),
      onClick: () => handleDuplicateDetail(record),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: t("COUPON_DETAIL_DELETE_MENU"),
      danger: true,
      onClick: () => handleDeleteDetail(record),
    },
  ];

  const columns: ColumnsType<CouponDetail> = [
    {
      title: t("COUPON_DETAIL_STATUS_COLUMN"),
      dataIndex: "enabled",
      key: "enabled",
      width: 80,
      filters: [
        { text: t("ACTIVE"), value: true },
        { text: t("INACTIVE"), value: false },
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
      title: t("COUPON_DETAIL_TARGET_COLUMN"),
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
      title: t("COUPON_DETAIL_BENEFIT_COLUMN"),
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
      title: t("COUPON_DETAIL_USAGE_COLUMN"),
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
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (text: string) => (text ? formatDate(text) : "—"),
    },
    {
      title: t("COUPON_DETAIL_ACTIONS_COLUMN"),
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
          {t("ADD_COUPON_DETAIL_BTN")}
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
            `${range[0]}-${range[1]} ${t("PAGINATION_TOTAL")} ${total} ${t("PAGINATION_ITEMS")}`,
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
