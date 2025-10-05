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
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const CouponDetail = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();

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
    return <div>{t("COUPON_INVALID_ID")}</div>;
  }

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!coupon) return;

    Modal.confirm({
      title: t("COUPON_DELETE_CONFIRM_TITLE"),
      content: t("COUPON_DELETE_WITH_DETAILS_CONFIRM_MESSAGE", {
        name: coupon.name,
      }),
      okText: t("DELETE"),
      cancelText: t("CANCEL"),
      okType: "danger",
      onOk: async () => {
        try {
          await deleteCoupon(coupon.id).unwrap();
          message.success(t("COUPON_DELETE_SUCCESS"));
          navigate("/admin/coupons");
        } catch {
          message.error(t("COUPON_DELETE_ERROR"));
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
    endDate: string,
  ) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!status) {
      return <Tag color="red">{t("COUPON_STATUS_INACTIVE")}</Tag>;
    }

    if (now < start) {
      return <Tag color="orange">{t("COUPON_STATUS_UPCOMING")}</Tag>;
    }

    if (now > end) {
      return <Tag color="gray">{t("COUPON_STATUS_EXPIRED")}</Tag>;
    }

    return <Tag color="green">{t("COUPON_STATUS_ACTIVE")}</Tag>;
  };

  const getKindTag = (kind: CouponKind) => {
    return kind === CouponKind.VOUCHER ? (
      <Tag color="green">{t("COUPON_KIND_VOUCHER")}</Tag>
    ) : (
      <Tag color="blue">{t("COUPON_KIND_DISPLAY")}</Tag>
    );
  };

  const breadcrumb = [
    { label: t("COUPON_LIST_BREADCRUMB"), href: "/admin/coupons" },
    {
      label: coupon?.name || t("COUPON_DETAIL_TITLE"),
      href: `/admin/coupons/${couponId}/detail`,
    },
  ];

  if (isFetchingCoupon) {
    return <Spin size="large" fullscreen />;
  }

  if (!coupon) {
    return <div>{t("COUPON_NOT_FOUND")}</div>;
  }

  const tabItems = [
    {
      key: "details",
      label: `${t("COUPON_DETAIL_LIST_TITLE")} (${couponDetails.length})`,
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
        <title>
          {coupon.name
            ? `${coupon.name} | ${t("COUPON_DETAIL_TITLE")}`
            : t("COUPON_DETAIL_TITLE")}
        </title>
      </Helmet>
      <AppBreadCrumb items={breadcrumb} />

      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <RouterLink to="/admin/coupons">
                <Button type="default" icon={<LeftOutlined />}>
                  {t("BACK_TO_LIST")}
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
                    coupon.endDate,
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
                {t("EDIT_COUPON")}
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={isDeleting}
              >
                {t("DELETE")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Coupon Info Section */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t("ID")}>#{coupon.id}</Descriptions.Item>
          <Descriptions.Item label={t("COUPON_KIND_LABEL")}>
            {getKindTag(coupon.kind)}
          </Descriptions.Item>
          <Descriptions.Item label={t("COUPON_NAME_LABEL")}>
            {coupon.name}
          </Descriptions.Item>
          <Descriptions.Item label={t("COUPON_CODE_LABEL")}>
            {coupon.code ? (
              <Tag color="purple" style={{ fontFamily: "monospace" }}>
                {coupon.code}
              </Tag>
            ) : (
              <Text type="secondary">—</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("COUPON_STATUS_LABEL")} span={2}>
            {getStatusTag(coupon.status, coupon.startDate, coupon.endDate)}
          </Descriptions.Item>
          <Descriptions.Item label={t("COUPON_START_DATE_LABEL")}>
            {formatDate(coupon.startDate)}
          </Descriptions.Item>
          <Descriptions.Item label={t("COUPON_END_DATE_LABEL")}>
            {formatDate(coupon.endDate)}
          </Descriptions.Item>
          <Descriptions.Item label={t("CREATED_AT")}>
            {coupon.createdAt ? formatDate(coupon.createdAt) : "—"}
          </Descriptions.Item>
          <Descriptions.Item label={t("UPDATED_AT")}>
            {coupon.updatedAt ? formatDate(coupon.updatedAt) : "—"}
          </Descriptions.Item>
          {coupon.description && (
            <Descriptions.Item label={t("COUPON_DESCRIPTION_LABEL")} span={2}>
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
