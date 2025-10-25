import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/functionUtils";
import SummaryBox from "./SummaryBox";

interface DashboardSummaryProps {
  revenueToday?: number;
  countLatestUsers?: number;
  totalTicketsCurrentMonth?: number;
  revenueCurrentMonth?: number;
}

function DashboardSummary({
  revenueToday,
  countLatestUsers,
  totalTicketsCurrentMonth,
  revenueCurrentMonth,
}: DashboardSummaryProps) {
  const { t } = useTranslation();
  const now = new Date();
  const MMYYYY = `T${now.getMonth() + 1}/${now.getFullYear()}`;
  const DDMMYYYY = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <SummaryBox
          title={
            <>
              {t("OVERVIEW_REVENUE_TODAY")}
              <br />({DDMMYYYY})
            </>
          }
          content={formatCurrency(revenueToday)}
          className="primary"
          link="#"
        />
      </Col>
      <Col span={6}>
        <SummaryBox
          title={
            <>
              {t("OVERVIEW_NEW_CUSTOMERS")} <br />({MMYYYY})
            </>
          }
          content={countLatestUsers?.toString() || "0"}
          className="info"
          link="/admin/users"
        />
      </Col>
      <Col span={6}>
        <SummaryBox
          title={
            <>
              {t("OVERVIEW_TOTAL_TICKETS_SOLD")} <br />({MMYYYY})
            </>
          }
          content={totalTicketsCurrentMonth?.toString() || "0"}
          className="warning"
          link="#"
        />
      </Col>
      <Col span={6}>
        <SummaryBox
          title={
            <>
              {t("OVERVIEW_TOTAL_REVENUE")} <br />({MMYYYY})
            </>
          }
          content={formatCurrency(revenueCurrentMonth)}
          className="danger"
          link="#"
        />
      </Col>
    </Row>
  );
}

export default DashboardSummary;
