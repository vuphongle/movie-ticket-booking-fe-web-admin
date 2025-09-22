import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Switch, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useDeleteCouponDetailMutation,
  useUpdateCouponDetailMutation,
} from "@/app/services/coupons.service";
import type { CouponDetail } from "@/types";
import dayjs from "dayjs";

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
  const { t } = useTranslation();
  const [deleteDetail, { isLoading: isDeleting }] =
    useDeleteCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdating }] =
    useUpdateCouponDetailMutation();

  const getActionMenuItems = (detail: CouponDetail): MenuProps["items"] => [
    {
      key: "edit",
      label: (
        <Space>
          <EditOutlined />
          {t("COUPON_DETAIL_EDIT_MENU")}
        </Space>
      ),
      onClick: () => onEdit?.(detail),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: (
        <Space>
          <DeleteOutlined />
          {t("COUPON_DETAIL_DELETE_MENU")}
        </Space>
      ),
      danger: true,
      onClick: () => handleDelete(detail),
    },
  ];

  // Check if any data has certain fields to decide whether to show columns
  const hasConditions = data.some(
    (item) =>
      item.minOrderTotal || item.minQuantity || item.limitQuantityApplied
  );
  const hasNotes = data.some((item) => item.notes);
  const hasUsageLimit = data.some((item) => item.detailUsageLimit);
  const hasMultipleStrategies = data.some(
    (item) =>
      item.selectionStrategy && item.selectionStrategy !== "HIGHEST_PRICE_FIRST"
  );

  const getBenefitText = (detail: CouponDetail) => {
    switch (detail.benefitType) {
      case "DISCOUNT_PERCENT":
        return `${t("BENEFIT_DISCOUNT_TEXT")} ${detail.percent}%${detail.lineMaxDiscount ? ` (${t("BENEFIT_MAX_TEXT")} ${detail.lineMaxDiscount?.toLocaleString()} VND)` : ""}`;
      case "DISCOUNT_AMOUNT":
        return `${t("BENEFIT_DISCOUNT_TEXT")} ${detail.amount?.toLocaleString()} VND`;
      case "FREE_PRODUCT":
        return `${t("BENEFIT_GIFT_TEXT")} ${detail.giftQuantity} ${t("BENEFIT_PRODUCT_TEXT")}`;
      default:
        return "N/A";
    }
  };

  const getSeatTypeName = (seatTypeId: number) => {
    const seatTypeMap = {
      1: t("SEAT_TYPE_REGULAR"),
      2: t("SEAT_TYPE_VIP"),
      3: t("SEAT_TYPE_COUPLE"),
    };
    return (
      seatTypeMap[seatTypeId as keyof typeof seatTypeMap] ||
      `${t("SEAT_TYPE_DEFAULT")} ${seatTypeId}`
    );
  };

  const getTargetText = (detail: CouponDetail) => {
    switch (detail.targetType) {
      case "ORDER":
        return t("TARGET_FULL_ORDER");
      case "SEAT_TYPE":
        return detail.targetRefId
          ? getSeatTypeName(detail.targetRefId)
          : t("TARGET_ALL_SEAT_TYPES");
      case "SERVICE":
        return detail.targetRefId
          ? `${t("TARGET_SERVICE_PREFIX")} ${detail.targetRefId}`
          : t("TARGET_ALL_SERVICES");
      default:
        return "N/A";
    }
  };

  const getConditionsText = (detail: CouponDetail) => {
    const conditions = [];
    if (detail.minOrderTotal) {
      conditions.push(
        `${t("MIN_ORDER_CONDITION")}: ${detail.minOrderTotal.toLocaleString()} VND`
      );
    }
    if (detail.minQuantity) {
      conditions.push(`${t("MIN_QUANTITY_CONDITION")}: ${detail.minQuantity}`);
    }
    if (detail.limitQuantityApplied) {
      conditions.push(
        `${t("LIMIT_APPLIED_CONDITION")}: ${detail.limitQuantityApplied}`
      );
    }
    return conditions.length > 0 ? conditions.join("\n") : "-";
  };

  const getDateRangeText = (detail: CouponDetail) => {
    const startDate = dayjs(detail.startDate).format("DD/MM/YYYY");
    const endDate = dayjs(detail.endDate).format("DD/MM/YYYY");

    if (startDate === endDate) {
      return startDate;
    }
    return `${startDate}\n${endDate}`;
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
        startDate: detail.startDate,
        endDate: detail.endDate,
      }).unwrap();

      message.success(
        detail.enabled
          ? t("COUPON_DETAIL_DISABLE_SUCCESS")
          : t("COUPON_DETAIL_ENABLE_SUCCESS")
      );
    } catch (error: any) {
      message.error(error.data?.message || t("STATUS_UPDATE_ERROR"));
    }
  };

  const handleDelete = (detail: CouponDetail) => {
    Modal.confirm({
      title: t("COUPON_DETAIL_DELETE_CONFIRM_TITLE"),
      content: t("COUPON_DETAIL_DELETE_CONFIRM_CONTENT"),
      okText: t("COUPON_DETAIL_DELETE_OK"),
      okType: "danger",
      cancelText: t("COUPON_DETAIL_DELETE_CANCEL"),
      okButtonProps: { loading: isDeleting },
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteDetail(detail.id)
            .unwrap()
            .then(() => {
              message.success(t("COUPON_DETAIL_DELETE_SUCCESS"));
              resolve();
            })
            .catch((error: any) => {
              message.error(error.data?.message || t("DELETE_DETAIL_ERROR"));
              reject();
            });
        });
      },
    });
  };

  const columns: ColumnsType<CouponDetail> = [
    {
      title: t("COUPON_DETAIL_STATUS_COLUMN"),
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
      title: t("COUPON_DETAIL_PRIORITY_COLUMN"),
      dataIndex: "linePriority",
      key: "linePriority",
      width: 80,
      sorter: (a, b) => a.linePriority - b.linePriority,
      render: (priority: number) => (
        <span style={{ fontWeight: "bold" }}>{priority}</span>
      ),
    },
    {
      title: t("COUPON_DETAIL_TARGET_COLUMN"),
      dataIndex: "targetType",
      key: "targetType",
      width: 150,
      render: (_, record: CouponDetail) => getTargetText(record),
    },
    {
      title: t("COUPON_DETAIL_BENEFIT_COLUMN"),
      dataIndex: "benefitType",
      key: "benefitType",
      width: 200,
      render: (_, record: CouponDetail) => getBenefitText(record),
    },
    // Chỉ hiển thị cột Điều kiện nếu có dữ liệu
    ...(hasConditions
      ? [
          {
            title: t("COUPON_DETAIL_CONDITIONS_COLUMN"),
            key: "conditions",
            width: 180,
            render: (_value: any, record: CouponDetail) => (
              <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
                {getConditionsText(record)}
              </div>
            ),
          },
        ]
      : []),
    // Chỉ hiển thị cột Sử dụng nếu có usage limit hoặc đã được sử dụng
    ...(hasUsageLimit || data.some((item) => item.detailUsedCount > 0)
      ? [
          {
            title: t("COUPON_DETAIL_USAGE_COLUMN"),
            dataIndex: "detailUsedCount",
            key: "detailUsedCount",
            width: 100,
            render: (count: number, record: CouponDetail) => (
              <span>
                <strong>{count}</strong>
                {record.detailUsageLimit
                  ? ` / ${record.detailUsageLimit}`
                  : " / ∞"}
              </span>
            ),
          },
        ]
      : []),
    // Chỉ hiển thị cột Chiến lược nếu có nhiều strategy khác nhau
    ...(hasMultipleStrategies
      ? [
          {
            title: t("COUPON_DETAIL_STRATEGY_COLUMN"),
            dataIndex: "selectionStrategy",
            key: "selectionStrategy",
            width: 120,
            render: (strategy: string) => {
              const strategyMap = {
                HIGHEST_PRICE_FIRST: t("STRATEGY_HIGHEST_PRICE_FIRST"),
                LOWEST_PRICE_FIRST: t("STRATEGY_LOWEST_PRICE_FIRST"),
                FIFO: t("STRATEGY_FIFO"),
              };
              return (
                strategyMap[strategy as keyof typeof strategyMap] || strategy
              );
            },
          },
        ]
      : []),
    // Always show date range column (now required)
    {
      title: t("COUPON_DETAIL_DATE_RANGE_COLUMN"),
      key: "dateRange",
      width: 150,
      render: (_value: any, record: CouponDetail) => (
        <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
          {getDateRangeText(record)}
        </div>
      ),
    },
    // Chỉ hiển thị cột Ghi chú nếu có dữ liệu
    ...(hasNotes
      ? [
          {
            title: t("COUPON_DETAIL_NOTES_COLUMN"),
            dataIndex: "notes",
            key: "notes",
            width: 150,
            ellipsis: true,
            render: (notes: string) => notes || "-",
          },
        ]
      : []),
    {
      title: t("COUPON_DETAIL_ACTIONS_COLUMN"),
      key: "actions",
      width: 80,
      fixed: "right" as const,
      render: (_: any, record: CouponDetail) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<SettingOutlined />}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          />
        </Dropdown>
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
      scroll={{ x: "max-content" }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} ${t("PAGINATION_TOTAL")} ${total} ${t("PAGINATION_ITEMS")}`,
        pageSizeOptions: ["10", "20", "50", "100"],
        defaultPageSize: 20,
      }}
    />
  );
};

export default CouponDetailTable;
