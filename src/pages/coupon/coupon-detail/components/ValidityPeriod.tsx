import { Form, DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export const ValidityPeriod = () => {
  return (
    <Form.Item
      name="validityPeriod"
      label="Validity Period"
      tooltip="Select the date range when this coupon detail is active"
      rules={[
        {
          required: true,
          message: "Please select validity period",
        },
      ]}
    >
      <RangePicker
        style={{ width: "100%" }}
        showTime={{ format: "HH:mm" }}
        format="YYYY-MM-DD HH:mm"
        placeholder={["Start Date", "End Date"]}
        disabledDate={(current) => current && current < dayjs().startOf("day")}
      />
    </Form.Item>
  );
};
