import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Space, message, theme } from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateCinemaMutation } from "@/app/services/cinemas.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";

const CinemaCreate = () => {
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [createCinema, { isLoading }] = useCreateCinemaMutation();
  const navigate = useNavigate();

  // Reset form when language changes to avoid validation errors
  useEffect(() => {
    form.resetFields();
  }, [i18n.language, form]);

  const breadcrumb = [
    { label: t("CINEMA_LIST"), href: "/admin/cinemas" },
    { label: t("CREATE_CINEMA"), href: "/admin/cinemas/create" },
  ];

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        return createCinema(values).unwrap();
      })
      .then((data) => {
        message.success(t("CREATE_SUCCESS"));
        setTimeout(() => {
          navigate(`/admin/cinemas/${data.id}/detail`);
        }, 1500);
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("CREATE_CINEMA")}</title>
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
          <RouterLink to="/admin/cinemas">
            <Button type="default" icon={<LeftOutlined />}>
              {t("BACK")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={isLoading}
          >
            {t("CREATE_CINEMA_BUTTON")}
          </Button>
        </Space>

        <Form
          key={i18n.language}
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ status: false }}
          validateTrigger="onBlur"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("CINEMA_NAME")}
                name="name"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t("NAME_REQUIRED"),
                  },
                  {
                    min: 2,
                    message:
                      t("CINEMA_NAME") + " must be at least 2 characters",
                  },
                ]}
              >
                <Input placeholder={t("ENTER_CINEMA_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("CINEMA_ADDRESS")}
                name="address"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t("ADDRESS_REQUIRED"),
                  },
                  {
                    min: 5,
                    message:
                      t("CINEMA_ADDRESS") + " must be at least 5 characters",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder={t("ENTER_ADDRESS")} />
              </Form.Item>

              <Form.Item
                label={t("MAP_LOCATION")}
                name="mapLocation"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t("MAP_LOCATION_REQUIRED"),
                  },
                  {
                    min: 10,
                    message:
                      t("MAP_LOCATION") + " must be at least 10 characters",
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder={t("ENTER_MAP_LOCATION")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default CinemaCreate;
