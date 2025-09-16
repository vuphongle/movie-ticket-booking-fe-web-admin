import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  message,
  theme,
} from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateAdditionalServiceMutation } from "@/app/services/additionalServices.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";

const AdditionalServiceCreate = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [createAdditionalService, { isLoading }] =
    useCreateAdditionalServiceMutation();
  const navigate = useNavigate();

  const breadcrumb = [
    { label: t("ADDITIONAL_SERVICE_LIST"), href: "/admin/additional-services" },
    {
      label: t("ADDITIONAL_SERVICE_CREATE"),
      href: "/admin/additional-services/create",
    },
  ];

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        // Add default thumbnail if not provided
        const createData = {
          ...values,
          thumbnail: values.thumbnail || "", // Ensure thumbnail is never undefined
        };
        return createAdditionalService(createData).unwrap();
      })
      .then((data) => {
        message.success(t("CREATE_SUCCESS"));
        setTimeout(() => {
          navigate(`/admin/additional-services/${data.id}/detail`);
        }, 1500);
      })
      .catch((error) => {
        message.error(error?.data?.message || t("CREATE_FAILED"));
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("ADDITIONAL_SERVICE_CREATE")}</title>
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
          <RouterLink to="/admin/additional-services">
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
            {t("CREATE_ADDITIONAL_SERVICE")}
          </Button>
        </Space>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ status: false }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={t("SERVICE_NAME")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("SERVICE_NAME_REQUIRED"),
                  },
                ]}
              >
                <Input placeholder={t("ENTER_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("DESCRIPTION")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("DESCRIPTION_REQUIRED"),
                  },
                ]}
              >
                <Input.TextArea rows={6} placeholder={t("ENTER_DESCRIPTION")} />
              </Form.Item>
            </Col>
            <Col span={8}>
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
                        return Promise.reject(t("PRICE_POSITIVE"));
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

              <Form.Item
                label={t("STATUS")}
                name="status"
                rules={[
                  {
                    required: true,
                    message: t("STATUS_REQUIRED"),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_STATUS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: t("DRAFT"), value: false },
                    { label: t("PUBLIC"), value: true },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AdditionalServiceCreate;
