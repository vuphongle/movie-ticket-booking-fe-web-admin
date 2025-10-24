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
import {
  useLazyExportRevenueByCinemaQuery,
  useLazyGetRevenueByCinemaQuery,
  useLazyExportRevenueByCinemaIdQuery,
  useLazyGetRevenueByCinemaIdQuery,
} from "@app/services/dashboard.service";
import { useGetCinemasQuery } from "@app/services/cinemas.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import RevenueByCinemaTable from "./RevenueByCinemaTable";
import CinemaMovieRevenueTable from "./CinemaMovieRevenueTable";
import RevenueChart from "./RevenueChart";
import TicketChart from "./TicketChart";

const breadcrumb = [
  { label: "Doanh thu theo rạp", href: "/admin/revenue/cinema" },
];

interface FormValues {
  mode?: string;
  cinemaId?: number;
  time?: [Dayjs, Dayjs];
}

const RevenueByCinema = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm<FormValues>();
  const [mode, setMode] = useState<string>("all");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | undefined>(
    undefined
  );

  const [getRevenueByCinema, { data: allCinemasData, isLoading, isFetching }] =
    useLazyGetRevenueByCinemaQuery();
  const [
    getRevenueByCinemaId,
    {
      data: specificCinemaData,
      isLoading: isLoadingSpecific,
      isFetching: isFetchingSpecific,
    },
  ] = useLazyGetRevenueByCinemaIdQuery();
  const [exportRevenueByCinema] = useLazyExportRevenueByCinemaQuery();
  const [exportRevenueByCinemaId] = useLazyExportRevenueByCinemaIdQuery();
  const { data: cinemasData } = useGetCinemasQuery({});

  useEffect(() => {
    if (mode === "all") {
      getRevenueByCinema({ startDate, endDate });
    } else if (mode === "specific" && selectedCinemaId) {
      getRevenueByCinemaId({ id: selectedCinemaId, startDate, endDate });
    }
  }, [
    mode,
    startDate,
    endDate,
    selectedCinemaId,
    getRevenueByCinema,
    getRevenueByCinemaId,
  ]);

  if (isLoading || isFetching || isLoadingSpecific || isFetchingSpecific) {
    return <Spin size="large" fullscreen />;
  }

  const handleExportExcel = () => {
    if (mode === "all") {
      exportRevenueByCinema({ startDate, endDate })
        .unwrap()
        .then((response) => {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const filename = `Revenue_Report_Cinema_${currentDate}.xlsx`;

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
    } else if (selectedCinemaId) {
      exportRevenueByCinemaId({ id: selectedCinemaId, startDate, endDate })
        .unwrap()
        .then((response) => {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const filename = `Revenue_Report_Cinema_${selectedCinemaId}_${currentDate}.xlsx`;

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
      getRevenueByCinema({ startDate: start, endDate: end });
    } else if (values.cinemaId) {
      setSelectedCinemaId(values.cinemaId);
      getRevenueByCinemaId({
        id: values.cinemaId,
        startDate: start,
        endDate: end,
      });
    }
  };

  const handleModeChange = (value: string) => {
    setMode(value);
    form.setFieldsValue({ cinemaId: undefined });
    setSelectedCinemaId(undefined);
  };

  const handleCinemaChange = (cinemaId: number) => {
    setSelectedCinemaId(cinemaId);
    // Auto load data when cinema is selected
    getRevenueByCinemaId({ id: cinemaId, startDate, endDate });
  };

  const cinemaOptions =
    cinemasData?.map((cinema: any) => ({
      label: cinema.name,
      value: cinema.id,
    })) || [];

  const displayData = mode === "all" ? allCinemasData : specificCinemaData;

  return (
    <>
      <Helmet>
        <title>Doanh thu theo rạp</title>
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
            <Form.Item name="mode" label="Xem theo">
              <Select style={{ width: 180 }} onChange={handleModeChange}>
                <Select.Option value="all">Tất cả rạp</Select.Option>
                <Select.Option value="specific">Rạp cụ thể</Select.Option>
              </Select>
            </Form.Item>

            {mode === "specific" && (
              <Form.Item
                name="cinemaId"
                label="Chọn rạp"
                rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
              >
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Chọn rạp"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={cinemaOptions}
                  onChange={handleCinemaChange}
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
                Load dữ liệu
              </Button>
            </Form.Item>
          </Form>

          <Button
            style={{ backgroundColor: "#52c41a" }}
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            disabled={mode === "specific" && !selectedCinemaId}
          >
            Xuất báo cáo
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
          <RevenueByCinemaTable data={allCinemasData} />
        ) : (
          <CinemaMovieRevenueTable data={specificCinemaData} />
        )}
      </div>
    </>
  );
};

export default RevenueByCinema;
