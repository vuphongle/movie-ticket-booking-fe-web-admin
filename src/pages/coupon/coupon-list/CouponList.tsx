import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCouponsQuery } from "@/app/services/coupons.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import CouponTable from "./CouponTable";
import CouponModal from "./CouponModal";
import type { Coupon } from "@/types";

const CouponList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, isLoading: isFetchingCoupons, refetch } = useGetCouponsQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleRefresh = () => {
    refetch();
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setEditingCoupon(null);
  };

  const breadcrumb = [
    { label: t("COUPON_LIST_BREADCRUMB"), href: "/admin/coupons" },
  ];

  if (isFetchingCoupons) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("COUPON_LIST_TITLE")}</title>
      </Helmet>
      <AppBreadCrumb items={breadcrumb} />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Space style={{ marginBottom: "1rem" }}>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            {t("COUPON_CREATE_BTN")}
          </Button>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isFetchingCoupons}
          >
            {t("COUPON_REFRESH_BTN")}
          </Button>
        </Space>

        <CouponTable
          data={data || []}
          loading={isFetchingCoupons}
          onEdit={handleEdit}
        />
      </div>

      <CouponModal
        open={modalOpen}
        coupon={editingCoupon}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default CouponList;
