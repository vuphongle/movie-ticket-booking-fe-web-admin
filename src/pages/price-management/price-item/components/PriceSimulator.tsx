import React, { useState } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Space,
  Typography,
  Table,
  Tag,
  Alert,
} from "antd";
import { useTranslation } from "react-i18next";
import { useGetActiveProductsQuery } from "@/app/services/products.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import type { PriceItem } from "@/types";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface PriceSimulatorProps {
  data: PriceItem[];
}

interface SimulationInput {
  targetType: "TICKET" | "PRODUCT" | "ADDITIONAL_SERVICE";
  targetId?: number;
  seatType?: string;
  graphicsType?: string;
  screeningTimeType?: string;
  dayType?: string;
  auditoriumType?: string;
  minQty?: number;
  simulateAt: string; // ISO datetime
}

interface MatchedItem extends PriceItem {
  matchScore: number;
  matchReason: string[];
}

const PriceSimulator: React.FC<PriceSimulatorProps> = ({ data }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [simulationResults, setSimulationResults] = useState<{
    resolvedPrice: number | null;
    matchedItem: MatchedItem | null;
    topCandidates: MatchedItem[];
  } | null>(null);

  const { data: activeProducts } = useGetActiveProductsQuery();
  const { data: additionalServices } = useGetAdditionalServicesQuery();

  // Watch form values
  const targetType = Form.useWatch("targetType", form);

  // Calculate specificity score for TICKET items
  const calculateSpecificity = (item: PriceItem): number => {
    if (item.targetType !== "TICKET") return 0;

    let score = 0;
    if (item.seatType) score++;
    if (item.graphicsType) score++;
    if (item.screeningTimeType) score++;
    if (item.dayType) score++;
    if (item.auditoriumType) score++;
    return score;
  };

  // Check if item matches simulation input
  const matchesInput = (
    item: PriceItem,
    input: SimulationInput
  ): { matches: boolean; score: number; reasons: string[] } => {
    const reasons: string[] = [];
    let score = 0;

    // Check target type
    if (item.targetType !== input.targetType) {
      return { matches: false, score: 0, reasons: ["Target type mismatch"] };
    }

    // Check if item is active and valid at simulation time
    if (!item.status) {
      return { matches: false, score: 0, reasons: ["Item is inactive"] };
    }

    // Type-specific matching
    if (input.targetType === "TICKET") {
      // For TICKET: null values in item act as wildcards (match anything)
      if (input.seatType && item.seatType && item.seatType !== input.seatType) {
        return { matches: false, score: 0, reasons: ["Seat type mismatch"] };
      }
      if (
        input.graphicsType &&
        item.graphicsType &&
        item.graphicsType !== input.graphicsType
      ) {
        return {
          matches: false,
          score: 0,
          reasons: ["Graphics type mismatch"],
        };
      }
      if (
        input.screeningTimeType &&
        item.screeningTimeType &&
        item.screeningTimeType !== input.screeningTimeType
      ) {
        return {
          matches: false,
          score: 0,
          reasons: ["Screening time type mismatch"],
        };
      }
      if (input.dayType && item.dayType && item.dayType !== input.dayType) {
        return { matches: false, score: 0, reasons: ["Day type mismatch"] };
      }
      if (
        input.auditoriumType &&
        item.auditoriumType &&
        item.auditoriumType !== input.auditoriumType
      ) {
        return {
          matches: false,
          score: 0,
          reasons: ["Auditorium type mismatch"],
        };
      }

      // Score based on specificity
      score = calculateSpecificity(item);
      reasons.push(`Specificity: ${score}/5`);
    } else {
      // For PRODUCT/ADDITIONAL_SERVICE: must match targetId exactly
      if (!item.targetId || item.targetId !== input.targetId) {
        return { matches: false, score: 0, reasons: ["Target ID mismatch"] };
      }
      score = 1;
      reasons.push("Target ID matches");
    }

    // Check minimum quantity
    if (item.minQty && input.minQty && input.minQty < item.minQty) {
      return {
        matches: false,
        score: 0,
        reasons: [`Minimum quantity not met (required: ${item.minQty})`],
      };
    }

    return { matches: true, score, reasons };
  };

  const runSimulation = (values: any) => {
    const input: SimulationInput = {
      targetType: values.targetType,
      targetId: values.targetId,
      seatType: values.seatType,
      graphicsType: values.graphicsType,
      screeningTimeType: values.screeningTimeType,
      dayType: values.dayType,
      auditoriumType: values.auditoriumType,
      minQty: values.minQty,
      simulateAt: values.simulateAt
        ? values.simulateAt.toISOString()
        : new Date().toISOString(),
    };

    // Find all matching items
    const candidates: MatchedItem[] = [];

    data.forEach((item) => {
      const match = matchesInput(item, input);
      if (match.matches) {
        candidates.push({
          ...item,
          matchScore: match.score,
          matchReason: match.reasons,
        });
      }
    });

    // Sort by priority (DESC) then by specificity/score (DESC)
    candidates.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return b.matchScore - a.matchScore; // Higher specificity first
    });

    const resolvedPrice = candidates.length > 0 ? candidates[0].price : null;
    const matchedItem = candidates.length > 0 ? candidates[0] : null;
    const topCandidates = candidates.slice(0, 5); // Top 5 for debugging

    setSimulationResults({
      resolvedPrice,
      matchedItem,
      topCandidates,
    });
  };

  const candidatesColumns: ColumnsType<MatchedItem> = [
    {
      title: "Rank",
      key: "rank",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Item ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority: number) => (
        <Tag
          color={priority >= 100 ? "red" : priority >= 50 ? "orange" : "blue"}
        >
          {priority}
        </Tag>
      ),
    },
    {
      title: "Match Score",
      dataIndex: "matchScore",
      key: "matchScore",
      width: 100,
      render: (score: number) => <Tag color="green">{score}</Tag>,
    },
    {
      title: "Match Reason",
      dataIndex: "matchReason",
      key: "matchReason",
      render: (reasons: string[]) => (
        <Space direction="vertical" size={2}>
          {reasons.map((reason, index) => (
            <Text key={index} style={{ fontSize: "12px" }}>
              {reason}
            </Text>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={24}>
      {/* Simulation Form */}
      <Col span={10}>
        <Card title={t("SIMULATION_INPUT")} style={{ height: "fit-content" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={runSimulation}
            initialValues={{
              simulateAt: new Date(),
            }}
          >
            <Form.Item
              label={t("SIMULATE_AT")}
              name="simulateAt"
              tooltip={t("SIMULATE_AT_TOOLTIP")}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                format="DD/MM/YYYY HH:mm:ss"
              />
            </Form.Item>

            <Form.Item
              label={t("TARGET_TYPE")}
              name="targetType"
              rules={[{ required: true, message: t("TARGET_TYPE_REQUIRED") }]}
            >
              <Select
                placeholder={t("SELECT_TARGET_TYPE")}
                onChange={() => {
                  form.resetFields([
                    "targetId",
                    "seatType",
                    "graphicsType",
                    "screeningTimeType",
                    "dayType",
                    "auditoriumType",
                  ]);
                }}
                options={[
                  { label: t("TARGET_TYPE_TICKET"), value: "TICKET" },
                  { label: t("TARGET_TYPE_PRODUCT"), value: "PRODUCT" },
                  {
                    label: t("TARGET_TYPE_ADDITIONAL_SERVICE"),
                    value: "ADDITIONAL_SERVICE",
                  },
                ]}
              />
            </Form.Item>

            {/* Target ID for PRODUCT/ADDITIONAL_SERVICE */}
            {(targetType === "PRODUCT" ||
              targetType === "ADDITIONAL_SERVICE") && (
              <Form.Item
                label={
                  targetType === "PRODUCT"
                    ? t("PRODUCT")
                    : t("ADDITIONAL_SERVICE")
                }
                name="targetId"
                rules={[{ required: true, message: t("TARGET_ID_REQUIRED") }]}
              >
                <Select
                  placeholder={t("SELECT_TARGET")}
                  showSearch
                  options={
                    targetType === "PRODUCT"
                      ? activeProducts?.map((product) => ({
                          label: product.name,
                          value: product.id,
                        })) || []
                      : additionalServices?.map((service) => ({
                          label: service.name,
                          value: service.id,
                        })) || []
                  }
                />
              </Form.Item>
            )}

            {/* TICKET dimensions */}
            {targetType === "TICKET" && (
              <>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item label={t("SEAT_TYPE")} name="seatType">
                      <Select
                        placeholder={t("ANY")}
                        allowClear
                        options={[
                          { label: t("SEAT_TYPE_NORMAL"), value: "NORMAL" },
                          { label: t("SEAT_TYPE_VIP"), value: "VIP" },
                          { label: t("SEAT_TYPE_COUPLE"), value: "COUPLE" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("GRAPHICS_TYPE")} name="graphicsType">
                      <Select
                        placeholder={t("ANY")}
                        allowClear
                        options={[
                          { label: t("GRAPHICS_TYPE_2D"), value: "_2D" },
                          { label: t("GRAPHICS_TYPE_3D"), value: "_3D" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item label={t("DAY_TYPE")} name="dayType">
                      <Select
                        placeholder={t("ANY")}
                        allowClear
                        options={[
                          { label: t("DAY_TYPE_WEEKDAY"), value: "WEEKDAY" },
                          { label: t("DAY_TYPE_WEEKEND"), value: "WEEKEND" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("AUDITORIUM_TYPE")}
                      name="auditoriumType"
                    >
                      <Select
                        placeholder={t("ANY")}
                        allowClear
                        options={[
                          {
                            label: t("AUDITORIUM_TYPE_STANDARD"),
                            value: "STANDARD",
                          },
                          { label: t("AUDITORIUM_TYPE_IMAX"), value: "IMAX" },
                          {
                            label: t("AUDITORIUM_TYPE_GOLDCLASS"),
                            value: "GOLDCLASS",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Form.Item label={t("MIN_QUANTITY")} name="minQty">
              <InputNumber
                placeholder={t("ENTER_MIN_QUANTITY")}
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("RUN_SIMULATION")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      {/* Simulation Results */}
      <Col span={14}>
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          {/* Resolved Price */}
          {simulationResults && (
            <Card title={t("SIMULATION_RESULTS")}>
              {simulationResults.resolvedPrice !== null ? (
                <Space direction="vertical" style={{ width: "100%" }} size={12}>
                  <Alert
                    message={t("PRICE_RESOLVED")}
                    description={
                      <Space direction="vertical" size={4}>
                        <Title
                          level={2}
                          style={{ margin: 0, color: "#1890ff" }}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(simulationResults.resolvedPrice)}
                        </Title>
                        {simulationResults.matchedItem && (
                          <Text type="secondary">
                            {t("MATCHED_ITEM")}: #
                            {simulationResults.matchedItem.id}
                            (Priority: {simulationResults.matchedItem.priority},
                            Score: {simulationResults.matchedItem.matchScore})
                          </Text>
                        )}
                      </Space>
                    }
                    type="success"
                    showIcon
                  />
                </Space>
              ) : (
                <Alert
                  message={t("NO_PRICE_FOUND")}
                  description={t("NO_MATCHING_RULES")}
                  type="warning"
                  showIcon
                />
              )}
            </Card>
          )}

          {/* Top Candidates Debug Table */}
          {simulationResults && simulationResults.topCandidates.length > 0 && (
            <Card title={t("TOP_CANDIDATES_DEBUG")}>
              <Text
                type="secondary"
                style={{ marginBottom: 16, display: "block" }}
              >
                {t("TOP_CANDIDATES_DESCRIPTION")}
              </Text>
              <Table
                columns={candidatesColumns}
                dataSource={simulationResults.topCandidates}
                rowKey="id"
                size="small"
                pagination={false}
                rowClassName={(_, index) =>
                  index === 0 ? "ant-table-row-selected" : ""
                }
              />
            </Card>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default PriceSimulator;
