import { Col, Row } from "antd";
import type { TopViewBlog, RevenueByMonth } from "@/types/dashboard.types";
import RevenueMonthChart from "./RevenueMonthChart";
import TopViewBlogChart from "./TopViewBlogChart";

interface ViewChartProps {
  topViewBlogs?: TopViewBlog[];
  revenueByMonth?: RevenueByMonth[];
}

function ViewChart({ topViewBlogs, revenueByMonth }: ViewChartProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <TopViewBlogChart data={topViewBlogs || []} />
      </Col>
      <Col span={12}>
        <RevenueMonthChart data={revenueByMonth || []} />
      </Col>
    </Row>
  );
}

export default ViewChart;
