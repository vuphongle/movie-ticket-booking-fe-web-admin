import { Form, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

export const LimitsSection = () => {
  const { t } = useTranslation();
  return (
    <Form.Item
      name="limitQuantityApplied"
      label={t("COUPON_DETAIL_LIMIT_QUANTITY_LABEL")}
      extra={t("COUPON_DETAIL_LIMIT_QUANTITY_EXTRA")}
      tooltip={t("LIMIT_QUANTITY_TOOLTIP")}
    >
      <InputNumber
        style={{ width: "100%" }}
        placeholder={t("COUPON_DETAIL_LIMIT_QUANTITY_PLACEHOLDER")}
        min={1}
      />
    </Form.Item>
  );
};
