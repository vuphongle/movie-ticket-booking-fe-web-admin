import {
  PlusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Select,
  Space,
  Spin,
  InputNumber,
  Switch,
  message,
  theme,
  Divider,
  Row,
  Col,
  Modal,
  Card,
  Typography,
  Tabs,
} from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  useCreatePriceItemMutation,
  useGetPriceItemsQuery,
} from "@/app/services/priceItem.service";
import { useGetActivePriceListsQuery } from "@/app/services/priceList.service";
import { useGetActiveProductsQuery } from "@/app/services/products.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import type { CreatePriceItemRequest } from "@/types";
import PriceItemTable from "./PriceItemTable";
import PriceItemTimeline from "./components/PriceItemTimeline";
import PriceSimulator from "./components/PriceSimulator";

const PriceItemPage = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumb = [
    {
      label: t("PRICE_MANAGEMENT"),
      href: "/admin/price-management",
    },
    {
      label: t("PRICE_ITEM_MANAGEMENT"),
      href: "/admin/price-management/price-items",
    },
  ];

  const {
    data,
    isLoading: isFetchingPriceItems,
    refetch,
  } = useGetPriceItemsQuery();
  const { data: activePriceLists } = useGetActivePriceListsQuery();
  const { data: activeProducts } = useGetActiveProductsQuery();
  const { data: additionalServices } = useGetAdditionalServicesQuery();
  const [createPriceItem, { isLoading: isLoadingCreate }] =
    useCreatePriceItemMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState<
    string | undefined
  >(undefined);
  const [currentFormValues, setCurrentFormValues] = useState<any>({});
  const [activeTab, setActiveTab] = useState("items");

  // Ticket pricing templates
  const ticketTemplates = [
    {
      name: t("TEMPLATE_2D_WEEKDAY_NORMAL"),
      data: {
        targetType: "TICKET",
        seatType: "NORMAL",
        graphicsType: "_2D",
        dayType: "WEEKDAY",
        auditoriumType: "STANDARD",
        priority: 10,
      },
    },
    {
      name: t("TEMPLATE_3D_WEEKEND_VIP"),
      data: {
        targetType: "TICKET",
        seatType: "VIP",
        graphicsType: "_3D",
        dayType: "WEEKEND",
        auditoriumType: "STANDARD",
        priority: 20,
      },
    },
    {
      name: t("TEMPLATE_IMAX_WEEKEND_COUPLE"),
      data: {
        targetType: "TICKET",
        seatType: "COUPLE",
        graphicsType: "_3D",
        dayType: "WEEKEND",
        auditoriumType: "IMAX",
        priority: 30,
      },
    },
    {
      name: t("TEMPLATE_GOLDCLASS_ANY"),
      data: {
        targetType: "TICKET",
        auditoriumType: "GOLDCLASS",
        priority: 40,
      },
    },
    {
      name: t("TEMPLATE_ALL_SEATS_ANY_DAY"),
      data: {
        targetType: "TICKET",
        priority: 5, // Lowest priority as it's a wildcard
      },
    },
  ];

  const applyTemplate = (templateData: any) => {
    form.setFieldsValue(templateData);
    setSelectedTargetType(templateData.targetType);
    setCurrentFormValues(templateData);
  };

  // Calculate preview specificity for TICKET type
  const getPreviewSpecificity = () => {
    if (selectedTargetType !== "TICKET") return 0;

    let count = 0;
    if (currentFormValues.seatType) count++;
    if (currentFormValues.graphicsType) count++;
    if (currentFormValues.screeningTimeType) count++;
    if (currentFormValues.dayType) count++;
    if (currentFormValues.auditoriumType) count++;
    return count;
  };

  const handleFormChange = () => {
    setCurrentFormValues(form.getFieldsValue());
  };

  if (isFetchingPriceItems) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center min-h-screen"
      />
    );
  }

  const handleCreate = (values: any) => {
    const payload: CreatePriceItemRequest = {
      priceListId: values.priceListId,
      targetType: values.targetType,
      targetId: values.targetId,
      price: values.price,
      priority: values.priority,
      status: values.status ?? true,
    };

    // Handle ticket-specific fields
    if (values.targetType === "TICKET") {
      payload.seatType = values.seatType;
      payload.graphicsType = values.graphicsType;
      payload.screeningTimeType = values.screeningTimeType;
      payload.dayType = values.dayType;
      payload.auditoriumType = values.auditoriumType;
    }

    if (values.minQty) {
      payload.minQty = values.minQty;
    }

    createPriceItem(payload)
      .unwrap()
      .then(() => {
        form.resetFields();
        setSelectedTargetType(undefined);
        setCurrentFormValues({});
        setOpen(false);
        message.success(t("CREATE_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data?.message || t("CREATE_ERROR"));
      });
  };

  const handleRefresh = () => {
    refetch();
    message.success(t("REFRESH_SUCCESS"));
  };

  return (
    <>
      <Helmet>
        <title>{t("PRICE_ITEM_MANAGEMENT_TITLE")}</title>
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
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            {t("CREATE_PRICE_ITEM_BUTTON")}
          </Button>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            {t("REFRESH_BUTTON")}
          </Button>
        </Space>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "items",
              label: t("PRICE_ITEMS"),
              children: (
                <PriceItemTable
                  data={data || []}
                  loading={isFetchingPriceItems}
                />
              ),
            },
            {
              key: "schedule",
              label: t("SCHEDULE_TIMELINE"),
              children: <PriceItemTimeline data={data || []} />,
            },
            {
              key: "simulate",
              label: t("SIMULATE_PRICING"),
              children: <PriceSimulator data={data || []} />,
            },
          ]}
        />
      </div>

      <Modal
        open={open}
        title={t("CREATE_PRICE_ITEM")}
        onCancel={() => {
          form.resetFields();
          setSelectedTargetType(undefined);
          setCurrentFormValues({});
          setOpen(false);
        }}
        width={800}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setSelectedTargetType(undefined);
              setCurrentFormValues({});
              setOpen(false);
            }}
          >
            {t("CANCEL_BUTTON")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={isLoadingCreate}
          >
            {t("SAVE_BUTTON")}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          onValuesChange={handleFormChange}
          autoComplete="off"
        >
          {/* Quick Templates for TICKET */}
          {selectedTargetType === "TICKET" && (
            <Card
              size="small"
              style={{ marginBottom: 16, backgroundColor: "#f0f8ff" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Text strong>
                  <ThunderboltOutlined /> {t("QUICK_TEMPLATES")}
                </Typography.Text>
                <Space wrap>
                  {ticketTemplates.map((template, index) => (
                    <Button
                      key={index}
                      size="small"
                      onClick={() => applyTemplate(template.data)}
                      style={{ fontSize: "11px" }}
                    >
                      {template.name}
                    </Button>
                  ))}
                </Space>
              </Space>
            </Card>
          )}
          <Form.Item
            label={t("PRICE_LIST_NAME")}
            name="priceListId"
            rules={[{ required: true, message: t("PRICE_LIST_NAME_REQUIRED") }]}
          >
            <Select
              placeholder={t("SELECT_TARGET_TYPE")}
              options={
                activePriceLists?.map((list) => ({
                  label: list.name,
                  value: list.id,
                })) || []
              }
            />
          </Form.Item>

          <Form.Item
            label={t("TARGET_TYPE")}
            name="targetType"
            rules={[{ required: true, message: t("TARGET_TYPE_REQUIRED") }]}
          >
            <Select
              placeholder={t("SELECT_TARGET_TYPE")}
              onChange={(value) => {
                setSelectedTargetType(value);
                // Reset targetId when changing target type
                form.setFieldValue("targetId", undefined);
              }}
              options={[
                { label: t("TARGET_TYPE_TICKET"), value: "TICKET" },
                { label: t("TARGET_TYPE_PRODUCT"), value: "PRODUCT" },
                {
                  label: t("TARGET_TYPE_ADDITIONAL_SERVICE"),
                  value: "ADDITIONAL_SERVICE",
                },
              ]}
            />
          </Form.Item>

          {/* Target ID field - only show for PRODUCT and ADDITIONAL_SERVICE */}
          {(selectedTargetType === "PRODUCT" ||
            selectedTargetType === "ADDITIONAL_SERVICE") && (
            <Form.Item
              label={
                selectedTargetType === "PRODUCT"
                  ? t("PRODUCT")
                  : t("ADDITIONAL_SERVICE")
              }
              name="targetId"
              rules={[{ required: true, message: t("TARGET_ID_REQUIRED") }]}
            >
              <Select
                placeholder={
                  selectedTargetType === "PRODUCT"
                    ? t("SELECT_PRODUCT")
                    : t("SELECT_ADDITIONAL_SERVICE")
                }
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  selectedTargetType === "PRODUCT"
                    ? activeProducts?.map((product) => ({
                        label: product.name,
                        value: product.id,
                      })) || []
                    : additionalServices?.map((service) => ({
                        label: service.name,
                        value: service.id,
                      })) || []
                }
              />
            </Form.Item>
          )}

          {/* Ticket Dimensions - only show for TICKET */}
          {selectedTargetType === "TICKET" && (
            <>
              <Divider>{t("TICKET_DIMENSIONS")}</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t("SEAT_TYPE")} name="seatType">
                    <Select
                      placeholder={t("SELECT_SEAT_TYPE")}
                      allowClear
                      options={[
                        { label: t("SEAT_TYPE_NORMAL"), value: "NORMAL" },
                        { label: t("SEAT_TYPE_VIP"), value: "VIP" },
                        { label: t("SEAT_TYPE_COUPLE"), value: "COUPLE" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t("GRAPHICS_TYPE")} name="graphicsType">
                    <Select
                      placeholder={t("SELECT_GRAPHICS_TYPE")}
                      allowClear
                      options={[
                        { label: t("GRAPHICS_TYPE_2D"), value: "_2D" },
                        { label: t("GRAPHICS_TYPE_3D"), value: "_3D" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={t("SCREENING_TIME_TYPE")}
                    name="screeningTimeType"
                  >
                    <Select
                      placeholder={t("SELECT_SCREENING_TIME_TYPE")}
                      allowClear
                      options={[
                        {
                          label: t("SCREENING_TIME_EARLY"),
                          value: "SUAT_CHIEU_SOM",
                        },
                        {
                          label: t("SCREENING_TIME_REGULAR"),
                          value: "SUAT_CHIEU_THEO_LICH",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t("DAY_TYPE")} name="dayType">
                    <Select
                      placeholder={t("SELECT_DAY_TYPE")}
                      allowClear
                      options={[
                        { label: t("DAY_TYPE_WEEKDAY"), value: "WEEKDAY" },
                        { label: t("DAY_TYPE_WEEKEND"), value: "WEEKEND" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label={t("AUDITORIUM_TYPE")} name="auditoriumType">
                <Select
                  placeholder={t("SELECT_AUDITORIUM_TYPE")}
                  allowClear
                  options={[
                    { label: t("AUDITORIUM_TYPE_STANDARD"), value: "STANDARD" },
                    { label: t("AUDITORIUM_TYPE_IMAX"), value: "IMAX" },
                    {
                      label: t("AUDITORIUM_TYPE_GOLDCLASS"),
                      value: "GOLDCLASS",
                    },
                  ]}
                />
              </Form.Item>
            </>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("PRICE")}
                name="price"
                rules={[
                  { required: true, message: t("PRICE_REQUIRED") },
                  {
                    type: "number",
                    min: 1,
                    message: t("PRICE_MUST_GREATER_THAN_ZERO"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("ENTER_PRICE")}
                  style={{ width: "100%" }}
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    Number(value!.replace(/\$\s?|(,*)/g, "")) as any
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("MIN_QUANTITY")}
                name="minQty"
                tooltip={t("MIN_QUANTITY_TOOLTIP")}
              >
                <InputNumber
                  placeholder={t("ENTER_MIN_QUANTITY")}
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("PRIORITY")}
                name="priority"
                rules={[{ required: true, message: t("PRIORITY_REQUIRED") }]}
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
            <Col span={12}>
              <Form.Item
                label={t("STATUS")}
                name="status"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* Preview Specificity for TICKET */}
          {selectedTargetType === "TICKET" && (
            <Card
              size="small"
              style={{ marginTop: 16, backgroundColor: "#f6f6f6" }}
            >
              <Typography.Text type="secondary">
                {t("PREVIEW_SPECIFICITY")}:
                <Typography.Text strong style={{ marginLeft: 8 }}>
                  {getPreviewSpecificity()}/5
                </Typography.Text>
                <Typography.Text style={{ marginLeft: 8, fontSize: "12px" }}>
                  ({t("HIGHER_MORE_SPECIFIC")})
                </Typography.Text>
              </Typography.Text>
            </Card>
          )}

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            {/* Note: Footer buttons handle submission */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PriceItemPage;
