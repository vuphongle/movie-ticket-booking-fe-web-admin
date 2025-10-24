import { Col, Divider, Flex, Row, Typography } from "antd";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <Row gutter={[24, 16]}>
      <Divider />
      <Col span={12}>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 10 }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {t("OVERVIEW_REVENUE_BY_MOVIE")}
          </Typography.Title>
          <RouterLink to="/admin/revenue/movie">
            {t("OVERVIEW_VIEW_ALL")}
          </RouterLink>
        </Flex>
        <TableMovieRevenue data={movieRevenues || []} />
      </Col>
      <Col span={12}>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 10 }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {t("OVERVIEW_REVENUE_BY_CINEMA")}
          </Typography.Title>
          <RouterLink to="/admin/revenue/cinema">
            {t("OVERVIEW_VIEW_ALL")}
          </RouterLink>
        </Flex>
        <TableCinemaRevenue data={cinemaRevenues || []} />
      </Col>
    </Row>
  );
}

export default DashboardTable;
