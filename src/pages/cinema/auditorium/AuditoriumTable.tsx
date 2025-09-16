import { DeleteOutlined, EditOutlined, TableOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteAuditoriumMutation } from "@/app/services/auditorium.service";
import { formatDate, rangeColumn, rangeRow } from "@/utils/functionUtils";
import ModalUpdate from "./ModalUpdate";
import SeatModal from "./SeatModal";
import type { Auditorium } from "@/types";
import type { ColumnsType } from "antd/es/table";

const parseAuditoriumType = (type: string, t: (key: string) => string) => {
  switch (type) {
    case "STANDARD":
      return <Tag color="blue">{t("STANDARD_LABEL")}</Tag>;
    case "IMAX":
      return <Tag color="green">{t("IMAX_LABEL")}</Tag>;
    case "GOLDCLASS":
      return <Tag color="gold">{t("GOLDCLASS_LABEL")}</Tag>;
    default:
      return <Tag color="default">{t("UNKNOWN_TYPE")}</Tag>;
  }
};

interface AuditoriumTableProps {
  data: Auditorium[];
  cinemaId: number;
}

const AuditoriumTable = ({ data, cinemaId }: AuditoriumTableProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openSeatModal, setOpenSeatModal] = useState(false);
  const [auditoriumUpdate, setAuditoriumUpdate] = useState<Auditorium | null>(
    null
  );
  const [deleteAuditorium, { isLoading }] = useDeleteAuditoriumMutation();

  const columns: ColumnsType<Auditorium> = [
    {
      title: t("AUDITORIUM_NAME_COLUMN"),
      dataIndex: "name",
      key: "name",
      render: (text: string, _record: Auditorium, _index: number) => {
        return text;
      },
    },
    {
      title: t("AUDITORIUM_TYPE_COLUMN"),
      dataIndex: "type",
      key: "type",
      render: (text: string, _record: Auditorium, _index: number) => {
        return parseAuditoriumType(text, t);
      },
    },
    {
      title: t("TOTAL_SEATS_COLUMN"),
      dataIndex: "totalSeats",
      key: "totalSeats",
      render: (text: number, _record: Auditorium, _index: number) => {
        return text ? text : t("NOT_UPDATED");
      },
    },
    {
      title: t("TOTAL_ROWS_COLUMN"),
      dataIndex: "totalRows",
      key: "totalRows",
      render: (text: number, _record: Auditorium, _index: number) => {
        const rows = rangeRow(text);
        const startRow = rows[0];
        const endRow = rows[rows.length - 1];
        return text ? `${text} (${startRow} -> ${endRow})` : t("NOT_UPDATED");
      },
    },
    {
      title: t("TOTAL_COLUMNS_COLUMN"),
      dataIndex: "totalColumns",
      key: "totalColumns",
      render: (text: number, _record: Auditorium, _index: number) => {
        const columns = rangeColumn(text);
        const startColumn = columns[0];
        const endColumn = columns[columns.length - 1];
        return text
          ? `${text} (${startColumn} -> ${endColumn})`
          : t("NOT_UPDATED");
      },
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string, _record: Auditorium, _index: number) => {
        return formatDate(text);
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      render: (_text: any, record: Auditorium, _index: number) => {
        return (
          <Space>
            <Button
              style={{ backgroundColor: "rgb(243, 156, 18)" }}
              type="primary"
              icon={<TableOutlined />}
              onClick={() => {
                setAuditoriumUpdate(record);
                setOpenSeatModal(true);
              }}
            ></Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setAuditoriumUpdate(record);
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

  const handleConfirm = (id: number) => {
    Modal.confirm({
      title: t("DELETE_AUDITORIUM_CONFIRM_TITLE"),
      content: t("DELETE_AUDITORIUM_CONFIRM_CONTENT"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteAuditorium(id)
            .unwrap()
            .then(() => {
              message.success(t("DELETE_AUDITORIUM_SUCCESS"));
              resolve(); // Đóng modal sau khi xóa thành công
            })
            .catch((error) => {
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

      {open && auditoriumUpdate && (
        <ModalUpdate
          open={open}
          onCancel={() => setOpen(false)}
          auditorium={auditoriumUpdate}
          cinemaId={cinemaId}
        />
      )}

      {openSeatModal && auditoriumUpdate && (
        <SeatModal
          open={openSeatModal}
          onCancel={() => setOpenSeatModal(false)}
          auditorium={auditoriumUpdate}
          cinemaId={cinemaId}
        />
      )}
    </>
  );
};
export default AuditoriumTable;
