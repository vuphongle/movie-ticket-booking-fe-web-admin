import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  message,
  theme,
} from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  useCreateCouponMutation,
  useGetCouponsQuery,
} from "@/app/services/coupons.service";
import AppBreadCrumb from "../../components/layout/AppBreadCrumb";
import CouponTable from "./components/CouponTable";
import type { CreateCouponRequest } from "@/types";

const CouponList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, isLoading: isFetchingCoupons, refetch } = useGetCouponsQuery();
  const [createCoupon, { isLoading: isLoadingCreate }] =
    useCreateCouponMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const breadcrumb = [
    { label: t("COUPON_LIST_BREADCRUMB"), href: "/admin/coupons" },
  ];

  if (isFetchingCoupons) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreate = (values: CreateCouponRequest) => {
    createCoupon(values)
      .unwrap()
      .then((_data) => {
        form.resetFields();
        setOpen(false);
        message.success(t("COUPON_CREATE_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data?.message || t("COUPON_CREATE_ERROR"));
      });
  };

  const handleRefresh = () => {
    refetch();
  };

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
            onClick={() => setOpen(true)}
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

        <CouponTable data={data || []} />
      </div>
      <Modal
        open={open}
        title={t("COUPON_CREATE_MODAL_TITLE")}
        footer={null}
        onCancel={() => setOpen(false)}
        confirmLoading={isLoadingCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
        >
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
            label={t("COUPON_DISCOUNT_LABEL")}
            name="discount"
            rules={[
              {
                required: true,
                message: t("COUPON_DISCOUNT_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value > 100 || value < 0) {
                    return Promise.reject(
                      new Error(t("COUPON_DISCOUNT_RANGE_ERROR"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("COUPON_DISCOUNT_PLACEHOLDER")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_MAX_DISCOUNT_LABEL")}
            name="maxDiscount"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value <= 0) {
                    return Promise.reject(
                      new Error(t("COUPON_MAX_DISCOUNT_MIN_ERROR"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("COUPON_MAX_DISCOUNT_PLACEHOLDER")}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_QUANTITY_LABEL")}
            name="quantity"
            rules={[
              {
                required: true,
                message: t("COUPON_QUANTITY_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(
                      new Error(t("COUPON_QUANTITY_MIN_ERROR"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("COUPON_QUANTITY_PLACEHOLDER")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={t("COUPON_STATUS_LABEL")}
            name="status"
            rules={[
              {
                required: true,
                message: t("COUPON_STATUS_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("COUPON_STATUS_PLACEHOLDER")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("COUPON_STATUS_INACTIVE"), value: false },
                { label: t("COUPON_STATUS_ACTIVE"), value: true },
              ]}
            />
          </Form.Item>

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
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>

          <Form.Item
            label={t("COUPON_END_DATE_LABEL")}
            name="endDate"
            rules={[
              {
                required: true,
                message: t("COUPON_END_DATE_REQUIRED"),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingCreate}
              >
                {t("COUPON_SAVE_BTN")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CouponList;
