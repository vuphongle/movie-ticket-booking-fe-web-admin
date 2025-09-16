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
  theme,
} from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteCinemaMutation,
  useGetCinemaByIdQuery,
  useUpdateCinemaMutation,
} from "../../../app/services/cinemas.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import AuditoriumList from "../auditorium/AuditoriumList";
import MapIframeComponent from "./MapIframeComponent";

const CinemaDetail = () => {
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { cinemaId } = useParams<{ cinemaId: string }>();
  const { data: cinema, isLoading: isFetchingCinema } = useGetCinemaByIdQuery(
    cinemaId!
  );

  const [updateCinema, { isLoading: isLoadingUpdateCinema }] =
    useUpdateCinemaMutation();
  const [deleteCinema, { isLoading: isLoadingDeleteCinema }] =
    useDeleteCinemaMutation();

  // Force re-render when language changes
  useEffect(() => {
    if (cinema) {
      form.setFieldsValue(cinema);
    }
  }, [i18n.language, cinema, form]);

  const breadcrumb = [
    { label: t("CINEMA_LIST"), href: "/admin/cinemas" },
    { label: cinema?.name, href: `/admin/cinemas/${cinema?.id}/detail` },
  ];

  if (isFetchingCinema) {
    return <Spin size="large" fullscreen />;
  }

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        return updateCinema({ cinemaId, ...values }).unwrap();
      })
      .then((_data) => {
        message.success(t("UPDATE_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t("DELETE_CONFIRM_TITLE"),
      content: t("DELETE_CONFIRM_CONTENT"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      onOk: () => {
        deleteCinema(cinema!.id)
          .unwrap()
          .then((_data) => {
            message.success(t("DELETE_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/cinemas");
            }, 1500);
          })
          .catch((error) => {
            message.error(error.data.message);
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
        <title>{cinema?.name}</title>
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
            <RouterLink to="/admin/cinemas">
              <Button type="default" icon={<LeftOutlined />}>
                {t("BACK")}
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              loading={isLoadingUpdateCinema}
            >
              {t("UPDATE_CINEMA")}
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteCinema}
          >
            {t("DELETE_CINEMA")}
          </Button>
        </Flex>

        <Form
          key={i18n.language}
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            ...cinema,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("CINEMA_NAME")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("NAME_REQUIRED"),
                  },
                ]}
              >
                <Input placeholder={t("ENTER_CINEMA_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("CINEMA_ADDRESS")}
                name="address"
                rules={[
                  {
                    required: true,
                    message: t("ADDRESS_REQUIRED"),
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder={t("ENTER_ADDRESS")} />
              </Form.Item>

              <Form.Item
                label={t("MAP_LOCATION")}
                name="mapLocation"
                rules={[
                  {
                    required: true,
                    message: t("MAP_LOCATION_REQUIRED"),
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder={t("ENTER_MAP_LOCATION")}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <MapIframeComponent mapLocation={cinema?.mapLocation || ""} />
            </Col>
          </Row>
        </Form>
      </div>

      <AuditoriumList cinemaId={cinemaId ? parseInt(cinemaId) : 0} />
    </>
  );
};

export default CinemaDetail;
