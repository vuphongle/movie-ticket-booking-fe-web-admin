import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  message,
  Space,
} from "antd";
import { useEffect } from "react";
import {
  useCreateCouponDetailMutation,
  useUpdateCouponDetailMutation,
} from "@/app/services/coupons.service";
import { useGetProductsQuery } from "@/app/services/products.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import {
  TargetType,
  BenefitType,
  type CouponDetail,
  type UpsertCouponDetailRequest,
  type Product,
  type AdditionalService,
} from "@/types";

const { TextArea } = Input;
const { Option } = Select;

interface CouponDetailFormValues {
  enabled: boolean;
  targetType: TargetType;
  targetRefId?: number;
  benefitType: BenefitType;
  notes?: string;
  // Terms fields
  percent?: number;
  amount?: number;
  giftServiceId?: number;
  giftQuantity?: number;
  limitQuantityApplied?: number;
}

interface CouponDetailModalSimplifiedProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  couponId: number;
  detail?: CouponDetail | null;
}

const CouponDetailModalSimplified = ({
  open,
  onCancel,
  onSuccess,
  couponId,
  detail,
}: CouponDetailModalSimplifiedProps) => {
  const [form] = Form.useForm<CouponDetailFormValues>();
  const isEditing = !!detail;

  // Watch form values for conditional rendering
  const targetType = Form.useWatch("targetType", form);
  const benefitType = Form.useWatch("benefitType", form);

  const [createDetail, { isLoading: isCreating }] =
    useCreateCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdating }] =
    useUpdateCouponDetailMutation();

  // Data fetching
  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery(true);
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  const isLoading = isCreating || isUpdating;

  // Form initialization
  useEffect(() => {
    if (open) {
      if (isEditing && detail) {
        // Backend returns flattened data, not nested terms
        form.setFieldsValue({
          enabled: detail.enabled,
          targetType: detail.targetType,
          targetRefId: detail.targetRefId,
          benefitType: detail.benefitType,
          notes: detail.notes,
          // Backend data is at top level, not in terms object
          percent: (detail as any).percent,
          amount: (detail as any).amount,
          giftServiceId: (detail as any).giftServiceId,
          giftQuantity: (detail as any).giftQuantity,
          limitQuantityApplied: (detail as any).limitQuantityApplied,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          enabled: true,
          targetType: TargetType.PRODUCT,
          benefitType: BenefitType.DISCOUNT_PERCENT,
        });
      }
    }
  }, [open, isEditing, detail, form]);

  const handleSubmit = async (values: CouponDetailFormValues) => {
    try {
      const payload: UpsertCouponDetailRequest = {
        enabled: values.enabled,
        targetType: values.targetType,
        targetRefId: values.targetRefId,
        benefitType: values.benefitType,
        notes: values.notes,
      };

      // Only add terms if we have benefit-specific values
      const terms: any = {};

      if (benefitType === BenefitType.DISCOUNT_PERCENT && values.percent) {
        terms.percent = values.percent;
      } else if (benefitType === BenefitType.DISCOUNT_AMOUNT && values.amount) {
        terms.amount = values.amount;
      } else if (benefitType === BenefitType.FREE_PRODUCT) {
        if (values.giftServiceId) terms.giftServiceId = values.giftServiceId;
        if (values.giftQuantity) terms.giftQuantity = values.giftQuantity;
      }

      // Add limits if specified
      if (values.limitQuantityApplied) {
        terms.limitQuantityApplied = values.limitQuantityApplied;
      }

      // Only add terms if we have data
      if (Object.keys(terms).length > 0) {
        payload.terms = terms;
      }

      if (isEditing && detail) {
        await updateDetail({ detailId: detail.id, ...payload }).unwrap();
        message.success("Coupon detail updated successfully");
      } else {
        await createDetail({ couponId, ...payload }).unwrap();
        message.success("Coupon detail created successfully");
      }

      onSuccess?.();
      onCancel();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to save coupon detail";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? "Edit Coupon Detail" : "Add New Coupon Detail"}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={isEditing ? "Update" : "Create"}
      cancelText="Cancel"
      confirmLoading={isLoading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Status */}
        <Form.Item name="enabled" label="Status" valuePropName="checked">
          <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
        </Form.Item>

        {/* Target Configuration */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="targetType"
              label="Target Type"
              rules={[{ required: true, message: "Please select target type" }]}
            >
              <Select placeholder="Select target type">
                <Option value={TargetType.TICKET}>Ticket</Option>
                <Option value={TargetType.PRODUCT}>Product</Option>
                <Option value={TargetType.ADDITIONAL_SERVICE}>Service</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {targetType === TargetType.PRODUCT && (
              <Form.Item
                name="targetRefId"
                label="Select Product"
                rules={[{ required: true, message: "Please select a product" }]}
              >
                <Select
                  placeholder="Select a product"
                  loading={isLoadingProducts}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children?.toString() || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {products.map((product: Product) => (
                    <Option key={product.id} value={product.id}>
                      {product.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {targetType === TargetType.ADDITIONAL_SERVICE && (
              <Form.Item
                name="targetRefId"
                label="Select Service"
                rules={[{ required: true, message: "Please select a service" }]}
              >
                <Select
                  placeholder="Select a service"
                  loading={isLoadingServices}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children?.toString() || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {additionalServices.map((service: AdditionalService) => (
                    <Option key={service.id} value={service.id}>
                      {service.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>

        {/* Benefit Configuration */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="benefitType"
              label="Benefit Type"
              rules={[
                { required: true, message: "Please select benefit type" },
              ]}
            >
              <Select placeholder="Select benefit type">
                <Option value={BenefitType.DISCOUNT_PERCENT}>
                  Percentage Discount
                </Option>
                <Option value={BenefitType.DISCOUNT_AMOUNT}>
                  Fixed Amount Discount
                </Option>
                <Option value={BenefitType.FREE_PRODUCT}>Free Product</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {benefitType === BenefitType.DISCOUNT_PERCENT && (
              <Form.Item
                name="percent"
                label="Discount Percentage (%)"
                rules={[
                  { required: true, message: "Please enter percentage" },
                  {
                    type: "number",
                    min: 0.01,
                    max: 100,
                    message: "Must be between 0.01 and 100",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter percentage"
                  precision={2}
                  min={0.01}
                  max={100}
                />
              </Form.Item>
            )}

            {benefitType === BenefitType.DISCOUNT_AMOUNT && (
              <Form.Item
                name="amount"
                label="Discount Amount"
                rules={[
                  { required: true, message: "Please enter amount" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter amount"
                  precision={2}
                  min={0.01}
                />
              </Form.Item>
            )}

            {benefitType === BenefitType.FREE_PRODUCT && (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Form.Item
                  name="giftServiceId"
                  label="Free Service"
                  rules={[
                    { required: true, message: "Please select free service" },
                  ]}
                >
                  <Select
                    placeholder="Select free service"
                    loading={isLoadingServices}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children?.toString() || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {additionalServices.map((service: AdditionalService) => (
                      <Option key={service.id} value={service.id}>
                        {service.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="giftQuantity"
                  label="Quantity"
                  rules={[
                    { required: true, message: "Enter quantity" },
                    { type: "number", min: 1, message: "Must be at least 1" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter quantity"
                    min={1}
                  />
                </Form.Item>
              </Space>
            )}
          </Col>
        </Row>

        {/* Usage Limits */}
        <Form.Item
          name="limitQuantityApplied"
          label="Maximum Usage Per Order (Optional)"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Leave empty for unlimited"
            min={1}
          />
        </Form.Item>

        {/* Usage Count Display (Edit only) */}
        {isEditing && (detail as any)?.detailUsedCount !== undefined && (
          <Form.Item label="Usage Statistics">
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color:
                    (detail as any).detailUsedCount > 0 ? "#1890ff" : "#8c8c8c",
                }}
              >
                {(detail as any).detailUsedCount}
              </span>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#262626",
                  }}
                >
                  Times Used
                </div>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  {(detail as any).detailUsedCount === 0
                    ? "Not used yet"
                    : "Total usage count"}
                </div>
              </div>
            </div>
          </Form.Item>
        )}

        {/* Notes */}
        <Form.Item
          name="notes"
          label="Notes (Optional)"
          rules={[
            { max: 1000, message: "Notes cannot exceed 1000 characters" },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Enter additional notes"
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CouponDetailModalSimplified;
