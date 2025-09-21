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
  const { i18n } = useTranslation();
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
    { label: "Danh sách coupon", href: "/admin/coupons" },
    {
      label: coupon?.name || "Chi tiết coupon",
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
        ? values.startDate.format("DD/MM/YYYY")
        : null,
      endDate: values.endDate ? values.endDate.format("DD/MM/YYYY") : null,
    };

    updateCoupon({
      id: parseInt(couponId!),
      ...formattedValues,
    })
      .unwrap()
      .then(() => {
        message.success("Cập nhật coupon thành công!");
      })
      .catch((error) => {
        message.error(
          error.data?.message || "Có lỗi xảy ra khi cập nhật coupon"
        );
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content:
        "Bạn có chắc chắn muốn xóa khuyến mại này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteCoupon(parseInt(couponId!))
          .unwrap()
          .then((_data) => {
            message.success("Xóa khuyến mại thành công!");
            setTimeout(() => {
              navigate("/admin/coupons");
            }, 1500);
          })
          .catch((error) => {
            message.error(
              error.data?.message || "Có lỗi xảy ra khi xóa khuyến mại"
            );
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
        <title>{coupon?.name || "Chi tiết khuyến mại"}</title>
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
              Cập nhật coupon
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteCoupon}
          >
            Xóa khuyến mại
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
                label="Mã coupon"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã coupon!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã coupon" />
              </Form.Item>

              <Form.Item
                label="Tên coupon"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên coupon!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên coupon" />
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} placeholder="Nhập mô tả coupon" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                valuePropName="checked"
              >
                <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tắt" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
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
                    name="endDate"
                    dependencies={["startDate"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày kết thúc!",
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
                              new Error("Ngày kết thúc phải sau ngày bắt đầu!")
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
            </Col>
          </Row>
        </Form>
      </div>

      <CouponDetailList couponId={parseInt(couponId!)} coupon={coupon} />
    </>
  );
};

export default CouponDetail;
