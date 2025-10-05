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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const isLoading = isCreating || isUpdating;
  const kindValue = Form.useWatch("kind", form);

  useEffect(() => {
    if (open) {
      if (isEditing && coupon) {
        form.setFieldsValue({
          ...coupon,
          dateRange: [dayjs(coupon.startDate), dayjs(coupon.endDate)],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          kind: CouponKind.DISPLAY,
          status: false,
        });
      }
    }
  }, [open, isEditing, coupon, form]);

  useEffect(() => {
    if (!open) return;

    const fieldsWithErrors = form
      .getFieldsError()
      .filter(({ errors }) => errors.length > 0);

    if (fieldsWithErrors.length > 0) {
      const fieldNames = fieldsWithErrors.map(({ name }) => name);
      form.validateFields(fieldNames).catch(() => {
        // Ignore validation errors; this re-triggers localization updates
      });
    }
  }, [t, form, open]);

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
        message.success(t("COUPON_UPDATE_SUCCESS"));
      } else {
        await createCoupon(payload).unwrap();
        message.success({
          content: (
            <div>
              <div>{t("COUPON_CREATE_SUCCESS")}</div>
              <small style={{ color: "#666" }}>
                {t("COUPON_CREATE_INACTIVE_HINT")}
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
        (isEditing ? t("COUPON_UPDATE_ERROR") : t("COUPON_CREATE_ERROR"));
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
        isEditing
          ? t("COUPON_UPDATE_MODAL_TITLE")
          : t("COUPON_CREATE_MODAL_TITLE")
      }
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={isEditing ? t("COUPON_UPDATE_BTN") : t("COUPON_CREATE_BTN")}
      cancelText={t("COUPON_CANCEL_BTN")}
      confirmLoading={isLoading}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Warning for new coupons */}
        {!isEditing && (
          <Alert
            message={t("COUPON_CREATE_ALERT_TITLE")}
            description={t("COUPON_CREATE_ALERT_DESCRIPTION")}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="kind"
              label={t("COUPON_KIND_LABEL")}
              rules={[{ required: true, message: t("COUPON_KIND_REQUIRED") }]}
            >
              <Select placeholder={t("COUPON_KIND_PLACEHOLDER")}>
                <Select.Option value={CouponKind.DISPLAY}>
                  {t("COUPON_KIND_DISPLAY")}
                </Select.Option>
                <Select.Option value={CouponKind.VOUCHER}>
                  {t("COUPON_KIND_VOUCHER")}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t("COUPON_STATUS_LABEL")}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t("COUPON_STATUS_ACTIVE")}
                unCheckedChildren={t("COUPON_STATUS_INACTIVE")}
                disabled={!isEditing}
              />
            </Form.Item>
            {!isEditing && (
              <small style={{ color: "#666", fontSize: "12px" }}>
                {t("COUPON_NEW_INACTIVE_NOTE")}
              </small>
            )}
          </Col>
        </Row>

        <Form.Item
          name="name"
          label={t("COUPON_NAME_LABEL")}
          rules={[
            { required: true, message: t("COUPON_NAME_REQUIRED") },
            { max: 100, message: t("COUPON_NAME_MAX_LENGTH") },
          ]}
        >
          <Input placeholder={t("COUPON_NAME_PLACEHOLDER")} />
        </Form.Item>

        {/* Code field - only for VOUCHER type */}
        {kindValue === CouponKind.VOUCHER && (
          <Form.Item
            name="code"
            label={t("COUPON_CODE_LABEL")}
            rules={[
              {
                required: true,
                message: t("COUPON_CODE_REQUIRED"),
              },
              { min: 3, message: t("COUPON_CODE_MIN_LENGTH") },
              { max: 20, message: t("COUPON_CODE_MAX_LENGTH") },
              {
                pattern: /^[A-Za-z0-9_-]+$/,
                message: t("COUPON_CODE_PATTERN"),
              },
            ]}
            extra={t("COUPON_CODE_AUTO_UPPERCASE")}
          >
            <Input
              placeholder={t("COUPON_CODE_PLACEHOLDER_EXAMPLE")}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label={t("COUPON_DESCRIPTION_LABEL")}
          rules={[{ max: 500, message: t("COUPON_DESCRIPTION_MAX_LENGTH") }]}
        >
          <TextArea
            rows={3}
            placeholder={t("COUPON_DESCRIPTION_PLACEHOLDER")}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label={t("COUPON_DATE_RANGE_LABEL")}
          rules={[{ required: true, message: t("COUPON_DATE_RANGE_REQUIRED") }]}
        >
          <RangePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder={[t("SELECT_START_DATE"), t("SELECT_END_DATE")]}
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
