import React from "react";
import { Card, Timeline, Tag, Typography, Space, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/utils/functionUtils";
import type { PriceItem } from "@/types";

const { Text } = Typography;

interface PriceItemTimelineProps {
  data: PriceItem[];
}

const PriceItemTimeline: React.FC<PriceItemTimelineProps> = ({ data }) => {
  const { t } = useTranslation();

  // Group items by target type
  const groupedByTargetType = data.reduce(
    (acc, item) => {
      if (!acc[item.targetType]) {
        acc[item.targetType] = [];
      }
      acc[item.targetType].push(item);
      return acc;
    },
    {} as Record<string, PriceItem[]>
  );

  // Sort items by target type and priority
  const sortedItems = Object.keys(groupedByTargetType)
    .map((targetType) => ({
      targetType,
      items: groupedByTargetType[targetType]
        .filter((item) => item.priceList?.validFrom || item.priceList?.validTo)
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          const dateA = a.priceList?.validFrom
            ? new Date(a.priceList.validFrom).getTime()
            : 0;
          const dateB = b.priceList?.validFrom
            ? new Date(b.priceList.validFrom).getTime()
            : 0;
          return dateA - dateB;
        }),
    }))
    .filter((group) => group.items.length > 0);

  const getTargetTypeColor = (targetType: string) => {
    const colors: Record<string, string> = {
      TICKET: "blue",
      PRODUCT: "green",
      ADDITIONAL_SERVICE: "orange",
    };
    return colors[targetType] || "default";
  };

  const getTimelineColor = (item: PriceItem) => {
    if (!item.status) return "red";
    if (item.priority >= 100) return "red";
    if (item.priority >= 50) return "orange";
    return "blue";
  };

  const checkOverlap = (items: PriceItem[]) => {
    const overlaps: { [key: number]: boolean } = {};

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const item1 = items[i];
        const item2 = items[j];

        // Check for price list validity period overlap
        const start1 = item1.priceList?.validFrom
          ? new Date(item1.priceList.validFrom)
          : new Date(0);
        const end1 = item1.priceList?.validTo
          ? new Date(item1.priceList.validTo)
          : new Date(9999, 11, 31);
        const start2 = item2.priceList?.validFrom
          ? new Date(item2.priceList.validFrom)
          : new Date(0);
        const end2 = item2.priceList?.validTo
          ? new Date(item2.priceList.validTo)
          : new Date(9999, 11, 31);

        // Check for overlap
        if (start1 < end2 && start2 < end1) {
          overlaps[item1.id] = true;
          overlaps[item2.id] = true;
        }
      }
    }

    return overlaps;
  };

  if (sortedItems.length === 0) {
    return (
      <Card>
        <Empty
          description={t("NO_SCHEDULED_ITEMS")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div>
      {sortedItems.map(({ targetType, items }) => {
        const overlaps = checkOverlap(items);

        return (
          <Card
            key={targetType}
            title={
              <Space>
                <Tag color={getTargetTypeColor(targetType)}>
                  {t(`TARGET_TYPE_${targetType}`)}
                </Tag>
                <Text type="secondary">({items.length} items)</Text>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Timeline
              items={items.map((item) => ({
                key: item.id,
                color: getTimelineColor(item),
                children: (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Space direction="vertical" size={2}>
                        <Space>
                          <Text strong>#{item.id}</Text>
                          <Tag color={item.status ? "green" : "red"}>
                            {item.status ? t("ACTIVE") : t("INACTIVE")}
                          </Tag>
                          <Tag color="blue">
                            {t("PRIORITY")}: {item.priority}
                          </Tag>
                          {overlaps[item.id] && (
                            <Tag color="red">{t("OVERLAP_DETECTED")}</Tag>
                          )}
                        </Space>

                        <Space direction="vertical" size={0}>
                          {item.priceList?.validFrom && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              <strong>{t("FROM")}:</strong>{" "}
                              {formatDateTime(item.priceList.validFrom)}
                            </Text>
                          )}
                          {item.priceList?.validTo && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              <strong>{t("TO")}:</strong>{" "}
                              {formatDateTime(item.priceList.validTo)}
                            </Text>
                          )}
                          {!item.priceList?.validFrom &&
                            !item.priceList?.validTo && (
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {t("NO_TIME_LIMIT")}
                              </Text>
                            )}
                        </Space>

                        {/* Show target-specific info */}
                        {targetType === "TICKET" && (
                          <Space wrap size={[4, 2]}>
                            {item.seatType && (
                              <Tag style={{ fontSize: "11px" }}>
                                Seat: {item.seatType}
                              </Tag>
                            )}
                            {item.graphicsType && (
                              <Tag style={{ fontSize: "11px" }}>
                                Graphics: {item.graphicsType}
                              </Tag>
                            )}
                            {item.dayType && (
                              <Tag style={{ fontSize: "11px" }}>
                                Day: {item.dayType}
                              </Tag>
                            )}
                          </Space>
                        )}

                        {(targetType === "PRODUCT" ||
                          targetType === "ADDITIONAL_SERVICE") &&
                          item.targetId && (
                            <Tag style={{ fontSize: "11px" }}>
                              Target ID: {item.targetId}
                            </Tag>
                          )}
                      </Space>

                      <Text strong style={{ color: "#1890ff" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </Text>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default PriceItemTimeline;
