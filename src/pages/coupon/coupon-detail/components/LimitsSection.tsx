import { Form, InputNumber } from "antd";

export const LimitsSection = () => {
  return (
    <Form.Item
      name="limitQuantityApplied"
      label="Quantity Limit"
      extra="Maximum quantity this benefit can be applied to (optional)"
      tooltip="Limits how many items this coupon can be applied to in a single order"
    >
      <InputNumber
        style={{ width: "100%" }}
        placeholder="Enter quantity limit (optional)"
        min={1}
      />
    </Form.Item>
  );
};
