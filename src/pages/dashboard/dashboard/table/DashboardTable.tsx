import { Col, Divider, Flex, Row, Typography } from "antd";
import { Link as RouterLink } from "react-router-dom";
import type { MovieRevenue, CinemaRevenue } from "@/types/dashboard.types";
import TableCinemaRevenue from "./TableCinemaRevenue";
import TableMovieRevenue from "./TableMovieRevenue";

interface DashboardTableProps {
  movieRevenues?: MovieRevenue[];
  cinemaRevenues?: CinemaRevenue[];
}

function DashboardTable({
  movieRevenues,
  cinemaRevenues,
}: DashboardTableProps) {
  return (
    <Row gutter={[24, 16]}>
      <Divider />
      <Col span={12}>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 10 }}
        >
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            Doanh thu theo phim
          </Typography.Title>
          <RouterLink to="/admin/revenue/movie">Xem tất cả</RouterLink>
        </Flex>
        <TableMovieRevenue data={movieRevenues || []} />
      </Col>
      <Col span={12}>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 10 }}
        >
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            Doanh thu theo rạp
          </Typography.Title>
          <RouterLink to="/admin/revenue/cinema">Xem tất cả</RouterLink>
        </Flex>
        <TableCinemaRevenue data={cinemaRevenues || []} />
      </Col>
    </Row>
  );
}

export default DashboardTable;
