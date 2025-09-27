import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  message,
  Row,
  Col,
  Alert,
} from "antd";
import { useEffect } from "react";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/app/services/coupons.service";
import { CouponKind, type Coupon, type UpsertCouponRequest } from "@/types";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface CouponFormValues
  extends Omit<UpsertCouponRequest, "startDate" | "endDate"> {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
}

interface CouponModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  coupon?: Coupon | null;
}

const CouponModal = ({
  open,
  onCancel,
  onSuccess,
  coupon,
}: CouponModalProps) => {
  const [form] = Form.useForm<CouponFormValues>();
  const isEditing = !!coupon;

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const isLoading = isCreating || isUpdating;

  // Watch for kind field changes to show/hide code field
  const kindValue = Form.useWatch("kind", form);

  useEffect(() => {
    if (open) {
      if (isEditing && coupon) {
        // Populate form with existing coupon data
        form.setFieldsValue({
          ...coupon,
          dateRange: [dayjs(coupon.startDate), dayjs(coupon.endDate)],
        });
      } else {
        // Reset form for creating new coupon
        // New coupons must be created with status = false (hidden) per backend requirement
        form.resetFields();
        form.setFieldsValue({
          kind: CouponKind.DISPLAY,
          status: false,
        });
      }
    }
  }, [open, isEditing, coupon, form]);

  const handleSubmit = async (values: CouponFormValues) => {
    try {
      const payload: UpsertCouponRequest = {
        kind: values.kind,
        name: values.name,
        description: values.description,
        status: values.status,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
      };

      // Only include code for VOUCHER type coupons
      if (values.kind === CouponKind.VOUCHER) {
        payload.code = values.code?.toUpperCase();
      }

      if (isEditing && coupon) {
        await updateCoupon({ id: coupon.id, ...payload }).unwrap();
        message.success("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        message.success({
          content: (
            <div>
              <div>Coupon created successfully!</div>
              <small style={{ color: "#666" }}>
                The coupon is inactive. Add coupon details to activate it.
              </small>
            </div>
          ),
          duration: 6,
        });
      }

      onSuccess?.();
      onCancel();
    } catch (error: any) {
      // Try to show backend error message if available
      const errorMessage =
        error?.data?.message ||
        (isEditing ? "Failed to update coupon" : "Failed to create coupon");
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? "Edit Coupon" : "Create New Coupon"}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={isEditing ? "Update" : "Create"}
      cancelText="Cancel"
      confirmLoading={isLoading}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Warning for new coupons */}
        {!isEditing && (
          <Alert
            message="New Coupon Requirement"
            description="New coupons must be created with 'Inactive' status. After adding coupon details, you can activate the coupon."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="kind"
              label="Coupon Kind"
              rules={[{ required: true, message: "Please select coupon kind" }]}
            >
              <Select placeholder="Select coupon kind">
                <Select.Option value={CouponKind.DISPLAY}>
                  Display
                </Select.Option>
                <Select.Option value={CouponKind.VOUCHER}>
                  Voucher
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status" valuePropName="checked">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                disabled={!isEditing}
              />
            </Form.Item>
            {!isEditing && (
              <small style={{ color: "#666", fontSize: "12px" }}>
                New coupons must be created as inactive
              </small>
            )}
          </Col>
        </Row>

        <Form.Item
          name="name"
          label="Coupon Name"
          rules={[
            { required: true, message: "Please enter coupon name" },
            { max: 100, message: "Name cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter coupon name" />
        </Form.Item>

        {/* Code field - only for VOUCHER type */}
        {kindValue === CouponKind.VOUCHER && (
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[
              {
                required: true,
                message: "Please enter coupon code for voucher type",
              },
              { min: 3, message: "Code must be at least 3 characters" },
              { max: 20, message: "Code cannot exceed 20 characters" },
              {
                pattern: /^[A-Za-z0-9_-]+$/,
                message:
                  "Code can only contain letters, numbers, underscore and dash",
              },
            ]}
            extra="Code will be automatically converted to uppercase"
          >
            <Input
              placeholder="Enter coupon code (e.g. SAVE20)"
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: "Description cannot exceed 500 characters" },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Enter coupon description (optional)"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Valid Date Range"
          rules={[{ required: true, message: "Please select date range" }]}
        >
          <RangePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder={["Start Date", "End Date"]}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CouponModal;
