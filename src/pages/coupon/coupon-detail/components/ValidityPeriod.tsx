import { Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

export const ValidityPeriod = () => {
  const { t } = useTranslation();
  return (
    <Form.Item
      name="validityPeriod"
      label={t("COUPON_DETAIL_VALIDITY_LABEL")}
      tooltip={t("COUPON_DETAIL_VALIDITY_TOOLTIP")}
      rules={[
        {
          required: true,
          message: t("COUPON_DETAIL_VALIDITY_REQUIRED"),
        },
      ]}
    >
      <RangePicker
        style={{ width: "100%" }}
        showTime={{ format: "HH:mm" }}
        format="YYYY-MM-DD HH:mm"
        placeholder={[t("SELECT_START_DATE"), t("SELECT_END_DATE")]}
        disabledDate={(current) => current && current < dayjs().startOf("day")}
      />
    </Form.Item>
  );
};
