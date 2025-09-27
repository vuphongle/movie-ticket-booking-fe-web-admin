import { LeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Space,
  Spin,
  theme,
  Tabs,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Descriptions,
  Modal,
  message,
} from "antd";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useGetCouponByIdQuery,
  useDeleteCouponMutation,
  useGetCouponDetailsQuery,
} from "@/app/services/coupons.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import CouponModal from "../coupon-list/CouponModal";
import CouponDetailsTab from "./CouponDetailsTab";
import { formatDate } from "@/utils/functionUtils";
import { CouponKind } from "@/types";

const { Title, Text } = Typography;

const CouponDetail = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    data: coupon,
    isLoading: isFetchingCoupon,
    refetch: refetchCoupon,
  } = useGetCouponByIdQuery(Number(couponId));

  const {
    data: couponDetails = [],
    isLoading: isFetchingDetails,
    refetch: refetchDetails,
  } = useGetCouponDetailsQuery(Number(couponId));

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  if (!couponId || isNaN(Number(couponId))) {
    return <div>Invalid coupon ID</div>;
  }

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!coupon) return;

    Modal.confirm({
      title: "Delete Coupon",
      content: `Are you sure you want to delete coupon "${coupon.name}"? This action cannot be undone and will also delete all associated details and codes.`,
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteCoupon(coupon.id).unwrap();
          message.success("Coupon deleted successfully");
          navigate("/admin/coupons");
        } catch {
          message.error("Failed to delete coupon");
        }
      },
    });
  };

  const handleModalSuccess = () => {
    refetchCoupon();
    setEditModalOpen(false);
  };

  const getStatusTag = (
    status: boolean,
    startDate: string,
    endDate: string
  ) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!status) {
      return <Tag color="red">Inactive</Tag>;
    }

    if (now < start) {
      return <Tag color="orange">Scheduled</Tag>;
    }

    if (now > end) {
      return <Tag color="gray">Expired</Tag>;
    }

    return <Tag color="green">Active</Tag>;
  };

  const getKindTag = (kind: CouponKind) => {
    return kind === CouponKind.VOUCHER ? (
      <Tag color="green">Voucher</Tag>
    ) : (
      <Tag color="blue">Display</Tag>
    );
  };

  const breadcrumb = [
    { label: "Coupon Management", href: "/admin/coupons" },
    {
      label: coupon?.name || "Coupon Detail",
      href: `/admin/coupons/${couponId}/detail`,
    },
  ];

  if (isFetchingCoupon) {
    return <Spin size="large" fullscreen />;
  }

  if (!coupon) {
    return <div>Coupon not found</div>;
  }

  const tabItems = [
    {
      key: "details",
      label: `Coupon Details (${couponDetails.length})`,
      children: (
        <CouponDetailsTab
          couponId={Number(couponId)}
          coupon={coupon}
          details={couponDetails}
          loading={isFetchingDetails}
          onRefresh={refetchDetails}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{coupon.name} | Coupon Management | Admin</title>
      </Helmet>
      <AppBreadCrumb items={breadcrumb} />

      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <RouterLink to="/admin/coupons">
                <Button type="default" icon={<LeftOutlined />}>
                  Back to List
                </Button>
              </RouterLink>
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {coupon.name}
                </Title>
                <Space>
                  {getKindTag(coupon.kind)}
                  {getStatusTag(
                    coupon.status,
                    coupon.startDate,
                    coupon.endDate
                  )}
                  {coupon.code && (
                    <Tag color="purple" style={{ fontFamily: "monospace" }}>
                      {coupon.code}
                    </Tag>
                  )}
                </Space>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Edit Coupon
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={isDeleting}
              >
                Delete
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Coupon Info Section */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="ID">#{coupon.id}</Descriptions.Item>
          <Descriptions.Item label="Kind">
            {getKindTag(coupon.kind)}
          </Descriptions.Item>
          <Descriptions.Item label="Name">{coupon.name}</Descriptions.Item>
          <Descriptions.Item label="Code">
            {coupon.code ? (
              <Tag color="purple" style={{ fontFamily: "monospace" }}>
                {coupon.code}
              </Tag>
            ) : (
              <Text type="secondary">—</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            {getStatusTag(coupon.status, coupon.startDate, coupon.endDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {formatDate(coupon.startDate)}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {formatDate(coupon.endDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {coupon.createdAt ? formatDate(coupon.createdAt) : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {coupon.updatedAt ? formatDate(coupon.updatedAt) : "—"}
          </Descriptions.Item>
          {coupon.description && (
            <Descriptions.Item label="Description" span={2}>
              {coupon.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Tabs Section */}
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Tabs items={tabItems} />
      </div>

      <CouponModal
        open={editModalOpen}
        coupon={coupon}
        onCancel={() => setEditModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default CouponDetail;
