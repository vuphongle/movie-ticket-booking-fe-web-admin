import { Table, Tag, Button, Popconfirm, Space, Tooltip, Modal } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "@/hooks/useSearchTable";
import { formatDate } from "@/utils/functionUtils";
import { getUnitLabel } from "@/utils/productUtils";
import {
  useDeleteProductMutation,
  useToggleProductStatusMutation,
  useLazyCheckCanDeactivateProductQuery,
} from "@/app/services/products.service";
import { message } from "antd";
import type { Product } from "@/types";

interface ProductTableProps {
  data?: Product[];
}

const ProductTable = ({ data }: ProductTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleProductStatusMutation();
  const [checkCanDeactivate] = useLazyCheckCanDeactivateProductQuery();

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProduct(id).unwrap();
      message.success(t("DELETE_SUCCESS"));
    } catch (error: any) {
      message.error(error?.data?.message || t("DELETE_FAILED"));
    }
  };

  const handleToggleStatus = async (
    id: string | number,
    currentStatus: boolean
  ) => {
    try {
      // Nếu đang chuyển từ active sang inactive, kiểm tra trước
      if (currentStatus) {
        const result = await checkCanDeactivate(Number(id)).unwrap();
        if (!result.canDeactivate) {
          Modal.confirm({
            title: t("CANNOT_DEACTIVATE_PRODUCT"),
            content: t("PRODUCT_IN_USE_MESSAGE"),
            okText: t("OK"),
            cancelText: t("CANCEL"),
            onOk: () => {
              // User acknowledges, do nothing
            },
          });
          return;
        }
      }

      await toggleStatus(id).unwrap();
      message.success(t("UPDATE_SUCCESS"));
    } catch (error: any) {
      message.error(error?.data?.message || t("UPDATE_FAILED"));
    }
  };

  const columns = [
    {
      title: t("PRODUCT_SKU"),
      dataIndex: "sku",
      key: "sku",
      width: "12%",
      ...getColumnSearchProps("sku"),
      render: (text: string, record: Product) => {
        return (
          <RouterLink to={`/admin/products/${record.id}/detail`}>
            <strong>{text}</strong>
          </RouterLink>
        );
      },
    },
    {
      title: t("PRODUCT_NAME"),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string, record: Product) => {
        return (
          <RouterLink to={`/admin/products/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: t("DESCRIPTION"),
      dataIndex: "description",
      key: "description",
      width: "25%",
      render: (text: string) => {
        if (!text) return "-";
        const truncated =
          text.length > 100 ? `${text.substring(0, 100)}...` : text;
        return <Tooltip title={text}>{truncated}</Tooltip>;
      },
    },
    {
      title: t("UNIT"),
      dataIndex: "unit",
      key: "unit",
      width: "8%",
      ...getColumnSearchProps("unit"),
      render: (text: string) => getUnitLabel(text, t),
    },
    {
      title: t("QUANTITY"),
      dataIndex: "quantity",
      key: "quantity",
      width: "8%",
      align: "center" as const,
      sorter: (a: Product, b: Product) => (a.quantity || 0) - (b.quantity || 0),
      render: (quantity: number) => {
        return quantity !== undefined ? quantity : "-";
      },
    },
    {
      title: t("STATUS"),
      dataIndex: "status",
      key: "status",
      width: "10%",
      sorter: (a: Product, b: Product) => {
        return (a.status ? 1 : 0) - (b.status ? 1 : 0);
      },
      render: (status: boolean, record: Product) => {
        return (
          <Tag
            color={status ? "success" : "warning"}
            style={{ cursor: "pointer" }}
            onClick={() => handleToggleStatus(record.id, status)}
          >
            {status ? t("ACTIVE") : t("INACTIVE")}
          </Tag>
        );
      },
    },
    {
      title: t("CREATED_AT"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: "12%",
      sorter: (a: Product, b: Product) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
      render: (text: string) => {
        return formatDate(text);
      },
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      width: "12%",
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title={t("VIEW_DETAIL")}>
            <RouterLink to={`/admin/products/${record.id}/detail`}>
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                style={{ color: "#1890ff" }}
              />
            </RouterLink>
          </Tooltip>

          <Tooltip title={t("DELETE")}>
            <Popconfirm
              title={t("DELETE_CONFIRM")}
              description={t("ACTION_CANNOT_UNDONE")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("DELETE")}
              cancelText={t("CANCEL")}
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
                loading={isDeleting}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data || []}
      rowKey={(record: Product) => record.id}
      scroll={{ x: 1000 }}
      loading={isToggling}
    />
  );
};

export default ProductTable;
