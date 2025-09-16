import { Col, Flex, Row } from "antd";
import { useTranslation } from "react-i18next";

const SeatLegend = () => {
  const { t } = useTranslation();

  const legends = [
    { label: t("NORMAL_SEAT"), color: "rgb(114, 46, 209)" },
    { label: t("VIP_SEAT"), color: "rgb(245, 34, 45)" },
    { label: t("COUPLE_SEAT"), color: "rgb(236, 47, 150)" },
    { label: t("UNAVAILABLE_SEAT"), color: "#404040" },
  ];

  return (
    <Row
      gutter={[16, 16]}
      justify={"center"}
      style={{ width: "350px", margin: "30px auto 0" }}
    >
      {legends.map((legend, index) => (
        <Col span={12} key={index}>
          <Flex align="center">
            <div
              style={{
                backgroundColor: legend.color,
                height: "30px",
                width: "30px",
                borderRadius: "6px",
                marginRight: "6px",
              }}
            ></div>
            <div style={{ textAlign: "center" }}>{legend.label}</div>
          </Flex>
        </Col>
      ))}
    </Row>
  );
};

export default SeatLegend;
