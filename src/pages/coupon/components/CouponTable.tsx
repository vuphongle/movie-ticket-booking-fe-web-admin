import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useDeleteCouponMutation } from "../../../app/services/coupons.service";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";
import ModalUpdate from "./ModalUpdate";
import type { CouponTableProps, Coupon } from "@/types";

const CouponTable = ({ data }: CouponTableProps) => {
  const { getColumnSearchProps } = useSearchTable();
  const [open, setOpen] = useState(false);
  const [couponUpdate, setCouponUpdate] = useState<Coupon | null>(null);
  const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();

  const columns: ColumnsType<Coupon> = [
    {
      title: "Mã khuyến mại",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
      render: (text: string) => {
        return text;
      },
    },
    {
      title: "Phần trăm giảm giá",
      dataIndex: "discount",
      key: "discount",
      sorter: (a: Coupon, b: Coupon) => a.discount - b.discount,
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return `${text}%`;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: Coupon, b: Coupon) => a.quantity - b.quantity,
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return text;
      },
    },
    {
      title: "Đã sử dụng",
      dataIndex: "used",
      key: "used",
      sorter: (a: Coupon, b: Coupon) => (a.used || 0) - (b.used || 0),
      sortDirections: ["descend", "ascend"],
      render: (text: number) => {
        return text || 0;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: Coupon, b: Coupon) => Number(a.status) - Number(b.status),
      sortDirections: ["descend", "ascend"],
      render: (_text: boolean, record: Coupon) => {
        if (record.status) {
          return <Tag color="success">Kích hoạt</Tag>;
        } else {
          return <Tag color="default">Ẩn</Tag>;
        }
      },
    },
    {
      title: "Thời gian áp dụng",
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
      title: "",
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
      title: "Bạn có chắc chắn muốn xóa khuyến mại này?",
      content: "Hành động này không thể hoàn tác!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteCoupon(id)
            .unwrap()
            .then(() => {
              message.success("Xóa khuyến mại thành công!");
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
