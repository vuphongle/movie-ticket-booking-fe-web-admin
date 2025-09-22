import {
  LeftOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Card,
  message,
  theme,
} from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateAdditionalServiceMutation } from "@/app/services/additionalServices.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import ProductSelect from "@/components/ProductSelect";

const AdditionalServiceCreate = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [createAdditionalService, { isLoading }] =
    useCreateAdditionalServiceMutation();
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState<"SINGLE" | "COMBO">("SINGLE");

  const breadcrumb = [
    { label: t("ADDITIONAL_SERVICE_LIST"), href: "/admin/additional-services" },
    {
      label: t("ADDITIONAL_SERVICE_CREATE"),
      href: "/admin/additional-services/create",
    },
  ];

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        const createData = {
          ...values,
          type: serviceType,
          thumbnail: values.thumbnail || "",
        };

        // Validate dựa trên type
        if (serviceType === "SINGLE") {
          if (!createData.productId || !createData.defaultQuantity) {
            throw new Error(
              "Vui lòng chọn sản phẩm và số lượng cho dịch vụ đơn"
            );
          }
          // Remove items for SINGLE type
          delete createData.items;
        } else if (serviceType === "COMBO") {
          if (!createData.items || createData.items.length === 0) {
            throw new Error("Vui lòng thêm ít nhất một sản phẩm cho combo");
          }

          // Merge duplicate products and validate minimum 2 different products
          const mergedItems: Array<{ productId: string; quantity: number }> =
            [];
          const productMap = new Map<
            string,
            { productId: string; quantity: number }
          >();

          createData.items.forEach((item: any) => {
            if (productMap.has(item.productId)) {
              // Merge quantities for duplicate products
              const existingItem = productMap.get(item.productId);
              if (existingItem) {
                existingItem.quantity += item.quantity;
              }
            } else {
              productMap.set(item.productId, { ...item });
            }
          });

          // Convert map back to array
          productMap.forEach((item) => mergedItems.push(item));

          if (mergedItems.length < 2) {
            throw new Error("Combo phải có ít nhất 2 sản phẩm khác nhau");
          }

          createData.items = mergedItems;

          // Remove single product fields for COMBO type
          delete createData.productId;
          delete createData.defaultQuantity;
        }

        return createAdditionalService(createData).unwrap();
      })
      .then((data) => {
        message.success(t("CREATE_SUCCESS"));
        setTimeout(() => {
          navigate(`/admin/additional-services/${data.id}/detail`);
        }, 1500);
      })
      .catch((error) => {
        message.error(
          error?.data?.message || error?.message || t("CREATE_FAILED")
        );
      });
  };

  const handleTypeChange = (type: "SINGLE" | "COMBO") => {
    setServiceType(type);
    // Reset form khi thay đổi type
    form.resetFields(["productId", "defaultQuantity", "items"]);
  };

  return (
    <>
      <Helmet>
        <title>{t("ADDITIONAL_SERVICE_CREATE")}</title>
      </Helmet>
      <AppBreadCrumb items={breadcrumb} />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Space style={{ marginBottom: "1rem" }}>
          <RouterLink to="/admin/additional-services">
            <Button type="default" icon={<LeftOutlined />}>
              {t("BACK")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={isLoading}
          >
            {t("CREATE_ADDITIONAL_SERVICE")}
          </Button>
        </Space>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ status: false, type: "SINGLE" }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={t("SERVICE_NAME")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("SERVICE_NAME_REQUIRED"),
                  },
                ]}
              >
                <Input placeholder={t("ENTER_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("DESCRIPTION")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("DESCRIPTION_REQUIRED"),
                  },
                ]}
              >
                <Input.TextArea rows={6} placeholder={t("ENTER_DESCRIPTION")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("SERVICE_TYPE")}
                name="type"
                rules={[
                  {
                    required: true,
                    message: t("SERVICE_TYPE_REQUIRED"),
                  },
                ]}
              >
                <Select
                  value={serviceType}
                  onChange={handleTypeChange}
                  options={[
                    { label: t("SINGLE_PRODUCT"), value: "SINGLE" },
                    { label: t("COMBO_PRODUCTS"), value: "COMBO" },
                  ]}
                />
              </Form.Item>

              {serviceType === "SINGLE" && (
                <>
                  <Form.Item
                    label={t("PRODUCT")}
                    name="productId"
                    rules={[
                      {
                        required: true,
                        message: t("PRODUCT_NOT_SELECTED"),
                      },
                    ]}
                  >
                    <ProductSelect placeholder={t("SELECT_PRODUCT")} />
                  </Form.Item>

                  <Form.Item
                    label={t("DEFAULT_QUANTITY")}
                    name="defaultQuantity"
                    rules={[
                      {
                        required: true,
                        message: t("DEFAULT_QUANTITY_REQUIRED"),
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      placeholder={t("ENTER_DEFAULT_QUANTITY")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </>
              )}

              {serviceType === "COMBO" && (
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <label style={{ fontWeight: 500 }}>
                          Sản phẩm trong combo
                        </label>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          size="small"
                        >
                          {t("ADD_PRODUCT")}
                        </Button>
                      </div>
                      {fields.map(({ key, name, ...restField }) => {
                        const currentItems = form.getFieldValue("items") || [];
                        const currentProductId = currentItems[name]?.productId;
                        const duplicateCount = currentItems.filter(
                          (item: any) =>
                            item?.productId === currentProductId &&
                            currentProductId
                        ).length;

                        return (
                          <Card
                            key={key}
                            size="small"
                            style={{ marginTop: 8 }}
                            extra={
                              <Button
                                type="text"
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(name)}
                              />
                            }
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "productId"]}
                              label="Sản phẩm"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn sản phẩm",
                                },
                              ]}
                              extra={
                                duplicateCount > 1 ? (
                                  <div
                                    style={{
                                      color: "#faad14",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {/* ⚠️ Sản phẩm trùng lặp sẽ được gộp số lượng
                                    khi lưu */}
                                    {t("WARNING_DUPLICATE_PRODUCT")}
                                  </div>
                                ) : null
                              }
                            >
                              <ProductSelect
                                placeholder={t("SELECT_PRODUCT")}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "quantity"]}
                              label="Số lượng"
                              rules={[
                                {
                                  required: true,
                                  message: t("DEFAULT_QUANTITY_REQUIRED"),
                                },
                              ]}
                            >
                              <InputNumber
                                min={1}
                                placeholder={t("ENTER_DEFAULT_QUANTITY")}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </Form.List>
              )}

              <Form.Item
                label={t("STATUS")}
                name="status"
                rules={[
                  {
                    required: true,
                    message: t("STATUS_REQUIRED"),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_STATUS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: t("DRAFT"), value: false },
                    { label: t("PUBLIC"), value: true },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AdditionalServiceCreate;
