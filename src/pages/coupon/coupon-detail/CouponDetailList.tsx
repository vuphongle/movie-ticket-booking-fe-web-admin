import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, theme } from "antd";
import { useState } from "react";
import { useGetCouponDetailsQuery } from "@/app/services/coupons.service";
import CouponDetailTable from "./CouponDetailTable";
import CouponDetailModal from "./CouponDetailModal";
import type { CouponDetail } from "@/types";

interface CouponDetailListProps {
  couponId: number;
}

const CouponDetailList = ({ couponId }: CouponDetailListProps) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [openModal, setOpenModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<
    CouponDetail | undefined
  >();

  const { data: couponDetails = [], isLoading } =
    useGetCouponDetailsQuery(couponId);

  const handleAddNew = () => {
    setEditingDetail(undefined);
    setOpenModal(true);
  };

  const handleEdit = (detail: CouponDetail) => {
    setEditingDetail(detail);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDetail(undefined);
  };

  return (
    <>
      <Card
        title="Danh sách chi tiết coupon"
        style={{
          marginTop: 16,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Thêm chi tiết
            </Button>
          </Space>
        }
      >
        <CouponDetailTable
          couponId={couponId}
          data={couponDetails}
          loading={isLoading}
          onEdit={handleEdit}
        />
      </Card>

      {openModal && (
        <CouponDetailModal
          couponId={couponId}
          detail={editingDetail}
          open={openModal}
          onCancel={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default CouponDetailList;
