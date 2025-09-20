import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Spin, theme } from "antd";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useGetCouponsQuery } from "@/app/services/coupons.service";
import AppBreadCrumb from "../../components/layout/AppBreadCrumb";
import CouponTable from "./components/CouponTable";
import ModalUpdate from "./components/ModalUpdate";
import type { CouponFilter } from "@/types";
import { getActiveStatus } from "../../utils/couponUtils";
import { useTranslation } from "react-i18next";

const CouponList = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();

  const { data, isLoading: isFetchingCoupons, refetch } = useGetCouponsQuery();

  // State for filtering
  const [filter] = useState<CouponFilter>({
    activeStatus: "ALL",
    hasEnabledDetails: undefined,
  });

  // State for modals - only keep create for quick access
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const breadcrumb = [{ label: "Quản lý khuyến mãi", href: "/admin/coupons" }];

  // Filter data based on current filter state
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((coupon) => {
      // Active status filter
      if (filter.activeStatus && filter.activeStatus !== "ALL") {
        if (getActiveStatus(coupon) !== filter.activeStatus) return false;
      }

      // Has enabled details filter - TODO: Implement when API available
      if (filter.hasEnabledDetails !== undefined) {
        // Temporarily skip this filter
        // const hasEnabled = coupon.enabledDetailsCount > 0;
        // if (hasEnabled !== filter.hasEnabledDetails) return false;
      }

      return true;
    });
  }, [data, filter]);

  if (isFetchingCoupons) {
    return <Spin size="large" />;
  }

  const handleRefresh = () => {
    refetch();
  };

  return (
    <>
      <Helmet>
        <title>Quản lý khuyến mãi</title>
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
        {/* Header Actions */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/coupons/create")}
              >
                Tạo khuyến mãi
              </Button>
              <Button
                style={{ backgroundColor: "rgb(0, 192, 239)" }}
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isFetchingCoupons}
              >
                {t("REFRESH")}
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Table */}
        <CouponTable data={filteredData} loading={isFetchingCoupons} />
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <ModalUpdate
          open={createModalOpen}
          onCancel={() => setCreateModalOpen(false)}
          onSuccess={() => setCreateModalOpen(false)}
        />
      )}
    </>
  );
};

export default CouponList;
