import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Spin,
  theme,
  Switch,
} from "antd";
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
  const [filter, setFilter] = useState<CouponFilter>({
    search: "",
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
      // Search filter (code/name)
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchCode = coupon.code.toLowerCase().includes(searchLower);
        const matchName = coupon.name.toLowerCase().includes(searchLower);
        if (!matchCode && !matchName) return false;
      }

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

  const handleFilterChange = (key: keyof CouponFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilter({
      search: "",
      activeStatus: "ALL",
      hasEnabledDetails: undefined,
    });
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

        {/* Filter Section */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="Tìm theo mã hoặc tên..."
                prefix={<SearchOutlined />}
                value={filter.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Trạng thái"
                value={filter.activeStatus}
                onChange={(value) => handleFilterChange("activeStatus", value)}
                options={[
                  { label: "Tất cả", value: "ALL" },
                  { label: "Kích hoạt", value: "ACTIVE" },
                  { label: "Ẩn", value: "HIDDEN" },
                  { label: "Hết hạn", value: "EXPIRED" },
                ]}
              />
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Space>
                <span>Có details enabled:</span>
                <Switch
                  checked={filter.hasEnabledDetails}
                  onChange={(checked) =>
                    handleFilterChange(
                      "hasEnabledDetails",
                      checked ? true : undefined
                    )
                  }
                  checkedChildren="Có"
                  unCheckedChildren="Tất cả"
                />
              </Space>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Button icon={<FilterOutlined />} onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>

          <Row style={{ marginTop: 8 }}>
            <Col span={24}>
              <span style={{ color: "#666", fontSize: "12px" }}>
                Hiển thị {filteredData.length} / {data?.length || 0} mục
              </span>
            </Col>
          </Row>
        </Card>

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
