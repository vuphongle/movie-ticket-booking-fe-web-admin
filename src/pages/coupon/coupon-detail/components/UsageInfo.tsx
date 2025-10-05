import { Form, Typography, Card } from "antd";
import type { CouponDetail } from "@/types";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface UsageInfoProps {
  detail?: CouponDetail | null;
}

export const UsageInfo = ({ detail }: UsageInfoProps) => {
  const { t } = useTranslation();
  if (!detail || !detail.terms) {
    return null;
  }

  return (
    <Card size="small" title={t("COUPON_DETAIL_USAGE_STATS_LABEL")}>
      <Form.Item
        label={t("COUPON_DETAIL_USAGE_TIMES_LABEL")}
        style={{ marginBottom: 0 }}
      >
        <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
          {detail.terms.detailUsedCount || 0}
        </Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>
          {t("COUPON_DETAIL_USAGE_TIMES_SUFFIX")}
        </Text>
      </Form.Item>
    </Card>
  );
};
