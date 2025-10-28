import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  message,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd/es/menu";
import { useTranslation } from "react-i18next";
import {
  useDeletePriceItemMutation,
  useTogglePriceItemStatusMutation,
} from "@/app/services/priceItem.service";
import { useGetProductsQuery } from "@/app/services/products.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import { formatCurrency } from "@/utils/functionUtils";
import type { PriceItem, PriceTargetType } from "@/types";
import { usePriceItemActions } from "./PriceItemActionsContext";
import useSearchTable from "@/hooks/useSearchTable";
import React from "react";

interface PriceItemTableProps {
  data: PriceItem[];
  loading?: boolean;
  hideTargetType?: boolean;
  hideTargetName?: boolean;
  hideTicketConditions?: boolean;
}

const PriceItemTable = ({
  data,
  loading,
  hideTargetType = false,
  hideTargetName = false,
  hideTicketConditions = false,
}: PriceItemTableProps) => {
  const { t } = useTranslation();
  const { onEdit } = usePriceItemActions();
  const { getColumnSearchProps } = useSearchTable();

  // Fetch products and additional services for name lookup
  const { data: products = [] } = useGetProductsQuery(undefined);
  const { data: additionalServices = [] } = useGetAdditionalServicesQuery();

  const [deletePriceItem, { isLoading: isDeleting }] =
    useDeletePriceItemMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useTogglePriceItemStatusMutation();

  // Get target name by type and ID
  const getTargetName = (priceItem: PriceItem): string => {
    if (priceItem.targetType === "TICKET") {
      return "-";
    }

    if (priceItem.targetType === "PRODUCT" && priceItem.targetId) {
      // First check if the name is populated in the priceItem itself
      if (priceItem.product?.name) {
        return priceItem.product.name;
      }
      // Otherwise lookup from the products list
      const product = products.find((p) => Number(p.id) === priceItem.targetId);
      return product?.name || `Product ID: ${priceItem.targetId}`;
    }

    if (priceItem.targetType === "ADDITIONAL_SERVICE" && priceItem.targetId) {
      if (priceItem.additionalService?.name) {
        return priceItem.additionalService.name;
      }
      const service = additionalServices.find(
        (s) => Number(s.id) === priceItem.targetId
      );
      return service?.name ? service.name : `Service ID: ${priceItem.targetId}`;
    }

    return "N/A";
  };

  const handleDelete = (priceItem: PriceItem) => {
    Modal.confirm({
      title: t("CONFIRM_DELETE"),
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>{t("DELETE_WARNING_MESSAGE")}</p>
        </div>
      ),
      okText: t("DELETE"),
      cancelText: t("CANCEL"),
      okType: "danger",
      onOk: async () => {
        try {
          await deletePriceItem(priceItem.id).unwrap();
          message.success(t("DELETE_SUCCESS", "Xóa thành công"));
        } catch (error: any) {
          console.error("❌ [DEBUG] Delete error:", error);
          const backendMessage = error?.data?.message || error?.error;
          if (
            backendMessage.includes(
              "Cannot delete PriceItem that has been used in orders."
            )
          ) {
            message.warning(
              t(
                "PRICE_ITEM_USED_IN_ORDERS",
                "Không thể xóa mục giá đã được sử dụng trong các đơn hàng!"
              )
            );
          } else if (backendMessage.includes("PriceItem not found with id")) {
            message.warning(
              t("PRICE_ITEM_NOT_FOUND", "Mục giá không tồn tại hoặc đã bị xóa!")
            );
          } else {
            message.error(backendMessage);
          }
        }
      },
    });
  };

  const handleToggleStatus = (priceItem: PriceItem) => {
    toggleStatus(priceItem.id)
      .unwrap()
      .then(() => {
        message.success(t("UPDATE_STATUS_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data?.message || t("UPDATE_STATUS_ERROR"));
      });
  };

  const getActionMenuItems = (_priceItem: PriceItem): MenuProps["items"] => [
    {
      key: "edit",
      label: (
        <Space>
          <EditOutlined />
          {t("EDIT")}
        </Space>
      ),
    },
    {
      key: "delete",
      label: (
        <Space>
          <DeleteOutlined />
          {t("DELETE")}
        </Space>
      ),
      danger: true,
    },
  ];

  const handleMenuClick = (priceItem: PriceItem) => (e: any) => {
    if (e.key === "edit") {
      onEdit?.(priceItem);
    } else if (e.key === "delete") {
      handleDelete(priceItem);
    }
  };

  const getTargetTypeTag = (targetType: PriceTargetType) => {
    const colors: Record<string, string> = {
      TICKET: "blue",
      PRODUCT: "green",
      ADDITIONAL_SERVICE: "orange",
    };

    const labels: Record<string, string> = {
      TICKET: t("TARGET_TYPE_TICKET"),
      PRODUCT: t("TARGET_TYPE_PRODUCT"),
      ADDITIONAL_SERVICE: t("TARGET_TYPE_ADDITIONAL_SERVICE"),
    };

    return (
      <Tag color={colors[targetType] || "default"}>
        {labels[targetType] || targetType}
      </Tag>
    );
  };

  // Render dimension value with "Any" for null and proper translations
  const renderDimension = (
    value: string | null | undefined,
    type: "seat" | "graphics" | "time" | "day" | "room"
  ) => {
    const getLabel = (type: string) => {
      switch (type) {
        case "seat":
          return t("SEAT_TYPE");
        case "graphics":
          return t("GRAPHICS_TYPE");
        case "time":
          return t("SCREENING_TIME_TYPE");
        case "day":
          return t("DAY_TYPE");
        case "room":
          return t("AUDITORIUM_TYPE");
        default:
          return type;
      }
    };

    const getTranslatedValue = (value: string, type: string) => {
      if (type === "seat") {
        switch (value) {
          case "NORMAL":
            return t("SEAT_TYPE_NORMAL");
          case "VIP":
            return t("SEAT_TYPE_VIP");
          case "COUPLE":
            return t("SEAT_TYPE_COUPLE");
          default:
            return value;
        }
      }
      if (type === "graphics") {
        switch (value) {
          case "_2D":
            return t("GRAPHICS_TYPE_2D");
          case "_3D":
            return t("GRAPHICS_TYPE_3D");
          default:
            return value;
        }
      }
      if (type === "time") {
        switch (value) {
          case "SUAT_CHIEU_SOM":
            return t("SCREENING_TIME_EARLY");
          case "SUAT_CHIEU_THEO_LICH":
            return t("SCREENING_TIME_REGULAR");
          default:
            return value;
        }
      }
      if (type === "day") {
        switch (value) {
          case "WEEKDAY":
            return t("DAY_TYPE_WEEKDAY");
          case "WEEKEND":
            return t("DAY_TYPE_WEEKEND");
          case "HOLIDAY":
            return t("DAY_TYPE_HOLIDAY");
          default:
            return value;
        }
      }
      if (type === "room") {
        switch (value) {
          case "STANDARD":
            return t("AUDITORIUM_TYPE_STANDARD");
          case "IMAX":
            return t("AUDITORIUM_TYPE_IMAX");
          case "GOLDCLASS":
            return t("AUDITORIUM_TYPE_GOLDCLASS");
          default:
            return value;
        }
      }
      return value;
    };

    const getColor = (type: string, hasValue: boolean) => {
      if (!hasValue) return "default";

      switch (type) {
        case "seat":
          return "blue";
        case "graphics":
          return "purple";
        case "time":
          return "green";
        case "day":
          return "orange";
        case "room":
          return "red";
        default:
          return "default";
      }
    };

    const label = getLabel(type);

    if (!value) {
      return (
        <Tag
          color="default"
          style={{ fontSize: "11px", padding: "1px 4px", opacity: 0.6 }}
        >
          {label}: {t("ANY")}
        </Tag>
      );
    }

    return (
      <Tag
        color={getColor(type, true)}
        style={{ fontSize: "11px", padding: "1px 4px" }}
      >
        {label}: {getTranslatedValue(value, type)}
      </Tag>
    );
  };

  const [selectedConditions, setSelectedConditions] = React.useState<string[]>(
    []
  );

  const filterLabelMap: Record<string, string> = {
    NORMAL: "SEAT_TYPE_NORMAL",
    VIP: "SEAT_TYPE_VIP",
    COUPLE: "SEAT_TYPE_COUPLE",
    _2D: "GRAPHICS_TYPE_2D",
    _3D: "GRAPHICS_TYPE_3D",
    SUAT_CHIEU_SOM: "SCREENING_TIME_EARLY",
    SUAT_CHIEU_THEO_LICH: "SCREENING_TIME_REGULAR",
    WEEKDAY: "DAY_TYPE_WEEKDAY",
    WEEKEND: "DAY_TYPE_WEEKEND",
    HOLIDAY: "DAY_TYPE_HOLIDAY",
    STANDARD: "AUDITORIUM_TYPE_STANDARD",
    IMAX: "AUDITORIUM_TYPE_IMAX",
    GOLDCLASS: "AUDITORIUM_TYPE_GOLDCLASS",
  };

  const [filteredData, setFilteredData] = React.useState<PriceItem[]>(data);

  const handleTableChange = (_pagination: any, filters: any) => {
    const selected = filters.ticketConditions as string[] | null;
    setSelectedConditions(selected || []);

    if (selected && selected.length > 0) {
      const filteredData = data.filter((record) => {
        if (record.targetType !== "TICKET") return false;
        const conditions = [
          record.seatType,
          record.graphicsType,
          record.screeningTimeType,
          record.dayType,
          record.auditoriumType,
        ];
        return selected.every((v) => conditions.includes(v as any));
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(data);
    }
  };

  const columns: ColumnsType<PriceItem> = [
    // Status column - moved to first position
    {
      title: t("STATUS"),
      dataIndex: "status",
      key: "status",
      width: 70,
      align: "center" as const,
      filters: [
        { text: t("ACTIVE"), value: true },
        { text: t("INACTIVE"), value: false },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: boolean, record: PriceItem) => (
        <Switch
          size="small"
          checked={status}
          loading={isToggling}
          onChange={() => handleToggleStatus(record)}
        />
      ),
    },
    // Target Type column - conditionally rendered
    ...(!hideTargetType
      ? [
          {
            title: t("TARGET_TYPE"),
            dataIndex: "targetType",
            key: "targetType",
            width: 110,
            filters: [
              { text: t("TARGET_TYPE_TICKET"), value: "TICKET" },
              { text: t("TARGET_TYPE_PRODUCT"), value: "PRODUCT" },
              {
                text: t("TARGET_TYPE_ADDITIONAL_SERVICE"),
                value: "ADDITIONAL_SERVICE",
              },
            ],
            onFilter: (value: any, record: any) => record.targetType === value,
            render: (targetType: PriceTargetType) =>
              getTargetTypeTag(targetType),
          },
        ]
      : []),
    // Target Name column - conditionally rendered
    ...(!hideTargetName
      ? [
          {
            title: t("TARGET_NAME"),
            dataIndex: "targetId",
            key: "targetName",
            width: 150,
            ellipsis: {
              showTitle: false,
            },
            ...getColumnSearchProps("targetName"),
            onFilter: (value: any, record: any) => {
              const targetName = getTargetName(record);
              return (
                targetName &&
                targetName !== "-" &&
                targetName !== "N/A" &&
                targetName.toLowerCase().includes(value.toLowerCase())
              );
            },
            render: (_: any, record: PriceItem) => {
              const targetName = getTargetName(record);
              if (targetName === "-") {
                return <span style={{ color: "#999" }}>-</span>;
              }
              if (targetName === "N/A") {
                return <span style={{ color: "#999" }}>N/A</span>;
              }
              return (
                <span
                  title={targetName}
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {targetName}
                </span>
              );
            },
          },
        ]
      : []),

    // Ticket Conditions column - conditionally rendered
    ...(!hideTicketConditions
      ? [
          {
            title: () => (
              <Space wrap>
                <span>{t("TICKET_CONDITIONS")}</span>
                {selectedConditions.length > 0 && (
                  <Space wrap>
                    {selectedConditions.map((cond) => (
                      <Tag key={cond} color="blue" style={{ fontSize: "11px" }}>
                        {t(filterLabelMap[cond] || cond)}
                      </Tag>
                    ))}
                  </Space>
                )}
              </Space>
            ),
            key: "ticketConditions",
            width: 320,
            filters: [
              // Seat Type
              { text: t("SEAT_TYPE_NORMAL"), value: "NORMAL" },
              { text: t("SEAT_TYPE_VIP"), value: "VIP" },
              { text: t("SEAT_TYPE_COUPLE"), value: "COUPLE" },

              // Graphics Type
              { text: t("GRAPHICS_TYPE_2D"), value: "_2D" },
              { text: t("GRAPHICS_TYPE_3D"), value: "_3D" },

              // Screening Time Type
              { text: t("SCREENING_TIME_EARLY"), value: "SUAT_CHIEU_SOM" },
              {
                text: t("SCREENING_TIME_REGULAR"),
                value: "SUAT_CHIEU_THEO_LICH",
              },

              // Day Type
              { text: t("DAY_TYPE_WEEKDAY"), value: "WEEKDAY" },
              { text: t("DAY_TYPE_WEEKEND"), value: "WEEKEND" },
              { text: t("DAY_TYPE_HOLIDAY"), value: "HOLIDAY" },

              // Room Type
              { text: t("AUDITORIUM_TYPE_STANDARD"), value: "STANDARD" },
              { text: t("AUDITORIUM_TYPE_IMAX"), value: "IMAX" },
              { text: t("AUDITORIUM_TYPE_GOLDCLASS"), value: "GOLDCLASS" },
            ],
            filteredValue: selectedConditions || null,
            //   onFilter: (value: any, record: PriceItem) => {
            //     if (record.targetType !== "TICKET") return false;
            //     const conditions = [
            //       record.seatType,
            //       record.graphicsType,
            //       record.screeningTimeType,
            //       record.dayType,
            //       record.auditoriumType,
            //     ];
            //     return conditions.includes(value);
            //   },
            onFilterDropdownVisibleChange: (visible: boolean) => {
              if (!visible) return;
            },
            render: (_: any, record: PriceItem) => {
              if (record.targetType !== "TICKET") {
                return <span style={{ color: "#999" }}>-</span>;
              }

              return (
                <Space direction="vertical" size={1} style={{ width: "100%" }}>
                  <Space wrap size={[2, 1]}>
                    {renderDimension(record.seatType, "seat")}
                    {renderDimension(record.graphicsType, "graphics")}
                  </Space>
                  <Space wrap size={[2, 1]}>
                    {renderDimension(record.screeningTimeType, "time")}
                    {renderDimension(record.dayType, "day")}
                    {renderDimension(record.auditoriumType, "room")}
                  </Space>
                </Space>
              );
            },
          },
        ]
      : []),

    {
      title: t("PRICE"),
      dataIndex: "price",
      key: "price",
      width: 80,
      align: "right" as const,
      sorter: (a: any, b: any) => a.price - b.price,
      ...getColumnSearchProps("price"),
      render: (price: number) => formatCurrency(price),
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      width: 80,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: PriceItem) => (
        <Dropdown
          menu={{
            items: getActionMenuItems(record),
            onClick: handleMenuClick(record),
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<SettingOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ].filter(Boolean) as ColumnsType<PriceItem>;

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      loading={loading || isDeleting}
      scroll={{ x: 1000, y: 600 }}
      size="small"
      pagination={{
        total: data.length,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} ${t("OF")} ${total} ${t("ITEMS")}`,
        defaultPageSize: 20,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={handleTableChange}
    />
  );
};

export default PriceItemTable;
