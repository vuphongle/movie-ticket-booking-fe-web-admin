import React, { useEffect, useMemo, useState } from "react";
import { Modal, Typography, List, Tag, Space, Button, Segmented } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { ConflictDetail } from "@/types/showtime.types";
import dayjs from "dayjs";

const { Text } = Typography;

interface ConflictResolutionModalProps {
  visible: boolean;
  conflicts: ConflictDetail[];
  requestedDates: string[];
  totalRequested: number;
  validCount: number;
  onSkipConflicts: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  visible,
  conflicts,
  requestedDates,
  totalRequested,
  validCount,
  onSkipConflicts,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "conflicts" | "valid"
  >("all");

  const formatDate = (dateStr: string) => dayjs(dateStr).format("DD/MM/YYYY");

  useEffect(() => {
    if (visible) {
      setActiveFilter(requestedDates.length ? "all" : "conflicts");
    }
  }, [visible, requestedDates.length]);

  const conflictByDate = useMemo(() => {
    const map = new Map<string, ConflictDetail>();
    conflicts.forEach((conflict) => {
      const normalized = dayjs(conflict.date).format("YYYY-MM-DD");
      map.set(normalized, conflict);
    });
    return map;
  }, [conflicts]);

  const requestedDateItems = useMemo(
    () =>
      requestedDates.map((date) => ({
        raw: date,
        normalized: dayjs(date).format("YYYY-MM-DD"),
      })),
    [requestedDates]
  );

  const validDateItems = useMemo(
    () =>
      requestedDateItems.filter((item) => !conflictByDate.has(item.normalized)),
    [requestedDateItems, conflictByDate]
  );

  const totalRequestedCount = requestedDateItems.length || totalRequested;
  const conflictCount = conflicts.length;
  const validCountValue = requestedDateItems.length
    ? validDateItems.length
    : validCount;

  type FilteredItem =
    | { key: string; type: "conflict"; conflict: ConflictDetail }
    | { key: string; type: "valid"; date: string };

  const displayedItems: FilteredItem[] = useMemo(() => {
    if (activeFilter === "conflicts") {
      return conflicts.map((conflict) => ({
        key: `conflict-${conflict.date}-${conflict.conflictMovie ?? ""}`,
        type: "conflict",
        conflict,
      }));
    }

    if (activeFilter === "valid") {
      return validDateItems.map((item) => ({
        key: `valid-${item.normalized}`,
        type: "valid",
        date: item.raw,
      }));
    }

    if (requestedDateItems.length > 0) {
      return requestedDateItems.map((item) => {
        const conflict = conflictByDate.get(item.normalized);
        if (conflict) {
          return {
            key: `conflict-${item.normalized}`,
            type: "conflict" as const,
            conflict,
          };
        }

        return {
          key: `valid-${item.normalized}`,
          type: "valid" as const,
          date: item.raw,
        };
      });
    }

    return conflicts.map((conflict) => ({
      key: `conflict-${conflict.date}-${conflict.conflictMovie ?? ""}`,
      type: "conflict" as const,
      conflict,
    }));
  }, [
    activeFilter,
    conflicts,
    conflictByDate,
    requestedDateItems,
    validDateItems,
  ]);

  const filterOptions = useMemo(
    () => [
      {
        label: (
          <Tag color="orange" style={{ margin: 0 }}>
            {t("TOTAL_REQUESTED")}: {totalRequestedCount}
          </Tag>
        ),
        value: "all" as const,
      },
      {
        label: (
          <Tag color="red" style={{ margin: 0 }}>
            {t("CONFLICTS")}: {conflictCount}
          </Tag>
        ),
        value: "conflicts" as const,
        disabled: conflictCount === 0,
      },
      {
        label: (
          <Tag color="green" style={{ margin: 0 }}>
            {t("CAN_CREATE")}: {validCountValue}
          </Tag>
        ),
        value: "valid" as const,
        disabled: validCountValue === 0,
      },
    ],
    [t, totalRequestedCount, conflictCount, validCountValue]
  );

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: "#faad14" }} />
          {t("CONFLICT_DETECTED_TITLE")}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t("CANCEL_CREATION_BUTTON")}
        </Button>,
        <Button
          key="skip"
          type="primary"
          onClick={onSkipConflicts}
          loading={loading}
          disabled={validCountValue === 0}
        >
          {t("SKIP_CONFLICTS_BUTTON")} ({validCountValue})
        </Button>,
      ]}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <Text>{t("CONFLICT_DETECTED_MESSAGE")}</Text>
      </div>

      <Segmented
        value={activeFilter}
        options={filterOptions}
        onChange={(value) =>
          setActiveFilter(value as "all" | "conflicts" | "valid")
        }
        style={{ marginBottom: 16 }}
      />

      <List
        size="small"
        bordered
        dataSource={displayedItems}
        renderItem={(item) => {
          if (item.type === "conflict") {
            const conflict = item.conflict;
            return (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong>{formatDate(conflict.date)}</Text>
                    <Tag color="red">
                      {conflict.conflictTimeRange || t("CONFLICT")}
                    </Tag>
                  </div>
                  {conflict.conflictMovie && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">
                        {t("CONFLICTED_WITH")}: {conflict.conflictMovie}
                      </Text>
                    </div>
                  )}
                  {conflict.reason && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {conflict.reason}
                      </Text>
                    </div>
                  )}
                </div>
              </List.Item>
            );
          }

          return (
            <List.Item>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong>{formatDate(item.date)}</Text>
                  <Tag color="green">{t("READY_FOR_CREATION")}</Tag>
                </div>
              </div>
            </List.Item>
          );
        }}
        style={{ maxHeight: 300, overflowY: "auto" }}
      />

      {validCountValue > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: 4,
          }}
        >
          <Text type="success">
            {t("WILL_CREATE_SHOWTIMES", { count: validCountValue })}
          </Text>
        </div>
      )}

      {validCountValue === 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#fff1f0",
            border: "1px solid #ffccc7",
            borderRadius: 4,
          }}
        >
          <Text type="danger">{t("NO_VALID_DATES_REMAINING")}</Text>
        </div>
      )}
    </Modal>
  );
};

export default ConflictResolutionModal;
