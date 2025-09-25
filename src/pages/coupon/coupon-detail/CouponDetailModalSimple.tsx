import { Form, Modal, Select, message } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateCouponDetailMutation,
  useUpdateCouponDetailMutation,
} from "@/app/services/coupons.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import type { CouponDetail, Coupon } from "@/types";

const { Option } = Select;

interface CouponDetailModalProps {
  couponId: number;
  coupon?: Coupon;
  detail?: CouponDetail;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CouponDetailModalSimple = ({
  couponId,
  coupon,
  detail,
  open,
  onCancel,
  onSuccess,
}: CouponDetailModalProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isEditing = !!detail;

  const [createDetail, { isLoading: isCreating }] =
    useCreateCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdating }] =
    useUpdateCouponDetailMutation();

  // Get additional services for dropdown
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  useEffect(() => {
    if (detail) {
      // Fill with simplified detail fields - only 4 fields in new schema
      form.setFieldsValue({
        targetType: detail.targetType || "ORDER",
        giftServiceId: detail.giftServiceId,
      });
    } else {
      // Set defaults for new detail
      form.resetFields();
      form.setFieldsValue({
        targetType: "ORDER",
      });
    }
  }, [detail, form, coupon]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing) {
        await updateDetail({
          couponId,
          detailId: detail!.id,
          ...values,
        }).unwrap();
        message.success(t("COUPON_DETAIL_UPDATE_SUCCESS"));
      } else {
        await createDetail({
          couponId,
          ...values,
        }).unwrap();
        message.success(t("COUPON_DETAIL_CREATE_SUCCESS"));
      }

      onSuccess?.();
    } catch (error: any) {
      message.error(error.data?.message || t("COUPON_DETAIL_ERROR"));
    }
  };

  const targetType = Form.useWatch("targetType", form);

  return (
    <Modal
      title={
        isEditing ? t("COUPON_DETAIL_EDIT_TITLE") : t("COUPON_DETAIL_ADD_TITLE")
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={
        isEditing
          ? t("COUPON_DETAIL_UPDATE_BTN")
          : t("COUPON_DETAIL_CREATE_BTN")
      }
      cancelText={t("COUPON_DETAIL_CANCEL_BTN")}
      confirmLoading={isCreating || isUpdating}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          targetType: "ORDER",
        }}
      >
        <Form.Item
          label={t("COUPON_DETAIL_TARGET_TYPE_LABEL")}
          name="targetType"
          rules={[{ required: true, message: t("TARGET_TYPE_REQUIRED") }]}
        >
          <Select placeholder={t("SELECT_TARGET_PLACEHOLDER")}>
            <Option value="ORDER">{t("TARGET_ORDER")}</Option>
            <Option value="SEAT_TYPE">{t("TARGET_SEAT_TYPE")}</Option>
            <Option value="SERVICE">{t("TARGET_SERVICE")}</Option>
          </Select>
        </Form.Item>

        {targetType === "SERVICE" && (
          <Form.Item
            label={t("COUPON_DETAIL_GIFT_PRODUCT_LABEL")}
            name="giftServiceId"
            rules={[{ required: true, message: t("GIFT_PRODUCT_REQUIRED") }]}
          >
            <Select
              placeholder={t("SELECT_SERVICE_PLACEHOLDER")}
              allowClear
              loading={isLoadingServices}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                return (
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase()) || false
                );
              }}
            >
              {additionalServices
                .filter((service) => service.status) // Only show active services
                .map((service) => (
                  <Option
                    key={service.id}
                    value={service.id}
                    label={`${service.name} (${service.type})`}
                  >
                    {service.name} ({service.type})
                  </Option>
                ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CouponDetailModalSimple;
