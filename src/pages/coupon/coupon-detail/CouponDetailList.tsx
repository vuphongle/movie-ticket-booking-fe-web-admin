import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, theme } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCouponDetailsQuery } from "@/app/services/coupons.service";
import CouponDetailTable from "./CouponDetailTableSimple";
import CouponDetailModal from "./CouponDetailModalSimple";
import type { CouponDetail, Coupon } from "@/types";

interface CouponDetailListProps {
  couponId: number;
  coupon?: Coupon; // Add coupon prop
}

const CouponDetailList = ({ couponId, coupon }: CouponDetailListProps) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<
    CouponDetail | undefined
  >();

  const {
    data: couponDetails = [],
    isLoading,
    refetch,
  } = useGetCouponDetailsQuery(couponId);

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
        title={t("COUPON_DETAIL_LIST_TITLE")}
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
              {t("ADD_COUPON_DETAIL_BTN")}
            </Button>
          </Space>
        }
      >
        <CouponDetailTable
          data={couponDetails}
          loading={isLoading}
          onEdit={handleEdit}
          onRefresh={refetch}
        />
      </Card>

      {openModal && (
        <CouponDetailModal
          couponId={couponId}
          coupon={coupon}
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
