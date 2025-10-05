import { Tag, Space, Tooltip } from "antd";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "@/utils/functionUtils";
import type { Coupon, CouponKind } from "@/types";
import { useTranslation } from "react-i18next";

interface CouponNameDisplayProps {
  coupon: Coupon;
}

export const CouponNameDisplay = ({ coupon }: CouponNameDisplayProps) => (
  <Space direction="vertical" size={0}>
    <RouterLink to={`/admin/coupons/${coupon.id}/detail`}>
      <strong style={{ color: "#1890ff" }}>{coupon.name}</strong>
    </RouterLink>
    {coupon.description && (
      <small style={{ color: "#666", fontSize: "12px" }}>
        {coupon.description.length > 40
          ? `${coupon.description.substring(0, 40)}...`
          : coupon.description}
      </small>
    )}
  </Space>
);

interface CouponCodeDisplayProps {
  code: string | null;
}

export const CouponCodeDisplay = ({ code }: CouponCodeDisplayProps) =>
  code ? (
    <Tag color="purple" style={{ fontFamily: "monospace", fontSize: "11px" }}>
      {code}
    </Tag>
  ) : (
    <span style={{ color: "#ccc" }}>—</span>
  );

interface CouponKindDisplayProps {
  kind: CouponKind;
}

export const CouponKindDisplay = ({ kind }: CouponKindDisplayProps) => {
  const { t } = useTranslation();
  const kindConfig = {
    DISPLAY: { color: "blue", label: t("COUPON_KIND_DISPLAY") },
    VOUCHER: { color: "green", label: t("COUPON_KIND_VOUCHER") },
  } as const;

  const config = kindConfig[kind] || { color: "default", label: kind };

  return <Tag color={config.color}>{config.label}</Tag>;
};

interface CouponStatusDisplayProps {
  status: boolean;
  startDate: string;
  endDate: string;
  coupon: Coupon;
}

export const CouponStatusDisplay = ({
  status,
  startDate,
  endDate,
  coupon,
}: CouponStatusDisplayProps) => {
  const { t } = useTranslation();
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!status) {
    // Check if this is a newly created coupon (less than 1 hour old)
    const createdAt = coupon.createdAt ? new Date(coupon.createdAt) : null;
    const isNewCoupon =
      createdAt && now.getTime() - createdAt.getTime() < 3600000; // 1 hour

    const tooltipTitle = isNewCoupon
      ? t("COUPON_STATUS_INACTIVE_NEW_TOOLTIP")
      : t("COUPON_STATUS_INACTIVE_TOOLTIP");

    return (
      <Tooltip title={tooltipTitle}>
        <Tag color="red">{t("COUPON_STATUS_INACTIVE")}</Tag>
      </Tooltip>
    );
  }

  if (now < start) {
    return <Tag color="orange">{t("COUPON_STATUS_UPCOMING")}</Tag>;
  }

  if (now > end) {
    return <Tag color="gray">{t("COUPON_STATUS_EXPIRED")}</Tag>;
  }

  return <Tag color="green">{t("COUPON_STATUS_ACTIVE")}</Tag>;
};

interface CouponDateRangeDisplayProps {
  startDate: string;
  endDate: string;
}

export const CouponDateRangeDisplay = ({
  startDate,
  endDate,
}: CouponDateRangeDisplayProps) => {
  const { t } = useTranslation();
  return (
    <Space direction="vertical" size={0}>
      <small style={{ fontSize: "11px" }}>
        <strong>{t("COUPON_START_DATE_LABEL")}:</strong> {formatDate(startDate)}
      </small>
      <small style={{ fontSize: "11px" }}>
        <strong>{t("COUPON_END_DATE_LABEL")}:</strong> {formatDate(endDate)}
      </small>
    </Space>
  );
};
