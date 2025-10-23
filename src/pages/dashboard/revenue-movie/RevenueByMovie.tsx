import { FileExcelOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  message,
  Row,
  Space,
  Spin,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  useLazyExportRevenueByMovieQuery,
  useLazyGetRevenueByMovieQuery,
} from "@app/services/dashboard.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import RevenueByMovieTable from "./RevenueByMovieTable";
import RevenueChart from "./RevenueChart";
import TicketChart from "./TicketChart";
import type { Dayjs } from "dayjs";

const breadcrumb = [
  { label: "Doanh thu theo phim", href: "/admin/revenue/movie" },
];

interface FormValues {
  time?: [Dayjs, Dayjs];
}

const RevenueByMovie = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [getRevenueByMovie, { data, isLoading, isFetching }] =
    useLazyGetRevenueByMovieQuery();
  const [exportRevenueByMovie] = useLazyExportRevenueByMovieQuery();

  useEffect(() => {
    getRevenueByMovie({ startDate, endDate });
  }, [startDate, endDate, getRevenueByMovie]);

  if (isLoading || isFetching) {
    return <Spin size="large" fullscreen />;
  }

  const handleExportExcel = () => {
    exportRevenueByMovie({ startDate, endDate })
      .unwrap()
      .then((response) => {
        const currentDate = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const filename = `Revenue_Report_Movie_${currentDate}.xlsx`;

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
        message.error("Xuất báo cáo thất bại");
      });
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

    getRevenueByMovie({ startDate: start, endDate: end });
  };

  return (
    <>
      <Helmet>
        <title>Doanh thu theo phim</title>
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
          <Form form={form} layout="inline" onFinish={onFinish}>
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
                Load dữ liệu
              </Button>
            </Form.Item>
          </Form>

          <Button
            style={{ backgroundColor: "#52c41a" }}
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
          >
            Xuất báo cáo
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <TicketChart data={data} />
          </Col>
          <Col span={12}>
            <RevenueChart data={data} />
          </Col>
        </Row>

        <RevenueByMovieTable data={data} />
      </div>
    </>
  );
};

export default RevenueByMovie;
