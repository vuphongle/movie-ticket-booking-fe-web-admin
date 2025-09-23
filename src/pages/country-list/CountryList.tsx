import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Spin, message, theme } from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import {
  useCreateCountryMutation,
  useGetCountriesQuery,
} from "@/app/services/countries.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import CountryTable from "./CountryTable";
import { useTranslation } from "react-i18next";

const CountryList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const breadcrumb = [{ label: t("COUNTRY_LIST"), href: "/admin/countries" }];

  const { data, isLoading: isFetchingCountries } = useGetCountriesQuery();
  const [createCountry, { isLoading: isLoadingCreate }] =
    useCreateCountryMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  if (isFetchingCountries) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreate = (values: { name: string }) => {
    createCountry(values)
      .unwrap()
      .then((_data) => {
        form.resetFields();
        setOpen(false);
        message.success(t("CREATE_COUNTRY_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("COUNTRY_LIST")}</title>
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
            {t("CREATE_COUNTRY")}
          </Button>
          <RouterLink to="/admin/countries">
            <Button
              style={{ backgroundColor: "rgb(0, 192, 239)" }}
              type="primary"
              icon={<ReloadOutlined />}
            >
              {t("REFRESH")}
            </Button>
          </RouterLink>
        </Space>

        <CountryTable data={data || []} />
      </div>
      <Modal
        open={open}
        title={t("CREATE_COUNTRY")}
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
            name="name"
            rules={[
              {
                required: true,
                message: t("COUNTRY_NAME_REQUIRED"),
              },
              {
                max: 50,
                message: t("COUNTRY_NAME_MAX_LENGTH"),
              },
            ]}
          >
            <Input placeholder={t("ENTER_COUNTRY_NAME")} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingCreate}
              >
                {t("SAVE")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CountryList;
