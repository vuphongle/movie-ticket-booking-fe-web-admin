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
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Option } = Select;

interface CouponDetailFormValues {
  enabled: boolean;
  targetType: TargetType;
  targetRefId?: number;
  benefitType: BenefitType;
  notes?: string;
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
  const { t } = useTranslation();

  const targetType = Form.useWatch("targetType", form);
  const benefitType = Form.useWatch("benefitType", form);

  const [createDetail, { isLoading: isCreating }] =
    useCreateCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdating }] =
    useUpdateCouponDetailMutation();

  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery(true);
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      if (isEditing && detail) {
        form.setFieldsValue({
          enabled: detail.enabled,
          targetType: detail.targetType,
          targetRefId: detail.targetRefId,
          benefitType: detail.benefitType,
          notes: detail.notes,
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

      const terms: Record<string, number> = {};

      if (benefitType === BenefitType.DISCOUNT_PERCENT && values.percent) {
        terms.percent = values.percent;
      } else if (
        benefitType === BenefitType.DISCOUNT_AMOUNT &&
        values.amount !== undefined
      ) {
        terms.amount = values.amount;
      } else if (benefitType === BenefitType.FREE_PRODUCT) {
        if (values.giftServiceId) terms.giftServiceId = values.giftServiceId;
        if (values.giftQuantity) terms.giftQuantity = values.giftQuantity;
      }

      if (values.limitQuantityApplied) {
        terms.limitQuantityApplied = values.limitQuantityApplied;
      }

      if (Object.keys(terms).length > 0) {
        payload.terms = terms;
      }

      if (isEditing && detail) {
        await updateDetail({ detailId: detail.id, ...payload }).unwrap();
        message.success(t("COUPON_DETAIL_UPDATE_SUCCESS"));
      } else {
        await createDetail({ couponId, ...payload }).unwrap();
        message.success(t("COUPON_DETAIL_CREATE_SUCCESS"));
      }

      onSuccess?.();
      onCancel();
    } catch (error: any) {
      const errorMessage = error?.data?.message || t("COUPON_DETAIL_ERROR");
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        isEditing ? t("COUPON_DETAIL_EDIT_TITLE") : t("COUPON_DETAIL_ADD_TITLE")
      }
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={
        isEditing
          ? t("COUPON_DETAIL_UPDATE_BTN")
          : t("COUPON_DETAIL_CREATE_BTN")
      }
      cancelText={t("COUPON_DETAIL_CANCEL_BTN")}
      confirmLoading={isLoading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="enabled"
          label={t("COUPON_DETAIL_ENABLED_LABEL")}
          valuePropName="checked"
        >
          <Switch
            checkedChildren={t("ACTIVE")}
            unCheckedChildren={t("INACTIVE")}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="targetType"
              label={t("COUPON_DETAIL_TARGET_TYPE_LABEL")}
              rules={[{ required: true, message: t("TARGET_TYPE_REQUIRED") }]}
            >
              <Select placeholder={t("SELECT_TARGET_PLACEHOLDER")}>
                <Option value={TargetType.TICKET}>
                  {t("COUPON_TARGET_TICKET")}
                </Option>
                <Option value={TargetType.PRODUCT}>
                  {t("COUPON_TARGET_PRODUCT")}
                </Option>
                <Option value={TargetType.ADDITIONAL_SERVICE}>
                  {t("COUPON_TARGET_SERVICE")}
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {targetType === TargetType.PRODUCT && (
              <Form.Item
                name="targetRefId"
                label={t("COUPON_DETAIL_TARGET_PRODUCT_LABEL")}
                rules={[{ required: true, message: t("PRODUCT_REQUIRED") }]}
              >
                <Select
                  placeholder={t("SELECT_PRODUCT")}
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
                label={t("COUPON_DETAIL_TARGET_SERVICE_LABEL")}
                rules={[{ required: true, message: t("SERVICE_REQUIRED") }]}
              >
                <Select
                  placeholder={t("SELECT_SERVICE_PLACEHOLDER")}
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="benefitType"
              label={t("COUPON_DETAIL_BENEFIT_TYPE_LABEL")}
              rules={[{ required: true, message: t("BENEFIT_TYPE_REQUIRED") }]}
            >
              <Select placeholder={t("SELECT_BENEFIT_TYPE_PLACEHOLDER")}>
                <Option value={BenefitType.DISCOUNT_PERCENT}>
                  {t("BENEFIT_DISCOUNT_PERCENT")}
                </Option>
                <Option value={BenefitType.DISCOUNT_AMOUNT}>
                  {t("BENEFIT_DISCOUNT_AMOUNT")}
                </Option>
                <Option value={BenefitType.FREE_PRODUCT}>
                  {t("BENEFIT_FREE_PRODUCT")}
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {benefitType === BenefitType.DISCOUNT_PERCENT && (
              <Form.Item
                name="percent"
                label={t("COUPON_DETAIL_PERCENT_LABEL")}
                rules={[
                  { required: true, message: t("PERCENT_REQUIRED") },
                  {
                    type: "number",
                    min: 0.01,
                    max: 100,
                    message: t("PERCENT_RANGE_MESSAGE"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("ENTER_PERCENTAGE")}
                  precision={2}
                  min={0.01}
                  max={100}
                />
              </Form.Item>
            )}

            {benefitType === BenefitType.DISCOUNT_AMOUNT && (
              <Form.Item
                name="amount"
                label={t("COUPON_DETAIL_AMOUNT_LABEL")}
                rules={[
                  { required: true, message: t("AMOUNT_REQUIRED") },
                  {
                    type: "number",
                    min: 0.01,
                    message: t("AMOUNT_MIN_MESSAGE"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("ENTER_AMOUNT")}
                  precision={2}
                  min={0.01}
                />
              </Form.Item>
            )}

            {benefitType === BenefitType.FREE_PRODUCT && (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Form.Item
                  name="giftServiceId"
                  label={t("COUPON_DETAIL_FREE_SERVICE_LABEL")}
                  rules={[{ required: true, message: t("SERVICE_REQUIRED") }]}
                >
                  <Select
                    placeholder={t("SELECT_SERVICE_PLACEHOLDER")}
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
                  label={t("COUPON_DETAIL_GIFT_QUANTITY_LABEL")}
                  rules={[
                    { required: true, message: t("GIFT_QUANTITY_REQUIRED") },
                    {
                      type: "number",
                      min: 1,
                      message: t("GIFT_QUANTITY_MIN_MESSAGE"),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t("ENTER_QUANTITY")}
                    min={1}
                  />
                </Form.Item>
              </Space>
            )}
          </Col>
        </Row>

        <Form.Item
          name="limitQuantityApplied"
          label={t("COUPON_DETAIL_LIMIT_QUANTITY_LABEL")}
          tooltip={t("LIMIT_QUANTITY_TOOLTIP")}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder={t("COUPON_DETAIL_LIMIT_QUANTITY_PLACEHOLDER")}
            min={1}
          />
        </Form.Item>

        {isEditing && (detail as any)?.detailUsedCount !== undefined && (
          <Form.Item label={t("COUPON_DETAIL_USAGE_STATS_LABEL")}>
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
                  {t("COUPON_DETAIL_USAGE_TIMES_LABEL")}
                </div>
                <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                  {(detail as any).detailUsedCount === 0
                    ? t("COUPON_DETAIL_USAGE_NOT_USED")
                    : t("COUPON_DETAIL_USAGE_TOTAL")}
                </div>
              </div>
            </div>
          </Form.Item>
        )}

        <Form.Item
          name="notes"
          label={t("COUPON_DETAIL_NOTES_LABEL")}
          rules={[{ max: 1000, message: t("COUPON_DETAIL_NOTES_MAX_LENGTH") }]}
        >
          <TextArea
            rows={3}
            placeholder={t("NOTES_PLACEHOLDER")}
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CouponDetailModalSimplified;
