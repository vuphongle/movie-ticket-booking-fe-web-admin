import { Col, Row } from "antd";
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
  const now = new Date();
  const MMYYYY = `T${now.getMonth() + 1}/${now.getFullYear()}`;
  const DDMMYYYY = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <SummaryBox
          title={
            <>
              Doanh thu trong ngày
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
              Khách hàng mới <br />({MMYYYY})
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
              Tổng vé bán ra <br />({MMYYYY})
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
              Tổng doanh thu <br />({MMYYYY})
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
