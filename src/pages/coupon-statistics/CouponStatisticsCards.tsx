import { Card, Col, Row, Statistic, theme } from "antd";
import {
  ShoppingCartOutlined,
  GiftOutlined,
  UserOutlined,
  DollarOutlined,
  PercentageOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { CouponStatistics } from "@/types";
import { formatCurrency } from "@/utils/functionUtils";

interface CouponStatisticsCardsProps {
  statistics: CouponStatistics | undefined;
  loading: boolean;
}

const CouponStatisticsCards = ({
  statistics,
  loading,
}: CouponStatisticsCardsProps) => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (!statistics) return null;

  return (
    <Row gutter={[16, 16]}>
      {/* Row 1: Coupon Counts */}
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_TOTAL_COUPONS")}
            value={statistics.totalCoupons}
            prefix={<GiftOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_ACTIVE_COUPONS")}
            value={statistics.activeCoupons}
            prefix={<GiftOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_UPCOMING_COUPONS")}
            value={statistics.upcomingCoupons}
            prefix={<GiftOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_EXPIRED_COUPONS")}
            value={statistics.expiredCoupons}
            prefix={<GiftOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>

      {/* Row 2: Usage Statistics */}
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_TOTAL_REDEMPTIONS")}
            value={statistics.totalRedemptions}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_UNIQUE_CUSTOMERS")}
            value={statistics.uniqueCustomers}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_ORDERS_WITH_COUPONS")}
            value={statistics.ordersWithCoupons}
            suffix={`/ ${statistics.ordersWithCoupons + statistics.ordersWithoutCoupons}`}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>
      </Col>

      {/* Row 3: Financial Metrics */}
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_TOTAL_DISCOUNT_AMOUNT")}
            value={statistics.totalDiscountAmount}
            prefix={<DollarOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_REVENUE_BEFORE_DISCOUNT")}
            value={statistics.totalRevenueBeforeDiscount}
            prefix={<DollarOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_REVENUE_AFTER_DISCOUNT")}
            value={statistics.totalRevenueAfterDiscount}
            prefix={<DollarOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>

      {/* Row 4: Rates & Averages */}
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_COUPON_USAGE_RATE")}
            value={statistics.couponUsageRate}
            precision={2}
            suffix="%"
            prefix={<PercentageOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_ORDER_CONVERSION_RATE")}
            value={statistics.orderConversionRate}
            precision={2}
            suffix="%"
            prefix={<RiseOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card loading={loading} style={{ background: colorBgContainer }}>
          <Statistic
            title={t("COUPON_STATISTICS_AVERAGE_DISCOUNT_PER_ORDER")}
            value={statistics.averageDiscountPerOrder}
            prefix={<DollarOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
            precision={0}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CouponStatisticsCards;
