import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SettingOutlined,
  CopyOutlined,
  InboxOutlined,
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
  useCreatePriceListMutation,
} from "@/app/services/priceList.service";
import { formatDateTime } from "@/utils/functionUtils";
import type { PriceList } from "@/types";

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
  const [createPriceList, { isLoading: isCloning }] =
    useCreatePriceListMutation();

  const handleClone = (priceList: PriceList) => {
    Modal.confirm({
      title: t("CLONE_CONFIRM_TITLE"),
      content: t("CLONE_CONFIRM_CONTENT", { name: priceList.name }),
      okText: t("OK_TEXT"),
      cancelText: t("CANCEL_TEXT"),
      onOk: () => {
        const cloneData = {
          name: `${priceList.name} (Copy)`,
          priority: priceList.priority + 1, // Slightly lower priority
          status: false, // Start as inactive
          validFrom: priceList.validFrom,
          validTo: priceList.validTo,
        };

        createPriceList(cloneData)
          .unwrap()
          .then(() => {
            message.success(t("CLONE_SUCCESS"));
          })
          .catch((error: any) => {
            message.error(error.data?.message || t("CLONE_ERROR"));
          });
      },
    });
  };

  const handleArchive = (priceList: PriceList) => {
    const action = priceList.status ? "ARCHIVE" : "UNARCHIVE";
    Modal.confirm({
      title: t(`${action}_CONFIRM_TITLE`),
      content: t(`${action}_CONFIRM_CONTENT`, { name: priceList.name }),
      okText: t("OK_TEXT"),
      cancelText: t("CANCEL_TEXT"),
      onOk: () => handleToggleStatus(priceList),
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
        <RouterLink to={`/admin/price-lists/${priceList.id}`}>
          <Space>
            <EyeOutlined />
            {t("VIEW_DETAILS")}
          </Space>
        </RouterLink>
      ),
    },
    {
      key: "edit",
      label: (
        <Space
          onClick={() =>
            message.info(t("FEATURE_COMING_SOON") || "Feature coming soon")
          }
        >
          <EditOutlined />
          {t("EDIT")}
        </Space>
      ),
    },
    {
      key: "clone",
      label: (
        <Space onClick={() => handleClone(priceList)}>
          <CopyOutlined />
          {t("CLONE")}
        </Space>
      ),
    },
    {
      key: "archive",
      label: (
        <Space onClick={() => handleArchive(priceList)}>
          <InboxOutlined />
          {priceList.status ? t("ARCHIVE") : t("UNARCHIVE")}
        </Space>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: (
        <Space onClick={() => handleDelete(priceList)}>
          <DeleteOutlined />
          {t("DELETE")}
        </Space>
      ),
      danger: true,
    },
  ];

  const columns: ColumnsType<PriceList> = [
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
      title: t("PRIORITY"),
      dataIndex: "priority",
      key: "priority",
      width: 80,
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
              <strong>{t("FROM")}:</strong> {formatDateTime(record.validFrom)}
            </small>
          )}
          {record.validTo && (
            <small>
              <strong>{t("TO")}:</strong> {formatDateTime(record.validTo)}
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
      render: (_, record: PriceList) => (
        <Tag color="blue">{record.priceItems?.length || 0}</Tag>
      ),
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
      width: 60,
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
