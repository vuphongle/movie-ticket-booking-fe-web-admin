import { Form, Switch, Card } from "antd";

export const StatusToggle = () => {
  return (
    <Card size="small" title="Status Configuration">
      <Form.Item
        name="enabled"
        label="Enabled Status"
        valuePropName="checked"
        extra="Enable or disable this coupon detail"
        tooltip="When disabled, this coupon detail won't be available for use"
      >
        <Switch
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
          defaultChecked
        />
      </Form.Item>
    </Card>
  );
};
