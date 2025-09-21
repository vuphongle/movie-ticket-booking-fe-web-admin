import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  CopyOutlined,
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
import { Link as RouterLink } from "react-router-dom";
import {
  useDeletePriceListMutation,
  useTogglePriceListStatusMutation,
  useClonePriceListMutation,
} from "@/app/services/priceList.service";
import { formatDateTime, formatDate } from "@/utils/functionUtils";
import type { PriceList } from "@/types";
import PriceItemsCount from "./components/PriceItemsCount";

interface PriceListTableProps {
  data: PriceList[];
  loading?: boolean;
}

const PriceListTable = ({ data, loading }: PriceListTableProps) => {
  const { t } = useTranslation();

  const [deletePriceList, { isLoading: isDeleting }] =
    useDeletePriceListMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useTogglePriceListStatusMutation();
  const [clonePriceList, { isLoading: isCloning }] =
    useClonePriceListMutation();

  const handleClone = (priceList: PriceList) => {
    Modal.confirm({
      title: t("CLONE_CONFIRM_TITLE"),
      content: (
        <div>
          <p>{t("CLONE_CONFIRM_CONTENT", { name: priceList.name })}</p>
          <div
            style={{
              marginTop: 12,
              padding: 8,
              background: "#f0f0f0",
              borderRadius: 4,
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
              <strong>
                {t("CLONE")} {t("NAME")}:
              </strong>{" "}
              {priceList.name} (Copy)
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
              <strong>{t("STATUS")}:</strong> {t("INACTIVE")} (
              {t("CAN_ACTIVATE_LATER")})
            </p>
          </div>
        </div>
      ),
      okText: t("CLONE"),
      cancelText: t("CANCEL_TEXT"),
      okType: "primary",
      onOk: () => {
        const cloneData = {
          id: priceList.id,
          name: `${priceList.name} (Copy)`,
          priority: priceList.priority + 1, // Slightly lower priority
          status: false, // Start as inactive
          validFrom: priceList.validFrom,
          validTo: priceList.validTo,
        };

        return clonePriceList(cloneData)
          .unwrap()
          .then(() => {
            message.success(t("CLONE_SUCCESS"));
          })
          .catch((error: any) => {
            message.error(error.data?.message || t("CLONE_ERROR"));
            throw error; // Re-throw to keep modal open on error
          });
      },
    });
  };

  const handleDelete = (priceList: PriceList) => {
    Modal.confirm({
      title: t("DELETE_CONFIRM_TITLE"),
      content: t("DELETE_CONFIRM_CONTENT", { name: priceList.name }),
      okText: t("OK_TEXT"),
      cancelText: t("CANCEL_TEXT"),
      okType: "danger",
      onOk: () => {
        deletePriceList(priceList.id)
          .unwrap()
          .then(() => {
            message.success(t("DELETE_SUCCESS"));
          })
          .catch((error: any) => {
            message.error(error.data?.message || t("DELETE_ERROR"));
          });
      },
    });
  };

  const handleToggleStatus = (priceList: PriceList) => {
    toggleStatus(priceList.id)
      .unwrap()
      .then(() => {
        message.success(t("UPDATE_STATUS_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data?.message || t("UPDATE_STATUS_ERROR"));
      });
  };

  const getActionMenuItems = (priceList: PriceList): MenuProps["items"] => [
    {
      key: "view",
      label: (
        <RouterLink to={`/admin/price-lists/${priceList.id}/detail`}>
          <Space>
            <EyeOutlined />
            {t("VIEW_DETAILS")}
          </Space>
        </RouterLink>
      ),
    },
    {
      key: "clone",
      label: (
        <Space>
          <CopyOutlined />
          {t("CLONE")}
        </Space>
      ),
      onClick: () => handleClone(priceList),
    },
    {
      type: "divider",
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
      onClick: () => handleDelete(priceList),
    },
  ];

  const columns: ColumnsType<PriceList> = [
    {
      title: t("STATUS"),
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: t("ACTIVE"), value: true },
        { text: t("INACTIVE"), value: false },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: boolean, record: PriceList) => (
        <Space direction="vertical" size={4} align="center">
          <Switch
            size="small"
            checked={status}
            loading={isToggling}
            onChange={() => handleToggleStatus(record)}
          />
        </Space>
      ),
    },
    {
      title: t("NAME"),
      dataIndex: "name",
      key: "name",
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name, "vi"),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: PriceList) => (
        <Space direction="vertical" size={0}>
          <RouterLink to={`/admin/price-lists/${record.id}/detail`}>
            <strong style={{ color: "#1890ff" }}>{text}</strong>
          </RouterLink>
        </Space>
      ),
    },
    {
      title: t("PRIORITY"),
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center",
      sorter: (a, b) => a.priority - b.priority,
      sortDirections: ["ascend", "descend"],
      render: (priority: number) => (
        <Tag
          color={priority >= 100 ? "red" : priority >= 50 ? "orange" : "blue"}
        >
          {priority}
        </Tag>
      ),
    },
    {
      title: t("VALIDITY_PERIOD"),
      key: "validity",
      width: 220,
      render: (_, record: PriceList) => (
        <Space direction="vertical" size={0}>
          {record.validFrom && (
            <small>
              <strong>{t("FROM")}:</strong> {formatDate(record.validFrom)}
            </small>
          )}
          {record.validTo && (
            <small>
              <strong>{t("TO")}:</strong> {formatDate(record.validTo)}
            </small>
          )}
          {!record.validFrom && !record.validTo && (
            <small style={{ color: "#666" }}>{t("NO_TIME_LIMIT")}</small>
          )}
        </Space>
      ),
    },
    {
      title: t("PRICE_ITEMS_COUNT"),
      key: "priceItemsCount",
      width: 100,
      align: "center",
      render: (_, record: PriceList) => <PriceItemsCount priceList={record} />,
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ["ascend", "descend"],
      render: (text: string) => formatDateTime(text),
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record: PriceList) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<SettingOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading || isDeleting || isCloning}
        scroll={{ x: 950 }}
        size="small"
        pagination={{
          total: data.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} ${t("OF")} ${total} ${t("ITEMS")}`,
        }}
      />

      {/* TODO: Implement PriceListFormModal */}
      {/*
      <PriceListFormModal
        open={open}
        priceList={editingPriceList}
        onCancel={() => {
          setOpen(false);
          setEditingPriceList(null);
        }}
        onSuccess={() => {
          setOpen(false);
          setEditingPriceList(null);
        }}
      />
      */}
    </>
  );
};

export default PriceListTable;
