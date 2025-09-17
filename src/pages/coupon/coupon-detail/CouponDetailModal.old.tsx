import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Row,
  Col,
  message,
  DatePicker,
  Tabs,
} from "antd";
import { useEffect } from "react";
import {
  useCreateCouponDetailMutation,
  useUpdateCouponDetailMutation,
} from "@/app/services/coupons.service";
import { useGetSeatTypeOptionsQuery } from "@/app/services/seatType.service";
import type { CouponDetail, Coupon } from "@/types";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { Option } = Select;
const { TextArea } = Input;

interface CouponDetailModalProps {
  couponId: number;
  coupon?: Coupon; // Add coupon prop for default dates
  detail?: CouponDetail;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CouponDetailModal = ({
  couponId,
  coupon,
  detail,
  open,
  onCancel,
  onSuccess,
}: CouponDetailModalProps) => {
  const [form] = Form.useForm();
  const isEditing = !!detail;

  const [createDetail, { isLoading: isCreating }] =
    useCreateCouponDetailMutation();
  const [updateDetail, { isLoading: isUpdating }] =
    useUpdateCouponDetailMutation();

  // Get seat type options for dropdown
  const { data: seatTypeOptions = [], isLoading: isLoadingSeatTypes } =
    useGetSeatTypeOptionsQuery();
  useEffect(() => {
    if (detail) {
      // Convert date strings to dayjs objects for DatePicker
      const formValues = {
        ...detail,
        startDate: detail.startDate ? dayjs(detail.startDate) : undefined,
        endDate: detail.endDate ? dayjs(detail.endDate) : undefined,
      };
      form.setFieldsValue(formValues);
    } else {
      // Set default values for new detail, using parent coupon dates
      const defaultValues = {
        enabled: true,
        linePriority: 1,
        selectionStrategy: "HIGHEST_PRICE_FIRST",
        startDate: coupon?.startDate ? dayjs(coupon.startDate) : undefined,
        endDate: coupon?.endDate ? dayjs(coupon.endDate) : undefined,
      };
      form.resetFields();
      form.setFieldsValue(defaultValues);
    }
  }, [detail, form, coupon]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert dayjs objects to date-only strings for API (preserving local timezone)
      const submitValues = {
        ...values,
        startDate: values.startDate
          ? values.startDate.startOf('day').toISOString()
          : undefined,
        endDate: values.endDate
          ? values.endDate.endOf('day').toISOString()
          : undefined,
      };

      if (isEditing) {
        await updateDetail({
          couponId,
          detailId: detail!.id,
          ...submitValues,
        }).unwrap();
        message.success("Cập nhật chi tiết coupon thành công!");
      } else {
        await createDetail({
          couponId,
          ...submitValues,
        }).unwrap();
        message.success("Tạo chi tiết coupon thành công!");
      }

      onSuccess?.();
    } catch (error: any) {
      message.error(error.data?.message || "Có lỗi xảy ra");
    }
  };

  const benefitType = Form.useWatch("benefitType", form);
  const targetType = Form.useWatch("targetType", form);

  // Reset targetRefId when targetType changes
  useEffect(() => {
    if (targetType === "ORDER") {
      form.setFieldValue("targetRefId", null);
    }
  }, [targetType, form]);

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa chi tiết coupon" : "Thêm chi tiết coupon"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEditing ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      confirmLoading={isCreating || isUpdating}
      width={1000}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          enabled: true,
          linePriority: 1,
          selectionStrategy: "HIGHEST_PRICE_FIRST",
        }}
      >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          enabled: true,
          linePriority: 1,
          selectionStrategy: "HIGHEST_PRICE_FIRST",
        }}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Cài đặt cơ bản",
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Kích hoạt" name="enabled" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Ưu tiên"
                        name="linePriority"
                        rules={[{ required: true, message: "Vui lòng nhập độ ưu tiên!" }]}
                      >
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Chiến lược chọn"
                        name="selectionStrategy"
                        tooltip="Cách chọn sản phẩm khi áp dụng giảm giá"
                      >
                        <Select>
                          <Option value="HIGHEST_PRICE_FIRST">Giá cao nhất trước</Option>
                          <Option value="LOWEST_PRICE_FIRST">Giá thấp nhất trước</Option>
                          <Option value="FIFO">Theo thứ tự</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Đối tượng áp dụng"
                        name="targetType"
                        rules={[{ required: true, message: "Vui lòng chọn đối tượng!" }]}
                      >
                        <Select placeholder="Chọn đối tượng">
                          <Option value="ORDER">Tổng đơn hàng</Option>
                          <Option value="SEAT_TYPE">Loại ghế cụ thể</Option>
                          <Option value="SERVICE">Dịch vụ bổ sung</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="ID tham chiếu"
                        name="targetRefId"
                        tooltip={
                          targetType === "ORDER"
                            ? "Không cần thiết cho đơn hàng"
                            : targetType === "SEAT_TYPE"
                              ? "Chọn loại ghế cụ thể"
                              : "ID của dịch vụ cụ thể"
                        }
                      >
                        {targetType === "ORDER" ? (
                          <Input
                            disabled
                            placeholder="Không cần thiết cho đơn hàng"
                            style={{ width: "100%" }}
                          />
                        ) : targetType === "SEAT_TYPE" ? (
                          <Select
                            placeholder="Chọn loại ghế"
                            style={{ width: "100%" }}
                            allowClear
                            loading={isLoadingSeatTypes}
                          >
                            {seatTypeOptions.map((option) => (
                              <Option key={option.key} value={option.id}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <InputNumber
                            min={1}
                            placeholder="Nhập ID dịch vụ"
                            style={{ width: "100%" }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "2", 
              label: "Lợi ích & Giảm giá",
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Loại lợi ích"
                        name="benefitType"
                        rules={[
                          { required: true, message: "Vui lòng chọn loại lợi ích!" },
                        ]}
                      >
                        <Select placeholder="Chọn loại lợi ích">
                          <Option value="DISCOUNT_PERCENT">Giảm theo %</Option>
                          <Option value="DISCOUNT_AMOUNT">Giảm số tiền</Option>
                          <Option value="FREE_PRODUCT">Tặng sản phẩm</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {benefitType === "DISCOUNT_PERCENT" && (
                        <Form.Item
                          label="Phần trăm giảm"
                          name="percent"
                          rules={[
                            { required: true, message: "Vui lòng nhập phần trăm!" },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            suffix="%"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      )}
                      {benefitType === "DISCOUNT_AMOUNT" && (
                        <Form.Item
                          label="Số tiền giảm"
                          name="amount"
                          rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
                        >
                          <InputNumber min={0} suffix="VND" style={{ width: "100%" }} />
                        </Form.Item>
                      )}
                      {benefitType === "FREE_PRODUCT" && (
                        <Form.Item
                          label="ID sản phẩm tặng"
                          name="giftServiceId"
                          rules={[
                            { required: true, message: "Vui lòng nhập ID sản phẩm!" },
                          ]}
                        >
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>

                  {benefitType === "FREE_PRODUCT" && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Số lượng tặng"
                          name="giftQuantity"
                          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                        >
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Giảm tối đa mỗi dòng"
                        name="lineMaxDiscount"
                        tooltip="Số tiền giảm tối đa cho mỗi dòng sản phẩm"
                      >
                        <InputNumber min={0} suffix="VND" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Giá trị đơn hàng tối thiểu"
                        name="minOrderTotal"
                        tooltip="Tổng giá trị đơn hàng tối thiểu để áp dụng"
                      >
                        <InputNumber min={0} suffix="VND" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "3",
              label: "Điều kiện & Giới hạn",
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Số lượng tối thiểu"
                        name="minQuantity"
                        tooltip="Số lượng sản phẩm tối thiểu để áp dụng"
                      >
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Giới hạn số lượng áp dụng"
                        name="limitQuantityApplied"
                        tooltip="Số lượng sản phẩm tối đa được áp dụng giảm giá"
                      >
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Giới hạn sử dụng"
                        name="detailUsageLimit"
                        tooltip="Số lần tối đa chi tiết này có thể được sử dụng"
                      >
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "4",
              label: "Thời gian & Ghi chú",
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        tooltip="Ngày bắt đầu hiệu lực của chi tiết coupon này"
                        rules={[
                          { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || !dayjs.isDayjs(value)) {
                                return Promise.resolve();
                              }

                              // Validate against parent coupon start date
                              if (coupon?.startDate) {
                                const parentStartDate = dayjs(coupon.startDate);
                                if (value.isBefore(parentStartDate, "day")) {
                                  return Promise.reject(
                                    new Error(
                                      `Ngày bắt đầu không thể trước ngày bắt đầu của coupon cha (${parentStartDate.format("DD/MM/YYYY")})`
                                    )
                                  );
                                }
                              }

                              // Validate against parent coupon end date
                              if (coupon?.endDate) {
                                const parentEndDate = dayjs(coupon.endDate);
                                if (value.isAfter(parentEndDate, "day")) {
                                  return Promise.reject(
                                    new Error(
                                      `Ngày bắt đầu không thể sau ngày kết thúc của coupon cha (${parentEndDate.format("DD/MM/YYYY")})`
                                    )
                                  );
                                }
                              }

                              // Validate against form end date
                              const endDate = getFieldValue("endDate");
                              if (
                                endDate &&
                                dayjs.isDayjs(endDate) &&
                                value.isAfter(endDate, "day")
                              ) {
                                return Promise.reject(
                                  new Error("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc")
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
                          placeholder="Chọn ngày bắt đầu"
                          disabledDate={(date) => {
                            const today = dayjs().startOf('day');
                            if (date.isBefore(today)) return true;
                            
                            if (coupon?.startDate) {
                              const parentStartDate = dayjs(coupon.startDate);
                              if (date.isBefore(parentStartDate, "day")) return true;
                            }
                            
                            if (coupon?.endDate) {
                              const parentEndDate = dayjs(coupon.endDate);
                              if (date.isAfter(parentEndDate, "day")) return true;
                            }
                            
                            return false;
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        tooltip="Ngày kết thúc hiệu lực của chi tiết coupon này"
                        rules={[
                          { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || !dayjs.isDayjs(value)) {
                                return Promise.resolve();
                              }

                              // Validate against parent coupon start date
                              if (coupon?.startDate) {
                                const parentStartDate = dayjs(coupon.startDate);
                                if (value.isBefore(parentStartDate, "day")) {
                                  return Promise.reject(
                                    new Error(
                                      `Ngày kết thúc không thể trước ngày bắt đầu của coupon cha (${parentStartDate.format("DD/MM/YYYY")})`
                                    )
                                  );
                                }
                              }

                              // Validate against parent coupon end date
                              if (coupon?.endDate) {
                                const parentEndDate = dayjs(coupon.endDate);
                                if (value.isAfter(parentEndDate, "day")) {
                                  return Promise.reject(
                                    new Error(
                                      `Ngày kết thúc không thể sau ngày kết thúc của coupon cha (${parentEndDate.format("DD/MM/YYYY")})`
                                    )
                                  );
                                }
                              }

                              // Validate against form start date
                              const startDate = getFieldValue("startDate");
                              if (
                                startDate &&
                                dayjs.isDayjs(startDate) &&
                                value.isBefore(startDate, "day")
                              ) {
                                return Promise.reject(
                                  new Error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu")
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
                          disabledDate={(date) => {
                            if (coupon?.startDate) {
                              const parentStartDate = dayjs(coupon.startDate);
                              if (date.isBefore(parentStartDate, "day")) return true;
                            }
                            
                            if (coupon?.endDate) {
                              const parentEndDate = dayjs(coupon.endDate);
                              if (date.isAfter(parentEndDate, "day")) return true;
                            }
                            
                            return false;
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Ghi chú" name="notes">
                    <Input.TextArea rows={4} placeholder="Nhập ghi chú..." />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Form>        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Loại lợi ích"
              name="benefitType"
              rules={[
                { required: true, message: "Vui lòng chọn loại lợi ích!" },
              ]}
            >
              <Select placeholder="Chọn loại lợi ích">
                <Option value="DISCOUNT_PERCENT">Giảm theo %</Option>
                <Option value="DISCOUNT_AMOUNT">Giảm số tiền</Option>
                <Option value="FREE_PRODUCT">Tặng sản phẩm</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {benefitType === "DISCOUNT_PERCENT" && (
              <Form.Item
                label="Phần trăm giảm"
                name="percent"
                rules={[
                  { required: true, message: "Vui lòng nhập phần trăm!" },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  suffix="%"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
            {benefitType === "DISCOUNT_AMOUNT" && (
              <Form.Item
                label="Số tiền giảm"
                name="amount"
                rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
              >
                <InputNumber min={0} suffix="VND" style={{ width: "100%" }} />
              </Form.Item>
            )}
            {benefitType === "FREE_PRODUCT" && (
              <>
                <Form.Item
                  label="ID sản phẩm tặng"
                  name="giftServiceId"
                  rules={[
                    { required: true, message: "Vui lòng nhập ID sản phẩm!" },
                  ]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>

        {benefitType === "FREE_PRODUCT" && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số lượng tặng"
                name="giftQuantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giảm tối đa mỗi dòng"
              name="lineMaxDiscount"
              tooltip="Số tiền giảm tối đa cho mỗi dòng sản phẩm"
            >
              <InputNumber min={0} suffix="VND" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số lượng tối thiểu"
              name="minQuantity"
              tooltip="Số lượng sản phẩm tối thiểu để áp dụng"
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giới hạn số lượng áp dụng"
              name="limitQuantityApplied"
              tooltip="Số lượng sản phẩm tối đa được áp dụng giảm giá"
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá trị đơn hàng tối thiểu"
              name="minOrderTotal"
              tooltip="Tổng giá trị đơn hàng tối thiểu để áp dụng"
            >
              <InputNumber min={0} suffix="VND" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giới hạn sử dụng"
              name="detailUsageLimit"
              tooltip="Số lần tối đa chi tiết này có thể được sử dụng"
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Chiến lược chọn"
              name="selectionStrategy"
              tooltip="Cách chọn sản phẩm khi áp dụng giảm giá"
            >
              <Select>
                <Option value="HIGHEST_PRICE_FIRST">Giá cao nhất trước</Option>
                <Option value="LOWEST_PRICE_FIRST">Giá thấp nhất trước</Option>
                <Option value="FIFO">Theo thứ tự</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

                          <Form.Item label="Ghi chú" name="notes">
                    <Input.TextArea rows={4} placeholder="Nhập ghi chú..." />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default CouponDetailModal;

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              tooltip="Ngày bắt đầu hiệu lực của chi tiết coupon này"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !dayjs.isDayjs(value)) {
                      return Promise.resolve();
                    }

                    // Validate against parent coupon start date
                    if (coupon?.startDate) {
                      const parentStartDate = dayjs(coupon.startDate);
                      if (value.isBefore(parentStartDate, "day")) {
                        return Promise.reject(
                          new Error(
                            `Ngày bắt đầu không thể trước ngày bắt đầu của coupon cha (${parentStartDate.format("DD/MM/YYYY")})`
                          )
                        );
                      }
                    }

                    // Validate against parent coupon end date
                    if (coupon?.endDate) {
                      const parentEndDate = dayjs(coupon.endDate);
                      if (value.isAfter(parentEndDate, "day")) {
                        return Promise.reject(
                          new Error(
                            `Ngày bắt đầu không thể sau ngày kết thúc của coupon cha (${parentEndDate.format("DD/MM/YYYY")})`
                          )
                        );
                      }
                    }

                    // Validate against form end date
                    const endDate = getFieldValue("endDate");
                    if (
                      endDate &&
                      dayjs.isDayjs(endDate) &&
                      value.isAfter(endDate, "day")
                    ) {
                      return Promise.reject(
                        new Error(
                          "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!"
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  if (!current) return false;

                  // Disable dates before parent coupon start date
                  if (
                    coupon?.startDate &&
                    current.isBefore(dayjs(coupon.startDate), "day")
                  ) {
                    return true;
                  }

                  // Disable dates after parent coupon end date
                  if (
                    coupon?.endDate &&
                    current.isAfter(dayjs(coupon.endDate), "day")
                  ) {
                    return true;
                  }

                  return false;
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              tooltip="Ngày kết thúc hiệu lực của chi tiết coupon này"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !dayjs.isDayjs(value)) {
                      return Promise.resolve();
                    }

                    // Validate against parent coupon start date
                    if (coupon?.startDate) {
                      const parentStartDate = dayjs(coupon.startDate);
                      if (value.isBefore(parentStartDate, "day")) {
                        return Promise.reject(
                          new Error(
                            `Ngày kết thúc không thể trước ngày bắt đầu của coupon cha (${parentStartDate.format("DD/MM/YYYY")})`
                          )
                        );
                      }
                    }

                    // Validate against parent coupon end date
                    if (coupon?.endDate) {
                      const parentEndDate = dayjs(coupon.endDate);
                      if (value.isAfter(parentEndDate, "day")) {
                        return Promise.reject(
                          new Error(
                            `Ngày kết thúc không thể sau ngày kết thúc của coupon cha (${parentEndDate.format("DD/MM/YYYY")})`
                          )
                        );
                      }
                    }

                    // Validate against form start date
                    const startDate = getFieldValue("startDate");
                    if (
                      startDate &&
                      dayjs.isDayjs(startDate) &&
                      value.isBefore(startDate, "day")
                    ) {
                      return Promise.reject(
                        new Error(
                          "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!"
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  if (!current) return false;

                  // Disable dates before parent coupon start date
                  if (
                    coupon?.startDate &&
                    current.isBefore(dayjs(coupon.startDate), "day")
                  ) {
                    return true;
                  }

                  // Disable dates after parent coupon end date
                  if (
                    coupon?.endDate &&
                    current.isAfter(dayjs(coupon.endDate), "day")
                  ) {
                    return true;
                  }

                  return false;
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CouponDetailModal;
