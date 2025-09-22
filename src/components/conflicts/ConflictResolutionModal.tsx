import React from "react";
import { Modal, Typography, List, Tag, Space, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { ConflictDetail } from "@/types/showtime.types";
import dayjs from "dayjs";

const { Text } = Typography;

interface ConflictResolutionModalProps {
  visible: boolean;
  conflicts: ConflictDetail[];
  totalRequested: number;
  validCount: number;
  onSkipConflicts: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  visible,
  conflicts,
  totalRequested,
  validCount,
  onSkipConflicts,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

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
          disabled={validCount === 0}
        >
          {t("SKIP_CONFLICTS_BUTTON")} ({validCount})
        </Button>,
      ]}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <Text>{t("CONFLICT_DETECTED_MESSAGE")}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Tag color="orange">
            {t("TOTAL_REQUESTED")}: {totalRequested}
          </Tag>
          <Tag color="red">
            {t("CONFLICTS")}: {conflicts.length}
          </Tag>
          <Tag color="green">
            {t("CAN_CREATE")}: {validCount}
          </Tag>
        </Space>
      </div>

      <List
        size="small"
        bordered
        dataSource={conflicts}
        renderItem={(conflict) => (
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
        )}
        style={{ maxHeight: 300, overflowY: "auto" }}
      />

      {validCount > 0 && (
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
            {t("WILL_CREATE_SHOWTIMES", { count: validCount })}
          </Text>
        </div>
      )}

      {validCount === 0 && (
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
