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
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useGetCouponByIdQuery,
} from "@/app/services/coupons.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import type { UpsertCouponRequest, Coupon } from "@/types";

const { Title } = Typography;

interface LocationState {
  coupon?: Coupon;
}

const CouponForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

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
    { label: "Quản lý khuyến mãi", href: "/admin/coupons" },
    {
      label: isEdit ? "Chỉnh sửa coupon" : "Tạo coupon mới",
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
    }
  }, [isEdit, couponData, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: UpsertCouponRequest = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        startAt: values.startAt ? values.startAt.toISOString() : null,
        endAt: values.endAt ? values.endAt.toISOString() : null,
      };

      let result;
      let updatedCoupon;

      if (isEdit && couponData) {
        result = await updateCoupon({ id: couponData.id, ...payload }).unwrap();
        message.success("Cập nhật coupon thành công!");

        // Tạo updated coupon object với dữ liệu mới
        updatedCoupon = {
          ...couponData,
          ...payload,
        };
      } else {
        result = await createCoupon(payload).unwrap();
        message.success("Tạo coupon thành công!");

        // Tạo coupon object từ result (API trả về Coupon, cần add derived fields)
        updatedCoupon = {
          ...result, // Includes id, code, name, description, status, startAt, endAt, createdAt, updatedAt, createdBy, updatedBy
          // Add derived fields for display
          activeStatus: result.status
            ? ("ACTIVE" as const)
            : ("HIDDEN" as const),
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
      message.error(error.data?.message || "Có lỗi xảy ra!");
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
          message="Lỗi"
          description="Không thể tải thông tin coupon. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? "Chỉnh sửa coupon" : "Tạo coupon mới"}</title>
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
                  Quay lại
                </Button>
                <Divider type="vertical" />
                <Title level={4} style={{ margin: 0 }}>
                  {isEdit ? "Chỉnh sửa coupon" : "Tạo coupon mới"}
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
                    Quản lý điều kiện
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => form.submit()}
                  loading={loading}
                >
                  {isEdit ? "Cập nhật" : "Tạo coupon"}
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
                <Title level={5}>Thông tin cơ bản</Title>

                <Form.Item
                  label="Mã coupon"
                  name="code"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã coupon!" },
                    { min: 3, message: "Mã coupon phải có ít nhất 3 ký tự!" },
                    { max: 50, message: "Mã coupon không được quá 50 ký tự!" },
                    {
                      pattern: /^[A-Z0-9_-]+$/,
                      message:
                        "Mã chỉ chứa chữ hoa, số, dấu gạch dưới và gạch ngang!",
                    },
                  ]}
                  extra="Mã duy nhất để xác định coupon"
                >
                  <Input
                    placeholder="VD: SUMMER2024"
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      const cleanValue = value.replace(/[^A-Z0-9_-]/g, "");
                      form.setFieldValue("code", cleanValue);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Tên coupon"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên coupon!" },
                    { min: 3, message: "Tên coupon phải có ít nhất 3 ký tự!" },
                    {
                      max: 200,
                      message: "Tên coupon không được quá 200 ký tự!",
                    },
                  ]}
                  extra="Tên hiển thị cho khách hàng"
                >
                  <Input placeholder="VD: Giảm giá mùa hè 2024" />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    { max: 1000, message: "Mô tả không được quá 1000 ký tự!" },
                  ]}
                  extra="Mô tả chi tiết về ưu đãi (tùy chọn)"
                >
                  <Input.TextArea
                    placeholder="Mô tả chi tiết về coupon..."
                    rows={4}
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>

              {/* Right Column */}
              <Col xs={24} lg={12}>
                <Title level={5}>Cài đặt thời gian & trạng thái</Title>

                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                  extra="Chế độ hiển thị của coupon"
                >
                  <Select
                    placeholder="Chọn trạng thái"
                    options={[
                      {
                        label: "🟢 Kích hoạt",
                        value: true,
                        extra: "Hiển thị và có thể sử dụng",
                      },
                      {
                        label: "🔒 Ẩn",
                        value: false,
                        extra: "Không hiển thị cho khách hàng",
                      },
                    ]}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày bắt đầu"
                      name="startAt"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày bắt đầu!",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày bắt đầu"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Ngày kết thúc"
                      name="endAt"
                      dependencies={["startAt"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày kết thúc!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const startAt = getFieldValue("startAt");
                            if (!value || !startAt) {
                              return Promise.resolve();
                            }
                            if (value.isBefore(startAt)) {
                              return Promise.reject(
                                new Error(
                                  "Ngày kết thúc phải sau ngày bắt đầu!"
                                )
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
                        placeholder="Chọn ngày kết thúc"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Info Alert */}
                <Alert
                  message="Bước tiếp theo"
                  description={
                    isEdit
                      ? "Sau khi cập nhật, bạn có thể quản lý thông tin chi tiết coupon."
                      : "Sau khi tạo coupon, bạn sẽ được chuyển đến trang chi tiết để quản lý thông tin."
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default CouponForm;
