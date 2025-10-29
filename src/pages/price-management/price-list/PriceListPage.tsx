import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  DatePicker,
  Switch,
  message,
  theme,
} from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  useCreatePriceListMutation,
  useGetPriceListsQuery,
} from "@/app/services/priceList.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import type { CreatePriceListRequest } from "@/types";
import PriceListTable from "./PriceListTable";

const { RangePicker } = DatePicker;

const PriceListPage = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumb = [
    {
      label: t("PRICE_LIST_MANAGEMENT"),
      href: "/admin/price-lists",
    },
  ];

  const {
    data,
    isLoading: isFetchingPriceLists,
    refetch,
  } = useGetPriceListsQuery();
  const [createPriceList, { isLoading: isLoadingCreate }] =
    useCreatePriceListMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  if (isFetchingPriceLists) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center min-h-screen"
      />
    );
  }

  const handleCreate = (values: any) => {
    const payload: CreatePriceListRequest = {
      name: values.name,
      status: values.status ?? true,
    };

    if (values.validityPeriod && values.validityPeriod.length === 2) {
      const validFrom = values.validityPeriod[0].clone().startOf("day");
      const validTo = values.validityPeriod[1].clone().endOf("day");

      payload.validFrom = validFrom.toISOString();
      payload.validTo = validTo.toISOString();

      const isOverlap = data?.some((item: any) => {
        if (!item.validFrom || !item.validTo) return false;
        const existingFrom = new Date(item.validFrom);
        const existingTo = new Date(item.validTo);

        return (
          validFrom.toDate() <= existingTo && validTo.toDate() >= existingFrom
        );
      });

      if (isOverlap) {
        message.error(
          t("VALIDITY_PERIOD_OVERLAP_ERROR") ||
            "Khoảng thời gian đã bị trùng với danh sách giá khác!",
        );
        return;
      }
    }

    createPriceList(payload)
      .unwrap()
      .then(() => {
        form.resetFields();
        setOpen(false);
        message.success(t("CREATE_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data?.message || t("CREATE_ERROR"));
      });
  };

  const handleRefresh = () => {
    refetch();
    message.success(t("REFRESH_SUCCESS"));
  };

  return (
    <>
      <Helmet>
        <title>{t("PRICE_LIST_MANAGEMENT")}</title>
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
            {t("CREATE_PRICE_LIST_BUTTON")}
          </Button>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            {t("REFRESH_BUTTON")}
          </Button>
        </Space>

        <PriceListTable data={data || []} loading={isFetchingPriceLists} />
      </div>{" "}
      <Modal
        open={open}
        title={t("CREATE_PRICE_LIST")}
        footer={null}
        onCancel={() => setOpen(false)}
        confirmLoading={isLoadingCreate}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
        >
          <Form.Item
            label={t("PRICE_LIST_NAME")}
            name="name"
            rules={[
              {
                required: true,
                message: t("PRICE_LIST_NAME_REQUIRED"),
              },
              {
                min: 3,
                message: t("PRICE_LIST_NAME_MIN_LENGTH"),
              },
            ]}
          >
            <Input placeholder={t("ENTER_PRICE_LIST_NAME")} />
          </Form.Item>

          <Form.Item
            label={t("VALIDITY_PERIOD")}
            name="validityPeriod"
            tooltip={t("VALIDITY_PERIOD_TOOLTIP")}
          >
            <RangePicker
              style={{ width: "100%" }}
              placeholder={[t("VALID_FROM"), t("VALID_TO")]}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label={t("STATUS")}
            name="status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
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
              <Button onClick={() => setOpen(false)}>
                {t("CANCEL_BUTTON")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PriceListPage;
