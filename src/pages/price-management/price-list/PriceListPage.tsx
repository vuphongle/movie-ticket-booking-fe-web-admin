import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  DatePicker,
  InputNumber,
  Switch,
  message,
  theme,
  Card,
  Row,
  Col,
  Select,
} from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  useCreatePriceListMutation,
  useGetPriceListsQuery,
} from "@/app/services/priceList.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import type { CreatePriceListRequest } from "@/types";
import PriceListTable from "./PriceListTable";

const { RangePicker } = DatePicker;

const PriceListPage = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumb = [
    {
      label: t("PRICE_LIST_MANAGEMENT"),
      href: "/admin/price-lists",
    },
  ];

  const {
    data,
    isLoading: isFetchingPriceLists,
    refetch,
  } = useGetPriceListsQuery();
  const [createPriceList, { isLoading: isLoadingCreate }] =
    useCreatePriceListMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    status: undefined as boolean | undefined,
    priority: undefined as number | undefined,
    validityDateRange: undefined as any,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter data based on current filters
  const filteredData =
    data?.filter((item) => {
      // Keyword filter
      if (
        filters.keyword &&
        !item.name.toLowerCase().includes(filters.keyword.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== undefined && item.status !== filters.status) {
        return false;
      }

      // Priority filter (greater than or equal)
      if (filters.priority !== undefined && item.priority < filters.priority) {
        return false;
      }

      // Validity date range filter
      if (filters.validityDateRange && filters.validityDateRange.length === 2) {
        const [fromDate, toDate] = filters.validityDateRange;
        const itemValidFrom = item.validFrom ? new Date(item.validFrom) : null;
        const itemValidTo = item.validTo ? new Date(item.validTo) : null;

        // Check if item's validity period overlaps with filter range
        if (itemValidFrom && itemValidFrom > toDate) return false;
        if (itemValidTo && itemValidTo < fromDate) return false;
      }

      return true;
    }) || [];

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: "",
      status: undefined,
      priority: undefined,
      validityDateRange: undefined,
    });
  };

  if (isFetchingPriceLists) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center min-h-screen"
      />
    );
  }

  const handleCreate = (values: any) => {
    const payload: CreatePriceListRequest = {
      name: values.name,
      priority: values.priority,
      status: values.status ?? true,
    };

    // Handle validity dates
    if (values.validityPeriod && values.validityPeriod.length === 2) {
      // Set start date to 00:00:00
      const validFrom = values.validityPeriod[0].clone();
      validFrom.hour(0).minute(0).second(0).millisecond(0);

      // Set end date to 23:59:59
      const validTo = values.validityPeriod[1].clone();
      validTo.hour(23).minute(59).second(59).millisecond(999);

      payload.validFrom = validFrom.toISOString();
      payload.validTo = validTo.toISOString();
    }

    createPriceList(payload)
      .unwrap()
      .then(() => {
        form.resetFields();
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
        <title>{t("PRICE_LIST_MANAGEMENT_TITLE")}</title>
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
            {t("CREATE_PRICE_LIST_BUTTON")}
          </Button>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            {t("REFRESH_BUTTON")}
          </Button>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {t("FILTERS")} (
            {
              Object.values(filters).filter((v) => v !== undefined && v !== "")
                .length
            }
            )
          </Button>
        </Space>

        {/* Filters Panel */}
        {showFilters && (
          <Card style={{ marginBottom: "1rem" }}>
            <Row gutter={16}>
              <Col span={6}>
                <Input
                  placeholder={t("SEARCH_BY_NAME")}
                  prefix={<SearchOutlined />}
                  value={filters.keyword}
                  onChange={(e) =>
                    handleFilterChange("keyword", e.target.value)
                  }
                  allowClear
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder={t("STATUS")}
                  value={filters.status}
                  onChange={(value) => handleFilterChange("status", value)}
                  allowClear
                  style={{ width: "100%" }}
                  options={[
                    { label: t("ACTIVE"), value: true },
                    { label: t("INACTIVE"), value: false },
                  ]}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  placeholder={t("MIN_PRIORITY")}
                  value={filters.priority}
                  onChange={(value) => handleFilterChange("priority", value)}
                  style={{ width: "100%" }}
                  min={1}
                  max={999}
                />
              </Col>
              <Col span={6}>
                <RangePicker
                  placeholder={[t("VALID_FROM"), t("VALID_TO")]}
                  value={filters.validityDateRange}
                  onChange={(dates) =>
                    handleFilterChange("validityDateRange", dates)
                  }
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Col>
              <Col span={4}>
                <Space>
                  <Button onClick={handleClearFilters}>{t("CLEAR")}</Button>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

        <PriceListTable data={filteredData} loading={isFetchingPriceLists} />
      </div>{" "}
      <Modal
        open={open}
        title={t("CREATE_PRICE_LIST")}
        footer={null}
        onCancel={() => setOpen(false)}
        confirmLoading={isLoadingCreate}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
        >
          <Form.Item
            label={t("PRICE_LIST_NAME")}
            name="name"
            rules={[
              {
                required: true,
                message: t("PRICE_LIST_NAME_REQUIRED"),
              },
              {
                min: 3,
                message: t("PRICE_LIST_NAME_MIN_LENGTH"),
              },
            ]}
          >
            <Input placeholder={t("ENTER_PRICE_LIST_NAME")} />
          </Form.Item>

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

          <Form.Item
            label={t("VALIDITY_PERIOD")}
            name="validityPeriod"
            tooltip={t("VALIDITY_PERIOD_TOOLTIP")}
          >
            <RangePicker
              style={{ width: "100%" }}
              placeholder={[t("VALID_FROM"), t("VALID_TO")]}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label={t("STATUS")}
            name="status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingCreate}
              >
                {t("SAVE_BUTTON")}
              </Button>
              <Button onClick={() => setOpen(false)}>
                {t("CANCEL_BUTTON")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PriceListPage;
