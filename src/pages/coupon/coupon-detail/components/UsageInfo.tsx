import { Form, Typography, Card } from "antd";
import type { CouponDetail } from "@/types";

const { Text } = Typography;

interface UsageInfoProps {
  detail?: CouponDetail | null;
}

export const UsageInfo = ({ detail }: UsageInfoProps) => {
  if (!detail || !detail.terms) {
    return null;
  }

  return (
    <Card size="small" title="Usage Information">
      <Form.Item label="Times Used" style={{ marginBottom: 0 }}>
        <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
          {detail.terms.detailUsedCount || 0}
        </Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>
          times
        </Text>
      </Form.Item>
    </Card>
  );
};
