import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  message,
  Space,
  theme,
  Typography,
} from "antd";
import { DownloadOutlined, HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import CouponStatisticsCards from "./CouponStatisticsCards";
import CouponPerformanceTable from "./CouponPerformanceTable";
import {
  useGetCouponStatisticsQuery,
  useGetCouponPerformanceQuery,
  useExportCouponPerformanceMutation,
} from "@/app/services/couponStatistics.service";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const CouponStatistics = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Date range state (default: last 30 days)
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);

  // Format dates for API
  const startDate = dateRange[0].format("YYYY-MM-DD");
  const endDate = dateRange[1].format("YYYY-MM-DD");

  // Fetch data
  const { data: statistics, isLoading: isLoadingStats } =
    useGetCouponStatisticsQuery({
      startDate,
      endDate,
    });

  const { data: performance = [], isLoading: isLoadingPerf } =
    useGetCouponPerformanceQuery({
      startDate,
      endDate,
    });

  // Export mutation
  const [exportReport, { isLoading: isExporting }] =
    useExportCouponPerformanceMutation();

  const handleDateChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportReport({
        startDate,
        endDate,
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Thong_ke_khuyen_mai_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Xuất báo cáo thành công!");
    } catch (error: any) {
      console.error("Export error:", error);
      message.error(error?.data?.message || "Xuất báo cáo thất bại!");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: "calc(100vh - 112px)",
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <Link to="/">
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: "Báo cáo",
          },
          {
            title: "Thống kê khuyến mại",
          },
        ]}
      />

      {/* Header */}
      <div
        style={{
          background: colorBgContainer,
          padding: 24,
          borderRadius: borderRadiusLG,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Thống kê hiệu suất khuyến mại
          </Title>

          <Space wrap>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ width: 280 }}
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={isExporting}
            >
              Xuất báo cáo
            </Button>
          </Space>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ marginBottom: 16 }}>
        <CouponStatisticsCards
          statistics={statistics}
          loading={isLoadingStats}
        />
      </div>

      {/* Performance Table */}
      <Card
        title="Chi tiết hiệu suất khuyến mại"
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <CouponPerformanceTable data={performance} loading={isLoadingPerf} />
      </Card>
    </div>
  );
};

export default CouponStatistics;
