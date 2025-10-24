import { FileExcelOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  message,
  Row,
  Select,
  Space,
  Spin,
  theme,
} from "antd";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  useLazyExportRevenueByCustomerQuery,
  useLazyGetRevenueByCustomerQuery,
  useLazyExportRevenueByCustomerIdQuery,
  useLazyGetRevenueByCustomerIdQuery,
} from "@app/services/dashboard.service";
import { useGetUsersQuery } from "@app/services/users.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import RevenueByCustomerTable from "./RevenueByCustomerTable";
import CustomerMovieRevenueTable from "./CustomerMovieRevenueTable";
import RevenueChart from "./RevenueChart";
import TicketChart from "./TicketChart";

interface FormValues {
  mode?: string;
  customerId?: number;
  time?: [Dayjs, Dayjs];
}

const RevenueByCustomer = () => {
  const { t } = useTranslation();
  const breadcrumb = [
    { label: t("REPORT_REVENUE_BY_CUSTOMER"), href: "/admin/revenue/customer" },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm<FormValues>();
  const [mode, setMode] = useState<string>("all");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    number | undefined
  >(undefined);

  const [
    getRevenueByCustomer,
    { data: allCustomersData, isLoading, isFetching },
  ] = useLazyGetRevenueByCustomerQuery();
  const [
    getRevenueByCustomerId,
    {
      data: specificCustomerData,
      isLoading: isLoadingSpecific,
      isFetching: isFetchingSpecific,
    },
  ] = useLazyGetRevenueByCustomerIdQuery();
  const [exportRevenueByCustomer] = useLazyExportRevenueByCustomerQuery();
  const [exportRevenueByCustomerId] = useLazyExportRevenueByCustomerIdQuery();
  const { data: usersData } = useGetUsersQuery();

  useEffect(() => {
    if (mode === "all") {
      getRevenueByCustomer({ startDate, endDate });
    } else if (mode === "specific" && selectedCustomerId) {
      getRevenueByCustomerId({ id: selectedCustomerId, startDate, endDate });
    }
  }, [
    mode,
    startDate,
    endDate,
    selectedCustomerId,
    getRevenueByCustomer,
    getRevenueByCustomerId,
  ]);

  if (isLoading || isFetching || isLoadingSpecific || isFetchingSpecific) {
    return <Spin size="large" fullscreen />;
  }

  const handleExportExcel = () => {
    if (mode === "all") {
      exportRevenueByCustomer({ startDate, endDate })
        .unwrap()
        .then((response) => {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const filename = `Revenue_Report_Customer_${currentDate}.xlsx`;

          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => {
          message.error(t("REPORT_EXPORT_FAILED"));
        });
    } else if (selectedCustomerId) {
      exportRevenueByCustomerId({ id: selectedCustomerId, startDate, endDate })
        .unwrap()
        .then((response) => {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const filename = `Revenue_Report_Customer_${selectedCustomerId}_${currentDate}.xlsx`;

          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => {
          message.error(t("REPORT_EXPORT_FAILED"));
        });
    }
  };

  const onFinish = (values: FormValues) => {
    const start = values.time?.[0]
      ? values.time[0].format("DD-MM-YYYY")
      : undefined;
    const end = values.time?.[1]
      ? values.time[1].format("DD-MM-YYYY")
      : undefined;
    setStartDate(start);
    setEndDate(end);

    if (mode === "all") {
      getRevenueByCustomer({ startDate: start, endDate: end });
    } else if (values.customerId) {
      setSelectedCustomerId(values.customerId);
      getRevenueByCustomerId({
        id: values.customerId,
        startDate: start,
        endDate: end,
      });
    }
  };

  const handleModeChange = (value: string) => {
    setMode(value);
    form.setFieldsValue({ customerId: undefined });
    setSelectedCustomerId(undefined);
  };

  const handleCustomerChange = (customerId: number) => {
    setSelectedCustomerId(customerId);
    // Auto load data when customer is selected
    getRevenueByCustomerId({ id: customerId, startDate, endDate });
  };

  const customerOptions =
    usersData?.map((user: any) => ({
      label: `${user.name} (${user.email})`,
      value: user.id,
    })) || [];

  const displayData = mode === "all" ? allCustomersData : specificCustomerData;

  return (
    <>
      <Helmet>
        <title>{t("REPORT_REVENUE_BY_CUSTOMER")}</title>
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
        <Space style={{ marginBottom: "1rem" }} wrap>
          <Form
            form={form}
            layout="inline"
            onFinish={onFinish}
            initialValues={{ mode: "all" }}
          >
            <Form.Item name="mode" label={t("REPORT_VIEW_BY")}>
              <Select style={{ width: 200 }} onChange={handleModeChange}>
                <Select.Option value="all">
                  {t("REPORT_ALL_CUSTOMERS")}
                </Select.Option>
                <Select.Option value="specific">
                  {t("REPORT_SPECIFIC_CUSTOMER")}
                </Select.Option>
              </Select>
            </Form.Item>

            {mode === "specific" && (
              <Form.Item
                name="customerId"
                label={t("REPORT_SELECT_CUSTOMER")}
                rules={[
                  {
                    required: true,
                    message: t("REPORT_PLEASE_SELECT_CUSTOMER"),
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: 350 }}
                  placeholder={t("REPORT_SELECT_CUSTOMER")}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={customerOptions}
                  onChange={handleCustomerChange}
                />
              </Form.Item>
            )}

            <Form.Item name="time">
              <DatePicker.RangePicker />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                style={{ backgroundColor: "rgb(0, 192, 239)" }}
                type="primary"
                icon={<ReloadOutlined />}
              >
                {t("REPORT_LOAD_DATA")}
              </Button>
            </Form.Item>
          </Form>

          <Button
            style={{ backgroundColor: "#52c41a" }}
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            disabled={mode === "specific" && !selectedCustomerId}
          >
            {t("REPORT_EXPORT_REPORT")}
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <TicketChart data={displayData} />
          </Col>
          <Col span={12}>
            <RevenueChart data={displayData} />
          </Col>
        </Row>

        {mode === "all" ? (
          <RevenueByCustomerTable data={allCustomersData} />
        ) : (
          <CustomerMovieRevenueTable data={specificCustomerData} />
        )}
      </div>
    </>
  );
};

export default RevenueByCustomer;
