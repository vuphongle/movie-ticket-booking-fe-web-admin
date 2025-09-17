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
          startAt: coupon.startAt ? dayjs(coupon.startAt) : null,
          endAt: coupon.endAt ? dayjs(coupon.endAt) : null,
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
        startAt: values.startAt ? values.startAt.toISOString() : null,
        endAt: values.endAt ? values.endAt.toISOString() : null,
      };

      if (isEdit && coupon) {
        await updateCoupon({ id: coupon.id, ...payload }).unwrap();
        message.success("Cập nhật coupon thành công!");
      } else {
        await createCoupon(payload).unwrap();
        message.success("Tạo coupon thành công!");
      }

      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.data?.message || "Có lỗi xảy ra!");
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
      title={isEdit ? "Chỉnh sửa coupon" : "Tạo coupon mới"}
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
              label="Mã coupon"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã coupon!" },
                { min: 3, message: "Mã coupon phải có ít nhất 3 ký tự!" },
                { max: 50, message: "Mã coupon không được quá 50 ký tự!" },
                {
                  pattern: /^[A-Z0-9_-]+$/,
                  message:
                    "Mã chỉ chứa chữ hoa, số, dấu gạch dưới và gạch ngang!",
                },
              ]}
            >
              <Input
                placeholder="VD: SUMMER2024"
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
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { label: "Kích hoạt", value: true },
                  { label: "Ẩn", value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tên coupon"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên coupon!" },
            { min: 3, message: "Tên coupon phải có ít nhất 3 ký tự!" },
            { max: 200, message: "Tên coupon không được quá 200 ký tự!" },
          ]}
        >
          <Input placeholder="VD: Giảm giá mùa hè 2024" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ max: 1000, message: "Mô tả không được quá 1000 ký tự!" }]}
        >
          <Input.TextArea
            placeholder="Mô tả chi tiết về coupon..."
            rows={3}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startAt"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày bắt đầu"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ngày kết thúc"
              name="endAt"
              dependencies={["startAt"]}
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startAt = getFieldValue("startAt");
                    if (!value || !startAt) {
                      return Promise.resolve();
                    }
                    if (value.isBefore(startAt)) {
                      return Promise.reject(
                        new Error("Ngày kết thúc phải sau ngày bắt đầu!")
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
                placeholder="Chọn ngày kết thúc"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;
