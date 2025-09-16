import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useUpdateCouponMutation } from "../../../app/services/coupons.service";
import { formatDate } from "../../../utils/functionUtils";
import type { CouponModalProps, UpdateCouponRequest } from "@/types";

const ModalUpdate = (props: CouponModalProps) => {
  const { coupon, open, onCancel } = props;
  const { t } = useTranslation();
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  const onFinish = (values: Omit<UpdateCouponRequest, "id">) => {
    updateCoupon({ id: coupon.id, ...values })
      .unwrap()
      .then((_data) => {
        message.success(t("COUPON_UPDATE_SUCCESS"));
        onCancel();
      })
      .catch((error: any) => {
        message.error(error.data?.message || t("COUPON_UPDATE_ERROR"));
      });
  };

  return (
    <>
      <Modal
        open={open}
        title={t("COUPON_UPDATE_MODAL_TITLE")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            ...coupon,
            startDate: coupon.startDate
              ? dayjs(formatDate(coupon.startDate), "DD/MM/YYYY")
              : null,
            endDate: coupon.endDate
              ? dayjs(formatDate(coupon.endDate), "DD/MM/YYYY")
              : null,
          }}
        >
          <Form.Item
            label={t("COUPON_CODE_LABEL")}
            name="code"
            rules={[
              {
                required: true,
                message: t("COUPON_CODE_REQUIRED"),
              },
            ]}
          >
            <Input placeholder={t("COUPON_CODE_PLACEHOLDER")} />
          </Form.Item>

          <Form.Item
            label={t("COUPON_DISCOUNT_LABEL")}
            name="discount"
            rules={[
              {
                required: true,
                message: t("COUPON_DISCOUNT_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value > 100 || value < 0) {
                    return Promise.reject(
                      new Error(t("COUPON_DISCOUNT_RANGE_ERROR"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("COUPON_DISCOUNT_PLACEHOLDER")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_MAX_DISCOUNT_LABEL")}
            name="maxDiscount"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value <= 0) {
                    return Promise.reject(
                      new Error(t("COUPON_MAX_DISCOUNT_MIN_ERROR"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("COUPON_MAX_DISCOUNT_PLACEHOLDER")}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_QUANTITY_LABEL")}
            name="quantity"
            rules={[
              {
                required: true,
                message: t("COUPON_QUANTITY_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(
                      new Error(t("COUPON_QUANTITY_MIN_ERROR"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("COUPON_QUANTITY_PLACEHOLDER")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_STATUS_LABEL")}
            name="status"
            rules={[
              {
                required: true,
                message: t("COUPON_STATUS_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("COUPON_STATUS_PLACEHOLDER")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("COUPON_STATUS_INACTIVE"), value: false },
                { label: t("COUPON_STATUS_ACTIVE"), value: true },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_START_DATE_LABEL")}
            name="startDate"
            rules={[
              {
                required: true,
                message: t("COUPON_START_DATE_REQUIRED"),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>

          <Form.Item
            label={t("COUPON_END_DATE_LABEL")}
            name="endDate"
            rules={[
              {
                required: true,
                message: t("COUPON_END_DATE_REQUIRED"),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("COUPON_UPDATE_BTN")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpdate;
