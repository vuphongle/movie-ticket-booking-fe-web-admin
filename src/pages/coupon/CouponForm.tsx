import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  message,
  theme,
  Divider,
  Typography,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useGetCouponByIdQuery,
} from "@/app/services/coupons.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import type { UpsertCouponRequest, Coupon } from "@/types";
import { CouponType, CouponStatus, CouponStackingPolicy } from "@/types";

const { Title } = Typography;

interface LocationState {
  coupon?: Coupon;
}

const CouponForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { t } = useTranslation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu từ state trước, nếu không có thì gọi API
  const stateData = (location.state as LocationState)?.coupon;

  // API hooks
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const {
    data: apiData,
    isLoading: isFetchingCoupon,
    error: fetchError,
  } = useGetCouponByIdQuery(parseInt(id!), {
    skip: !isEdit || !!stateData, // Skip API call if we have data from state
  });

  // Sử dụng dữ liệu từ state hoặc API
  const couponData = stateData || apiData;

  const breadcrumb = [
    { label: t("COUPON_LIST_TITLE"), href: "/admin/coupons" },
    {
      label: isEdit
        ? t("COUPON_UPDATE_MODAL_TITLE")
        : t("COUPON_CREATE_MODAL_TITLE"),
      href: "#",
    },
  ];

  // Fill form when editing
  useEffect(() => {
    if (isEdit && couponData) {
      form.setFieldsValue({
        code: couponData.code,
        name: couponData.name,
        description: couponData.description,
        status: couponData.status,
        startAt: couponData.startAt ? dayjs(couponData.startAt) : null,
        endAt: couponData.endAt ? dayjs(couponData.endAt) : null,
      });
    } else if (!isEdit) {
      // Set default values for new coupon
      form.setFieldsValue({
        status: false, // Always false for new coupons
      });
    }
  }, [isEdit, couponData, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: UpsertCouponRequest = {
        type: CouponType.DISCOUNT, // Default to DISCOUNT
        code: values.code,
        name: values.name,
        description: values.description,
        status: isEdit
          ? values.status
            ? CouponStatus.ACTIVE
            : CouponStatus.INACTIVE
          : CouponStatus.INACTIVE, // Convert boolean to enum
        visible: true, // Default visible
        stackingPolicy: CouponStackingPolicy.EXCLUSIVE, // Default stacking policy
        startAt: values.startAt ? values.startAt.toISOString() : "",
        endAt: values.endAt ? values.endAt.toISOString() : "",
      };

      let result;
      let updatedCoupon;

      if (isEdit && couponData) {
        result = await updateCoupon({ id: couponData.id, ...payload }).unwrap();
        message.success(t("COUPON_UPDATE_SUCCESS"));

        // Tạo updated coupon object với dữ liệu mới
        updatedCoupon = {
          ...couponData,
          ...payload,
        };
      } else {
        result = await createCoupon(payload).unwrap();
        message.success(t("COUPON_CREATE_SUCCESS"));

        // Tạo coupon object từ result (API trả về Coupon, cần add derived fields)
        updatedCoupon = {
          ...result, // Includes id, code, name, description, status, startDate, endDate, createdAt, updatedAt, createdBy, updatedBy
          // Add derived fields for display
          activeStatus: "HIDDEN" as const, // Always hidden for new coupons
          enabledDetailsCount: 0,
          totalDetailsCount: 0,
          aggregateUsedCount: 0,
          timeWindow:
            result.startAt && result.endAt
              ? `${new Date(result.startAt).toLocaleDateString()} - ${new Date(result.endAt).toLocaleDateString()}`
              : "",
        };
      }

      // Redirect to coupon detail page
      const couponId = isEdit ? couponData!.id : result.id;
      navigate(`/admin/coupons/${couponId}/detail`, {
        state: { coupon: updatedCoupon },
      });
    } catch (error: any) {
      message.error(error.data?.message || t("COUPON_CREATE_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/coupons");
  };

  const handleManageDetails = () => {
    if (isEdit && couponData) {
      navigate(`/admin/coupons/${couponData.id}/detail`, {
        state: { coupon: couponData },
      });
    }
  };

  // Only show loading if we're fetching and don't have state data
  if (isFetchingCoupon && !stateData) {
    return (
      <Spin
        size="large"
        style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
      />
    );
  }

  // Only show error if we don't have state data
  if (isEdit && fetchError && !stateData) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message={t("COUPON_FETCH_ERROR")}
          description={t("COUPON_FETCH_ERROR")}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {isEdit
            ? t("COUPON_UPDATE_MODAL_TITLE")
            : t("COUPON_CREATE_MODAL_TITLE")}
        </title>
      </Helmet>

      <AppBreadCrumb items={breadcrumb} />

      <div style={{ padding: 24 }}>
        {/* Header */}
        <Card style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleCancel}
                  type="text"
                >
                  {t("BACK_TO_LIST")}
                </Button>
                <Divider type="vertical" />
                <Title level={4} style={{ margin: 0 }}>
                  {isEdit
                    ? t("COUPON_UPDATE_MODAL_TITLE")
                    : t("COUPON_CREATE_MODAL_TITLE")}
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                {isEdit && couponData && (
                  <Button
                    icon={<SettingOutlined />}
                    onClick={handleManageDetails}
                    type="default"
                  >
                    {t("ADD_COUPON_DETAIL")}
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => form.submit()}
                  loading={loading}
                >
                  {isEdit ? t("COUPON_UPDATE_BTN") : t("COUPON_CREATE_BTN")}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Form */}
        <Card
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={loading}
            size="large"
          >
            <Row gutter={24}>
              {/* Left Column */}
              <Col xs={24} lg={12}>
                <Form.Item
                  label={t("COUPON_CODE_LABEL")}
                  name="code"
                  rules={[
                    { required: true, message: t("COUPON_CODE_REQUIRED") },
                    {
                      min: 3,
                      message: t("COUPON_CODE_MIN_LENGTH"),
                    },
                    {
                      max: 50,
                      message: t("COUPON_CODE_MAX_LENGTH"),
                    },
                    {
                      pattern: /^[a-zA-Z0-9_-]+$/,
                      message: t("COUPON_CODE_PATTERN"),
                    },
                  ]}
                  extra={t("COUPON_CODE_EXTRA")}
                >
                  <Input
                    placeholder={t("COUPON_CODE_PLACEHOLDER")}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      const cleanValue = value.replace(/[^A-Z0-9_-]/g, "");
                      form.setFieldValue("code", cleanValue);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={t("COUPON_NAME_LABEL")}
                  name="name"
                  rules={[
                    { required: true, message: t("COUPON_NAME_REQUIRED") },
                    { min: 3, message: t("COUPON_NAME_MIN_LENGTH") },
                    {
                      max: 200,
                      message: t("COUPON_NAME_MAX_LENGTH"),
                    },
                  ]}
                  extra={t("COUPON_NAME_EXTRA")}
                >
                  <Input placeholder={t("COUPON_NAME_PLACEHOLDER")} />
                </Form.Item>

                <Form.Item
                  label={t("COUPON_DESCRIPTION_LABEL")}
                  name="description"
                  rules={[
                    { max: 1000, message: t("COUPON_DESCRIPTION_MAX_LENGTH") },
                  ]}
                  extra={t("COUPON_DESCRIPTION_EXTRA")}
                >
                  <Input.TextArea
                    placeholder={t("COUPON_DESCRIPTION_PLACEHOLDER")}
                    rows={4}
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>

              {/* Right Column */}
              <Col xs={24} lg={12}>
                <Form.Item
                  label={t("COUPON_STATUS_LABEL")}
                  name="status"
                  rules={[
                    { required: true, message: t("COUPON_STATUS_REQUIRED") },
                  ]}
                  extra={
                    isEdit
                      ? t("COUPON_STATUS_EXTRA_EDIT")
                      : t("COUPON_STATUS_EXTRA_CREATE")
                  }
                  style={{ display: isEdit ? "block" : "none" }}
                >
                  <Select
                    placeholder={t("COUPON_STATUS_PLACEHOLDER")}
                    disabled={!isEdit}
                    options={[
                      {
                        label: t("COUPON_STATUS_ACTIVE"),
                        value: true,
                        extra: t("COUPON_STATUS_ACTIVE_EXTRA"),
                      },
                      {
                        label: t("COUPON_STATUS_INACTIVE"),
                        value: false,
                        extra: t("COUPON_STATUS_INACTIVE_EXTRA"),
                      },
                    ]}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={t("COUPON_START_DATE_LABEL")}
                      name="startDate"
                      rules={[
                        {
                          required: true,
                          message: t("COUPON_START_DATE_REQUIRED"),
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder={t("SELECT_START_DATE")}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t("COUPON_END_DATE_LABEL")}
                      name="endDate"
                      dependencies={["startDate"]}
                      rules={[
                        {
                          required: true,
                          message: t("COUPON_END_DATE_REQUIRED"),
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const startDate = getFieldValue("startDate");
                            if (!value || !startDate) {
                              return Promise.resolve();
                            }
                            if (value.isBefore(startDate)) {
                              return Promise.reject(
                                new Error(t("COUPON_END_DATE_AFTER_START")),
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder={t("SELECT_END_DATE")}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Info Alert */}
                <Alert
                  message={t("NEXT_STEP")}
                  description={
                    isEdit
                      ? t("NEXT_STEP_EDIT_DESC")
                      : t("NEXT_STEP_CREATE_DESC")
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />

                {!isEdit && (
                  <Alert
                    message={t("NOTE")}
                    description={t("NOTE_CREATE_DESC")}
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default CouponForm;
