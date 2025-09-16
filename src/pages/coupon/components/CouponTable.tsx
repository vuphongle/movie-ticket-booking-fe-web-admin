import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteCouponMutation } from "../../../app/services/coupons.service";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";
import ModalUpdate from "./ModalUpdate";
import type { CouponTableProps, Coupon } from "@/types";

const CouponTable = ({ data }: CouponTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();
  const [open, setOpen] = useState(false);
  const [couponUpdate, setCouponUpdate] = useState<Coupon | null>(null);
  const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();

  const columns: ColumnsType<Coupon> = [
    {
      title: t("COUPON_TABLE_CODE"),
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
      render: (text: string) => {
        return text;
      },
    },
    {
      title: t("COUPON_TABLE_DISCOUNT"),
      dataIndex: "discount",
      key: "discount",
      sorter: (a: Coupon, b: Coupon) => a.discount - b.discount,
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return `${text}%`;
      },
    },
    {
      title: t("COUPON_TABLE_QUANTITY"),
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: Coupon, b: Coupon) => a.quantity - b.quantity,
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return text;
      },
    },
    {
      title: t("COUPON_TABLE_USED"),
      dataIndex: "used",
      key: "used",
      sorter: (a: Coupon, b: Coupon) => (a.used || 0) - (b.used || 0),
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return text || 0;
      },
    },
    {
      title: t("COUPON_TABLE_STATUS"),
      dataIndex: "status",
      key: "status",
      sorter: (a: Coupon, b: Coupon) => Number(a.status) - Number(b.status),
      sortDirections: ["descend", "ascend"],
      render: (_text: boolean, record: Coupon) => {
        if (record.status) {
          return <Tag color="success">{t("COUPON_STATUS_ACTIVE")}</Tag>;
        } else {
          return <Tag color="default">{t("COUPON_STATUS_INACTIVE")}</Tag>;
        }
      },
    },
    {
      title: t("COUPON_TABLE_VALIDITY_PERIOD"),
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a: Coupon, b: Coupon) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      sortDirections: ["descend", "ascend"],
      render: (_text: string, record: Coupon) => {
        return `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`;
      },
    },
    {
      title: t("COUPON_TABLE_ACTIONS"),
      dataIndex: "",
      key: "action",
      render: (_text: any, record: Coupon) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setCouponUpdate(record);
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

  const handleConfirm = (id: string) => {
    Modal.confirm({
      title: t("COUPON_DELETE_CONFIRM_TITLE"),
      content: t("COUPON_DELETE_CONFIRM_CONTENT"),
      okText: t("COUPON_DELETE_BTN"),
      okType: "danger",
      cancelText: t("COUPON_CANCEL_BTN"),
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteCoupon(id)
            .unwrap()
            .then(() => {
              message.success(t("COUPON_DELETE_SUCCESS"));
              resolve(); // Đóng modal sau khi xóa thành công
            })
            .catch((error: any) => {
              message.error(error.data?.message || t("COUPON_DELETE_ERROR"));
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

      {open && couponUpdate && (
        <ModalUpdate
          open={open}
          onCancel={() => setOpen(false)}
          coupon={couponUpdate}
        />
      )}
    </>
  );
};
export default CouponTable;
