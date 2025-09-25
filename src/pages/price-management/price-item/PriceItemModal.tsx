import {
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  message,
} from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreatePriceItemMutation,
  useUpdatePriceItemMutation,
} from "@/app/services/priceItem.service";
import { useGetProductsQuery } from "@/app/services/products.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import type { PriceItem, PriceList } from "@/types";

const { Option } = Select;

interface PriceItemModalProps {
  visible: boolean;
  onCancel: () => void;
  priceList: PriceList;
  editingItem?: PriceItem | null;
}

const PriceItemModal = ({
  visible,
  onCancel,
  priceList,
  editingItem,
}: PriceItemModalProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery(undefined);
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  const [createPriceItem, { isLoading: isCreating }] =
    useCreatePriceItemMutation();
  const [updatePriceItem, { isLoading: isUpdating }] =
    useUpdatePriceItemMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!editingItem;

  useEffect(() => {
    if (visible) {
      if (editingItem) {
        // Editing mode - populate form with existing data
        form.setFieldsValue({
          targetType: editingItem.targetType,
          targetId: editingItem.targetId,
          price: editingItem.price,
          priority: editingItem.priority,
          status: editingItem.status,
          seatType: editingItem.seatType,
          graphicsType: editingItem.graphicsType,
          screeningTimeType: editingItem.screeningTimeType,
          dayType: editingItem.dayType,
          auditoriumType: editingItem.auditoriumType,
        });
      } else {
        // Creating mode - reset form with default values
        form.resetFields();
        form.setFieldsValue({
          targetType: "TICKET",
          priority: 1,
          status: true,
        });
      }
    }
  }, [visible, editingItem, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Remove effective period handling since it's now controlled by PriceList
      const payload: any = {
        priceListId: priceList.id,
        targetType: values.targetType,
        targetId: values.targetId || null,
        price: values.price,
        priority: values.priority,
        status: values.status ?? true,
        seatType: values.seatType || null,
        graphicsType: values.graphicsType || null,
        screeningTimeType: values.screeningTimeType || null,
        dayType: values.dayType || null,
        auditoriumType: values.auditoriumType || null,
      };

      if (isEditing) {
        await updatePriceItem({
          id: editingItem!.id,
          ...payload,
        }).unwrap();
        message.success(t("UPDATE_SUCCESS"));
      } else {
        await createPriceItem(payload).unwrap();
        message.success(t("CREATE_SUCCESS"));
      }

      onCancel();
      form.resetFields();
    } catch (error: any) {
      console.error("❌ [DEBUG] Form submission error:", error);
      message.error(
        error.data?.message ||
          (isEditing ? t("UPDATE_ERROR") : t("CREATE_ERROR")),
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const targetTypeOptions = [
    { value: "TICKET", label: t("TARGET_TYPE_TICKET") },
    { value: "PRODUCT", label: t("TARGET_TYPE_PRODUCT") },
    { value: "ADDITIONAL_SERVICE", label: t("TARGET_TYPE_ADDITIONAL_SERVICE") },
  ];

  const renderTicketConditions = () => {
    return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("SEAT_TYPE")}
              name="seatType"
              tooltip={t("SEAT_TYPE_TOOLTIP")}
            >
              <Select placeholder={t("SELECT_SEAT_TYPE")} allowClear>
                <Option value="NORMAL">{t("SEAT_TYPE_NORMAL")}</Option>
                <Option value="VIP">{t("SEAT_TYPE_VIP")}</Option>
                <Option value="COUPLE">{t("SEAT_TYPE_COUPLE")}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("GRAPHICS_TYPE")}
              name="graphicsType"
              tooltip={t("GRAPHICS_TYPE_TOOLTIP")}
            >
              <Select placeholder={t("SELECT_GRAPHICS_TYPE")} allowClear>
                <Option value="_2D">{t("GRAPHICS_TYPE_2D")}</Option>
                <Option value="_3D">{t("GRAPHICS_TYPE_3D")}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("SCREENING_TIME_TYPE")}
              name="screeningTimeType"
              tooltip={t("SCREENING_TIME_TYPE_TOOLTIP")}
            >
              <Select placeholder={t("SELECT_SCREENING_TIME_TYPE")} allowClear>
                <Option value="SUAT_CHIEU_SOM">
                  {t("SCREENING_TIME_EARLY")}
                </Option>
                <Option value="SUAT_CHIEU_THEO_LICH">
                  {t("SCREENING_TIME_REGULAR")}
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("DAY_TYPE")}
              name="dayType"
              tooltip={t("DAY_TYPE_TOOLTIP")}
            >
              <Select placeholder={t("SELECT_DATE")} allowClear>
                <Option value="WEEKDAY">{t("DAY_TYPE_WEEKDAY")}</Option>
                <Option value="WEEKEND">{t("DAY_TYPE_WEEKEND")}</Option>
                <Option value="HOLIDAY">{t("DAY_TYPE_HOLIDAY")}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={t("AUDITORIUM_TYPE")}
              name="auditoriumType"
              tooltip={t("AUDITORIUM_TYPE_TOOLTIP")}
            >
              <Select placeholder={t("SELECT_AUDITORIUM_TYPE")} allowClear>
                <Option value="STANDARD">
                  {t("AUDITORIUM_TYPE_STANDARD")}
                </Option>
                <Option value="IMAX">{t("AUDITORIUM_TYPE_IMAX")}</Option>
                <Option value="GOLDCLASS">
                  {t("AUDITORIUM_TYPE_GOLDCLASS")}
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Modal
      title={isEditing ? t("EDIT_PRICE_ITEM") : t("CREATE_PRICE_ITEM")}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          targetType: "TICKET",
          priority: 1,
          status: true,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("TARGET_TYPE")}
              name="targetType"
              rules={[
                {
                  required: true,
                  message: t("TARGET_TYPE_REQUIRED"),
                },
              ]}
            >
              <Select
                placeholder={t("SELECT_TARGET_TYPE")}
                onChange={(value) => {
                  form.setFieldsValue({ targetId: undefined });

                  // Clear targetId validation error when switching to TICKET
                  if (value === "TICKET") {
                    form.setFields([
                      {
                        name: "targetId",
                        errors: [],
                      },
                    ]);
                  }
                }}
              >
                {targetTypeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item dependencies={["targetType"]} noStyle>
              {() => (
                <Form.Item
                  label={t("TARGET")}
                  name="targetId"
                  dependencies={["targetType"]}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    ({ getFieldValue }) => {
                      const targetType = getFieldValue("targetType");

                      // Only require targetId for PRODUCT and ADDITIONAL_SERVICE
                      if (
                        targetType === "PRODUCT" ||
                        targetType === "ADDITIONAL_SERVICE"
                      ) {
                        return {
                          required: true,
                          message: t("TARGET_REQUIRED"),
                        };
                      }
                      return { required: false };
                    },
                  ]}
                >
                  {(() => {
                    const targetType = form.getFieldValue("targetType");

                    if (targetType === "PRODUCT") {
                      return (
                        <Select
                          placeholder={
                            isLoadingProducts
                              ? t("LOADING")
                              : products.length === 0
                                ? t("NO_PRODUCTS_AVAILABLE")
                                : t("SELECT_PRODUCT")
                          }
                          showSearch
                          optionFilterProp="children"
                          disabled={products.length === 0 || isLoadingProducts}
                          loading={isLoadingProducts}
                          notFoundContent={
                            isLoadingProducts
                              ? t("LOADING")
                              : t("NO_PRODUCTS_AVAILABLE")
                          }
                          onChange={() => {
                            setTimeout(
                              () => form.validateFields(["targetId"]),
                              100,
                            );
                          }}
                        >
                          {products.map((product) => (
                            <Option key={product.id} value={Number(product.id)}>
                              {product.name}
                            </Option>
                          ))}
                        </Select>
                      );
                    }

                    if (targetType === "ADDITIONAL_SERVICE") {
                      return (
                        <Select
                          placeholder={
                            isLoadingServices
                              ? t("LOADING")
                              : additionalServices.length === 0
                                ? t("NO_ADDITIONAL_SERVICES_AVAILABLE")
                                : t("SELECT_ADDITIONAL_SERVICE")
                          }
                          showSearch
                          optionFilterProp="children"
                          disabled={
                            additionalServices.length === 0 || isLoadingServices
                          }
                          loading={isLoadingServices}
                          notFoundContent={
                            isLoadingServices
                              ? t("LOADING")
                              : t("NO_ADDITIONAL_SERVICES_AVAILABLE")
                          }
                          onChange={() => {
                            setTimeout(
                              () => form.validateFields(["targetId"]),
                              100,
                            );
                          }}
                        >
                          {additionalServices.map((service) => (
                            <Option key={service.id} value={Number(service.id)}>
                              {service.name}
                            </Option>
                          ))}
                        </Select>
                      );
                    }

                    return null;
                  })()}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("PRICE")}
              name="price"
              rules={[
                {
                  required: true,
                  message: t("PRICE_REQUIRED"),
                },
                {
                  type: "number",
                  min: 0,
                  message: t("PRICE_MIN"),
                },
              ]}
            >
              <InputNumber
                placeholder={t("ENTER_PRICE")}
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("PRIORITY")}
              name="priority"
              rules={[
                {
                  required: true,
                  message: t("PRIORITY_REQUIRED"),
                },
                {
                  type: "number",
                  min: 1,
                  max: 999,
                  message: t("PRIORITY_RANGE"),
                },
              ]}
              tooltip={t("PRIORITY_TOOLTIP")}
            >
              <InputNumber
                placeholder={t("ENTER_PRIORITY")}
                style={{ width: "100%" }}
                min={1}
                max={999}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={t("STATUS")}
              name="status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t("ACTIVE")}
                unCheckedChildren={t("INACTIVE")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item dependencies={["targetType"]}>
          {({ getFieldValue }) => {
            return getFieldValue("targetType") === "TICKET"
              ? renderTicketConditions()
              : null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PriceItemModal;
