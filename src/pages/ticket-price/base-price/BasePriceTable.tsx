import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, message, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteBaseTicketPriceMutation } from "@/app/services/baseTicketPrice.service";
import { formatCurrency } from "@/utils/functionUtils";
import type {
  BaseTicketPrice,
  SeatType,
  GraphicsType,
  ScreeningTimeType,
  DayType,
  AuditoriumType,
} from "@/types";
import ModalUpdate from "./ModalUpdate";

const parseSeatType = (seatType: SeatType, t: (key: string) => string) => {
  switch (seatType) {
    case "NORMAL":
      return <Tag color="default">{t("NORMAL_SEAT")}</Tag>;
    case "VIP":
      return <Tag color="gold">{t("VIP_SEAT")}</Tag>;
    case "COUPLE":
      return <Tag color="magenta">{t("COUPLE_SEAT")}</Tag>;
    default:
      return <Tag color="default">{t("UNKNOWN")}</Tag>;
  }
};

const parseGraphicsType = (
  graphicsType: GraphicsType,
  t: (key: string) => string
) => {
  switch (graphicsType) {
    case "_2D":
      return <Tag color="cyan">{t("GRAPHICS_2D")}</Tag>;
    case "_3D":
      return <Tag color="green">{t("GRAPHICS_3D")}</Tag>;
    default:
      return <Tag color="default">{t("UNKNOWN")}</Tag>;
  }
};

const parseScreeningTimeType = (
  screeningTimeType: ScreeningTimeType,
  t: (key: string) => string
) => {
  switch (screeningTimeType) {
    case "SUAT_CHIEU_SOM":
      return <Tag color="blue">{t("EARLY_SCREENING")}</Tag>;
    case "SUAT_CHIEU_THEO_LICH":
      return <Tag color="orange">{t("SCHEDULED_SCREENING")}</Tag>;
    default:
      return <Tag color="default">{t("UNKNOWN")}</Tag>;
  }
};

const parseDayType = (dayType: DayType, t: (key: string) => string) => {
  switch (dayType) {
    case "WEEKDAY":
      return <Tag color="geekblue">{t("WEEKDAY_SHORT")}</Tag>;
    case "WEEKEND":
      return <Tag color="volcano">{t("WEEKEND_SHORT")}</Tag>;
    default:
      return <Tag color="default">{t("UNKNOWN")}</Tag>;
  }
};

const parseAuditoriumType = (
  auditoriumType: AuditoriumType,
  t: (key: string) => string
) => {
  switch (auditoriumType) {
    case "STANDARD":
      return <Tag color="blue">{t("STANDARD_SHORT")}</Tag>;
    case "IMAX":
      return <Tag color="green">{t("IMAX_SHORT")}</Tag>;
    case "GOLDCLASS":
      return <Tag color="gold">{t("GOLDCLASS_SHORT")}</Tag>;
    default:
      return <Tag color="default">{t("UNKNOWN")}</Tag>;
  }
};

interface BasePriceTableProps {
  data: BaseTicketPrice[];
}

const BasePriceTable = ({ data }: BasePriceTableProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [baseTicketPriceUpdate, setBaseTicketPriceUpdate] =
    useState<BaseTicketPrice | null>(null);
  const [deleteBaseTicketPrice, { isLoading }] =
    useDeleteBaseTicketPriceMutation();

  const columns: ColumnsType<BaseTicketPrice> = [
    {
      title: t("SEAT_TYPE_COLUMN"),
      dataIndex: "seatType",
      key: "seatType",
      sorter: (a: BaseTicketPrice, b: BaseTicketPrice) =>
        a.seatType.localeCompare(b.seatType, "vi"),
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: t("NORMAL_SEAT"),
          value: "NORMAL",
        },
        {
          text: t("VIP_SEAT"),
          value: "VIP",
        },
        {
          text: t("COUPLE_SEAT"),
          value: "COUPLE",
        },
      ],
      onFilter: (value, record) =>
        record.seatType.indexOf(value as string) === 0,
      render: (text: SeatType) => {
        return parseSeatType(text, t);
      },
    },
    {
      title: t("GRAPHICS_TYPE_COLUMN"),
      dataIndex: "graphicsType",
      key: "graphicsType",
      sorter: (a: BaseTicketPrice, b: BaseTicketPrice) =>
        a.graphicsType.localeCompare(b.graphicsType, "vi"),
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: t("GRAPHICS_2D"),
          value: "_2D",
        },
        {
          text: t("GRAPHICS_3D"),
          value: "_3D",
        },
      ],
      onFilter: (value, record) =>
        record.graphicsType.indexOf(value as string) === 0,
      render: (text: GraphicsType) => {
        return parseGraphicsType(text, t);
      },
    },
    {
      title: t("SCREENING_TIME_TYPE_COLUMN"),
      dataIndex: "screeningTimeType",
      key: "screeningTimeType",
      sorter: (a: BaseTicketPrice, b: BaseTicketPrice) =>
        a.screeningTimeType.localeCompare(b.screeningTimeType, "vi"),
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: t("EARLY_SCREENING"),
          value: "SUAT_CHIEU_SOM",
        },
        {
          text: t("SCHEDULED_SCREENING"),
          value: "SUAT_CHIEU_THEO_LICH",
        },
      ],
      onFilter: (value, record) =>
        record.screeningTimeType.indexOf(value as string) === 0,
      render: (text: ScreeningTimeType) => {
        return parseScreeningTimeType(text, t);
      },
    },
    {
      title: t("DAY_TYPE_COLUMN"),
      dataIndex: "dayType",
      key: "dayType",
      sorter: (a: BaseTicketPrice, b: BaseTicketPrice) =>
        a.dayType.localeCompare(b.dayType, "vi"),
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: t("WEEKDAY_SHORT"),
          value: "WEEKDAY",
        },
        {
          text: t("WEEKEND_SHORT"),
          value: "WEEKEND",
        },
      ],
      onFilter: (value, record) =>
        record.dayType.indexOf(value as string) === 0,
      render: (text: DayType) => {
        return parseDayType(text, t);
      },
    },
    {
      title: t("AUDITORIUM_TYPE_COLUMN"),
      dataIndex: "auditoriumType",
      key: "auditoriumType",
      sorter: (a: BaseTicketPrice, b: BaseTicketPrice) =>
        a.auditoriumType.localeCompare(b.auditoriumType, "vi"),
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: t("STANDARD_SHORT"),
          value: "STANDARD",
        },
        {
          text: t("IMAX_SHORT"),
          value: "IMAX",
        },
        {
          text: t("GOLDCLASS_SHORT"),
          value: "GOLDCLASS",
        },
      ],
      onFilter: (value, record) =>
        record.auditoriumType.indexOf(value as string) === 0,
      render: (text: AuditoriumType) => {
        return parseAuditoriumType(text, t);
      },
    },
    {
      title: t("PRICE_COLUMN"),
      dataIndex: "price",
      key: "price",
      sorter: (a: BaseTicketPrice, b: BaseTicketPrice) => a.price - b.price,
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return formatCurrency(text);
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      render: (_, record: BaseTicketPrice) => {
        return (
          <Flex justify={"end"}>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setBaseTicketPriceUpdate(record);
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
          </Flex>
        );
      },
    },
  ];

  const handleConfirm = (id: number) => {
    Modal.confirm({
      title: t("DELETE_CONFIRM_TITLE"),
      content: t("DELETE_CONFIRM_CONTENT"),
      okText: t("OK_TEXT"),
      okType: "danger",
      cancelText: t("CANCEL_TEXT"),
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteBaseTicketPrice(id)
            .unwrap()
            .then(() => {
              message.success(t("DELETE_SUCCESS"));
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

      {open && (
        <ModalUpdate
          open={open}
          onCancel={() => setOpen(false)}
          baseTicketPrice={baseTicketPriceUpdate}
        />
      )}
    </>
  );
};
export default BasePriceTable;
