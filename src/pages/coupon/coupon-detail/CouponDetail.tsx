import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  theme,
  DatePicker,
} from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  useDeleteCouponMutation,
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} from "@/app/services/coupons.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import CouponDetailList from "./CouponDetailList";

const CouponDetail = () => {
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { couponId } = useParams<{ couponId: string }>();
  const { data: coupon, isLoading: isFetchingCoupon } = useGetCouponByIdQuery(
    parseInt(couponId!)
  );

  const [updateCoupon, { isLoading: isLoadingUpdateCoupon }] =
    useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isLoadingDeleteCoupon }] =
    useDeleteCouponMutation();

  // Force re-render when language changes
  useEffect(() => {
    if (coupon && !isFetchingCoupon) {
      try {
        form.setFieldsValue({
          code: coupon.code || "",
          name: coupon.name || "",
          description: coupon.description || "",
          status: Boolean(coupon.status),
          startDate: coupon.startDate ? dayjs(coupon.startDate) : null,
          endDate: coupon.endDate ? dayjs(coupon.endDate) : null,
        });
      } catch {
        // Handle date parsing errors gracefully
        form.setFieldsValue({
          code: coupon.code || "",
          name: coupon.name || "",
          description: coupon.description || "",
          status: Boolean(coupon.status),
          startDate: null,
          endDate: null,
        });
      }
    }
  }, [coupon, isFetchingCoupon, form]);

  const breadcrumb = [
    { label: t("COUPON_LIST_TITLE"), href: "/admin/coupons" },
    {
      label: coupon?.name || t("COUPON_DETAIL_TITLE"),
      href: `/admin/coupons/${coupon?.id}/detail`,
    },
  ];

  if (isFetchingCoupon) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }

  const handleUpdate = (values: any) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate
        ? values.startDate.format("YYYY-MM-DD")
        : null,
      endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
    };

    updateCoupon({
      id: parseInt(couponId!),
      ...formattedValues,
    })
      .unwrap()
      .then(() => {
        message.success(t("COUPON_UPDATE_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data?.message || t("COUPON_UPDATE_ERROR"));
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t("COUPON_DELETE_CONFIRM_TITLE"),
      content: t("COUPON_DELETE_CONFIRM_CONTENT"),
      okText: t("COUPON_DELETE_BTN"),
      okType: "danger",
      cancelText: t("COUPON_CANCEL_BTN"),
      onOk: () => {
        deleteCoupon(parseInt(couponId!))
          .unwrap()
          .then((_data) => {
            message.success(t("COUPON_DELETE_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/coupons");
            }, 1500);
          })
          .catch((error) => {
            message.error(error.data?.message || t("COUPON_DELETE_ERROR"));
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
      <Helmet>
        <title>{coupon?.name || t("COUPON_DETAIL_TITLE")}</title>
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
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: "1rem" }}
        >
          <Space>
            <RouterLink to="/admin/coupons">
              <Button type="default" icon={<LeftOutlined />}>
                Quay lại
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={isLoadingUpdateCoupon}
            >
              {t("COUPON_UPDATE_BTN")}
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteCoupon}
          >
            {t("COUPON_DELETE_BTN")}
          </Button>
        </Flex>

        <Form
          key={i18n.language}
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleUpdate}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("COUPON_CODE_LABEL")}
                name="code"
                rules={[
                  {
                    required: true,
                    message: t("COUPON_CODE_REQUIRED"),
                  },
                ]}
              >
                <Input placeholder={t("COUPON_CODE_PLACEHOLDER")} />
              </Form.Item>

              <Form.Item
                label={t("COUPON_NAME_LABEL")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("COUPON_NAME_REQUIRED"),
                  },
                ]}
              >
                <Input placeholder={t("COUPON_NAME_PLACEHOLDER")} />
              </Form.Item>

              <Form.Item
                label={t("COUPON_DESCRIPTION_LABEL")}
                name="description"
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t("COUPON_DESCRIPTION_PLACEHOLDER")}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("COUPON_STATUS_LABEL")}
                name="status"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t("COUPON_STATUS_ACTIVE")}
                  unCheckedChildren={t("COUPON_STATUS_INACTIVE")}
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
                      placeholder={t("SELECT_DATE")}
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
                        validator: async (_rule, value) => {
                          if (
                            value &&
                            getFieldValue("startDate") &&
                            dayjs(value).isBefore(
                              dayjs(getFieldValue("startDate"))
                            )
                          ) {
                            return Promise.reject(
                              new Error(t("COUPON_END_DATE_AFTER_START"))
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
                      placeholder={t("SELECT_DATE")}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>

      <CouponDetailList couponId={parseInt(couponId!)} coupon={coupon} />
    </>
  );
};

export default CouponDetail;
