import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useDeleteScheduleMutation } from "@services/schedules.service";
import { formatDate } from "@/utils/functionUtils";
import ModalUpdate from "./ModalUpdate";
import type { ScheduleTableProps, Schedule } from "@/types";

const ScheduleTable = ({ data, movies }: ScheduleTableProps) => {
  const { t } = useTranslation();

  // Simple column search properties (simplified version for now)
  const getColumnSearchProps = (dataIndex: string, nestedKeys?: string[]) => ({
    // Basic filtering without complex search UI
    onFilter: (value: any, record: any) => {
      if (nestedKeys && nestedKeys.length > 0) {
        let nestedValue = record;
        for (const key of nestedKeys) {
          nestedValue = nestedValue?.[key];
        }
        return (
          nestedValue
            ?.toString()
            ?.toLowerCase()
            ?.includes((value as string).toLowerCase()) ?? false
        );
      }
      return (
        record[dataIndex]
          ?.toString()
          ?.toLowerCase()
          ?.includes((value as string).toLowerCase()) ?? false
      );
    },
  });

  const [open, setOpen] = useState(false);
  const [scheduleUpdate, setScheduleUpdate] = useState<Schedule | null>(null);
  const [deleteSchedule, { isLoading }] = useDeleteScheduleMutation();

  const getClassification = (record: Schedule): number => {
    const now = new Date();
    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);
    if (now < startDate) return 1;
    if (now >= startDate && now <= endDate) return 2;
    return 3;
  };

  const columns = [
    {
      title: t("MOVIE"),
      dataIndex: "movie",
      key: "movie",
      ...getColumnSearchProps("movie", ["name"]),
      render: (text: any, _record: Schedule, _index: number) => {
        return (
          <RouterLink to={`/admin/movies/${text.id}/detail`}>
            {text.name}
          </RouterLink>
        );
      },
    },
    {
      title: t("SHOWING_TIME"),
      dataIndex: "startDate",
      key: "time",
      sorter: (a: Schedule, b: Schedule) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      sortDirections: ["descend", "ascend"] as SortOrder[],
      render: (_text: any, record: Schedule, _index: number) => {
        return `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`;
      },
    },
    {
      title: t("CLASSIFICATION"),
      dataIndex: "startDate",
      key: "type",
      sorter: (a: Schedule, b: Schedule) => {
        return getClassification(a) - getClassification(b);
      },
      sortDirections: ["descend", "ascend"] as SortOrder[],
      render: (_text: any, record: Schedule) => {
        const classification = getClassification(record);
        const color =
          classification === 1
            ? "processing"
            : classification === 2
              ? "success"
              : "warning";
        const statusText =
          classification === 1
            ? t("UPCOMING")
            : classification === 2
              ? t("SHOWING")
              : t("ENDED");

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      render: (_text: any, record: Schedule, _index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setScheduleUpdate(record);
                setOpen(true);
              }}
            ></Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                handleConfirm(record.id);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  const handleConfirm = (id: string | number) => {
    Modal.confirm({
      title: t("CONFIRM_DELETE_SCHEDULE"),
      content: t("CONFIRM_DELETE_MESSAGE"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteSchedule(id)
            .unwrap()
            .then(() => {
              message.success(t("SCHEDULE_DELETED_SUCCESS"));
              resolve(); // Đóng modal sau khi xóa thành công
            })
            .catch((error: any) => {
              message.error(error.data.message);
              reject(); // Không đóng modal nếu xóa thất bại
            });
        });
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
      />

      {open && scheduleUpdate && (
        <ModalUpdate
          open={open}
          onCancel={() => setOpen(false)}
          schedule={scheduleUpdate}
          movies={movies}
        />
      )}
    </>
  );
};
export default ScheduleTable;
