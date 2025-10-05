import { Form, Switch, Card } from "antd";
import { useTranslation } from "react-i18next";

export const StatusToggle = () => {
  const { t } = useTranslation();
  return (
    <Card size="small" title={t("COUPON_DETAIL_STATUS_SECTION_TITLE")}>
      <Form.Item
        name="enabled"
        label={t("COUPON_DETAIL_ENABLED_LABEL")}
        valuePropName="checked"
        extra={t("COUPON_DETAIL_ENABLED_EXTRA")}
        tooltip={t("COUPON_DETAIL_ENABLED_TOOLTIP")}
      >
        <Switch
          checkedChildren={t("ACTIVE")}
          unCheckedChildren={t("INACTIVE")}
          defaultChecked
        />
      </Form.Item>
    </Card>
  );
};
