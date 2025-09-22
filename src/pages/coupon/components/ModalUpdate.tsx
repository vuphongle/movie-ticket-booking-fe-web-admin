import {
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  message,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/app/services/coupons.service";
import type { Coupon, UpsertCouponRequest } from "@/types";

interface ModalUpdateProps {
  open: boolean;
  coupon?: Coupon | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const ModalUpdate = ({
  open,
  coupon,
  onCancel,
  onSuccess,
}: ModalUpdateProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();

  const isEdit = !!coupon;

  useEffect(() => {
    if (open) {
      if (isEdit && coupon) {
        // Fill form with existing data
        form.setFieldsValue({
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          status: coupon.status,
          startDate: coupon.startDate ? dayjs(coupon.startDate) : null,
          endDate: coupon.endDate ? dayjs(coupon.endDate) : null,
        });
      } else {
        // Reset form for create
        form.resetFields();
      }
    }
  }, [open, isEdit, coupon, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: UpsertCouponRequest = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      if (isEdit && coupon) {
        await updateCoupon({ id: coupon.id, ...payload }).unwrap();
        message.success(t("COUPON_UPDATE_SUCCESS"));
      } else {
        await createCoupon(payload).unwrap();
        message.success(t("COUPON_CREATE_SUCCESS"));
      }

      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.data?.message || t("COUPON_UPDATE_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        isEdit ? t("COUPON_UPDATE_MODAL_TITLE") : t("COUPON_CREATE_MODAL_TITLE")
      }
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("COUPON_CODE_LABEL")}
              name="code"
              rules={[
                { required: true, message: t("COUPON_CODE_REQUIRED") },
                { min: 3, message: t("COUPON_CODE_MIN_LENGTH") },
                { max: 50, message: t("COUPON_CODE_MAX_LENGTH") },
                {
                  pattern: /^[A-Z0-9_-]+$/,
                  message: t("COUPON_CODE_PATTERN"),
                },
              ]}
            >
              <Input
                placeholder={t("COUPON_CODE_PLACEHOLDER")}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  // Only allow valid characters during typing
                  const cleanValue = value.replace(/[^A-Z0-9_-]/g, "");
                  form.setFieldValue("code", cleanValue);
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("COUPON_STATUS_LABEL")}
              name="status"
              rules={[{ required: true, message: t("COUPON_STATUS_REQUIRED") }]}
            >
              <Select
                placeholder={t("COUPON_STATUS_PLACEHOLDER")}
                options={[
                  { label: t("COUPON_STATUS_ACTIVE"), value: true },
                  { label: t("COUPON_STATUS_INACTIVE"), value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t("COUPON_NAME_LABEL")}
          name="name"
          rules={[
            { required: true, message: t("COUPON_NAME_REQUIRED") },
            { min: 3, message: t("COUPON_NAME_MIN_LENGTH") },
            { max: 200, message: t("COUPON_NAME_MAX_LENGTH") },
          ]}
        >
          <Input placeholder={t("COUPON_NAME_PLACEHOLDER")} />
        </Form.Item>

        <Form.Item
          label={t("COUPON_DESCRIPTION_LABEL")}
          name="description"
          rules={[{ max: 1000, message: t("COUPON_DESCRIPTION_MAX_LENGTH") }]}
        >
          <Input.TextArea
            placeholder={t("COUPON_DESCRIPTION_PLACEHOLDER")}
            rows={3}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("COUPON_START_DATE_LABEL")}
              name="startDate"
              rules={[
                { required: true, message: t("COUPON_START_DATE_REQUIRED") },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder={t("SELECT_START_DATE")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("COUPON_END_DATE_LABEL")}
              name="endDate"
              dependencies={["startDate"]}
              rules={[
                { required: true, message: t("COUPON_END_DATE_REQUIRED") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");
                    if (!value || !startDate) {
                      return Promise.resolve();
                    }
                    if (value.isBefore(startDate)) {
                      return Promise.reject(
                        new Error(t("COUPON_END_DATE_AFTER_START"))
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder={t("SELECT_END_DATE")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;
