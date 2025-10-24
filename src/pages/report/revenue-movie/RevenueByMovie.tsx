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
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  useLazyExportRevenueByMovieQuery,
  useLazyGetRevenueByMovieQuery,
  useLazyExportRevenueByMovieIdQuery,
  useLazyGetRevenueByMovieIdQuery,
} from "@app/services/dashboard.service";
import { useGetMoviesQuery } from "@app/services/movies.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import RevenueByMovieTable from "./RevenueByMovieTable";
import MovieCinemaRevenueTable from "./MovieCinemaRevenueTable";
import RevenueChart from "./RevenueChart";
import TicketChart from "./TicketChart";
import type { Dayjs } from "dayjs";
import type { Movie } from "@/types/movie.types";

const breadcrumb = [
  { label: "Doanh thu theo phim", href: "/admin/revenue/movie" },
];

interface FormValues {
  mode?: string;
  movieId?: number;
  time?: [Dayjs, Dayjs];
}

const RevenueByMovie = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [mode, setMode] = useState<string>("all");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [selectedMovieId, setSelectedMovieId] = useState<number | undefined>(
    undefined
  );

  const [getRevenueByMovie, { data: allMoviesData, isLoading, isFetching }] =
    useLazyGetRevenueByMovieQuery();
  const [
    getRevenueByMovieId,
    {
      data: specificMovieData,
      isLoading: isLoadingSpecific,
      isFetching: isFetchingSpecific,
    },
  ] = useLazyGetRevenueByMovieIdQuery();
  const [exportRevenueByMovie] = useLazyExportRevenueByMovieQuery();
  const [exportRevenueByMovieId] = useLazyExportRevenueByMovieIdQuery();
  const { data: moviesData } = useGetMoviesQuery(undefined);

  useEffect(() => {
    if (mode === "all") {
      getRevenueByMovie({ startDate, endDate });
    } else if (mode === "specific" && selectedMovieId) {
      getRevenueByMovieId({ id: selectedMovieId, startDate, endDate });
    }
  }, [
    mode,
    startDate,
    endDate,
    selectedMovieId,
    getRevenueByMovie,
    getRevenueByMovieId,
  ]);

  if (isLoading || isFetching || isLoadingSpecific || isFetchingSpecific) {
    return <Spin size="large" fullscreen />;
  }

  const handleExportExcel = () => {
    if (mode === "all") {
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
    } else if (selectedMovieId) {
      exportRevenueByMovieId({ id: selectedMovieId, startDate, endDate })
        .unwrap()
        .then((response) => {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const filename = `Revenue_Report_Movie_${selectedMovieId}_${currentDate}.xlsx`;

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
      getRevenueByMovie({ startDate: start, endDate: end });
    } else if (values.movieId) {
      setSelectedMovieId(values.movieId);
      getRevenueByMovieId({
        id: values.movieId,
        startDate: start,
        endDate: end,
      });
    }
  };

  const handleModeChange = (value: string) => {
    setMode(value);
    form.setFieldsValue({ movieId: undefined });
    setSelectedMovieId(undefined);
  };

  const handleMovieChange = (movieId: number) => {
    setSelectedMovieId(movieId);
    // Auto load data when movie is selected
    getRevenueByMovieId({ id: movieId, startDate, endDate });
  };

  const movieOptions =
    moviesData?.map((movie: Movie) => ({
      label: movie.name,
      value: movie.id,
    })) || [];

  const displayData = mode === "all" ? allMoviesData : specificMovieData;

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
        <Space style={{ marginBottom: "1rem" }} wrap>
          <Form
            form={form}
            layout="inline"
            onFinish={onFinish}
            initialValues={{ mode: "all" }}
          >
            <Form.Item name="mode" label="Xem theo">
              <Select style={{ width: 180 }} onChange={handleModeChange}>
                <Select.Option value="all">Tất cả phim</Select.Option>
                <Select.Option value="specific">Phim cụ thể</Select.Option>
              </Select>
            </Form.Item>

            {mode === "specific" && (
              <Form.Item
                name="movieId"
                label="Chọn phim"
                rules={[{ required: true, message: "Vui lòng chọn phim" }]}
              >
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Chọn phim"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={movieOptions}
                  onChange={handleMovieChange}
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
            disabled={mode === "specific" && !selectedMovieId}
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
          <RevenueByMovieTable data={allMoviesData} />
        ) : (
          <MovieCinemaRevenueTable data={specificMovieData} />
        )}
      </div>
    </>
  );
};

export default RevenueByMovie;
