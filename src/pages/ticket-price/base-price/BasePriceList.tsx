import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
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
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCreateBaseTicketPriceMutation,
  useGetBaseTicketPricesQuery,
} from "@/app/services/baseTicketPrice.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import type { CreateBaseTicketPriceRequest } from "@/types";
import BasePriceTable from "./BasePriceTable";

const BasePriceList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumb = [
    {
      label: t("BASE_TICKET_PRICE_LIST"),
      href: "/admin/ticket-prices/base-price",
    },
  ];

  const { data, isLoading: isFetchingBaseTicketPrices } =
    useGetBaseTicketPricesQuery(undefined);
  const [createBaseTicketPrice, { isLoading: isLoadingCreate }] =
    useCreateBaseTicketPriceMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  if (isFetchingBaseTicketPrices) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreate = (values: CreateBaseTicketPriceRequest) => {
    createBaseTicketPrice(values)
      .unwrap()
      .then((_data) => {
        form.resetFields();
        setOpen(false);
        message.success(t("CREATE_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("BASE_TICKET_PRICE_LIST_TITLE")}</title>
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
            {t("CREATE_TICKET_PRICE_BUTTON")}
          </Button>
          <RouterLink to="/admin/ticket-prices/base-price">
            <Button
              style={{ backgroundColor: "rgb(0, 192, 239)" }}
              type="primary"
              icon={<ReloadOutlined />}
            >
              {t("REFRESH_BUTTON")}
            </Button>
          </RouterLink>
        </Space>

        <BasePriceTable data={data || []} />
      </div>
      <Modal
        open={open}
        title={t("CREATE_TICKET_PRICE")}
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
            label={t("SEAT_TYPE")}
            name="seatType"
            rules={[
              {
                required: true,
                message: t("SEAT_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_SEAT_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("NORMAL_SEAT"), value: "NORMAL" },
                { label: t("VIP_SEAT"), value: "VIP" },
                { label: t("COUPLE_SEAT"), value: "COUPLE" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("GRAPHICS_TYPE")}
            name="graphicsType"
            rules={[
              {
                required: true,
                message: t("GRAPHICS_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_GRAPHICS_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("GRAPHICS_2D"), value: "_2D" },
                { label: t("GRAPHICS_3D"), value: "_3D" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("SCREENING_TIME_TYPE")}
            name="screeningTimeType"
            rules={[
              {
                required: true,
                message: t("SCREENING_TIME_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_SCREENING_TIME_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("EARLY_SCREENING"), value: "SUAT_CHIEU_SOM" },
                {
                  label: t("SCHEDULED_SCREENING"),
                  value: "SUAT_CHIEU_THEO_LICH",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("DAY_TYPE")}
            name="dayType"
            rules={[
              {
                required: true,
                message: t("DAY_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_DAY_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("WEEKDAY"), value: "WEEKDAY" },
                { label: t("WEEKEND"), value: "WEEKEND" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("AUDITORIUM_TYPE")}
            name="auditoriumType"
            rules={[
              {
                required: true,
                message: t("AUDITORIUM_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_AUDITORIUM_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("STANDARD_AUDITORIUM"), value: "STANDARD" },
                { label: t("IMAX_AUDITORIUM"), value: "IMAX" },
                { label: t("GOLDCLASS_AUDITORIUM"), value: "GOLDCLASS" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("PRICE")}
            name="price"
            rules={[
              {
                required: true,
                message: t("PRICE_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(t("PRICE_MUST_GREATER_THAN_ZERO"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("ENTER_PRICE")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingCreate}
              >
                {t("SAVE_BUTTON")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BasePriceList;
