import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Spin, message, theme } from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  useCreateGenreMutation,
  useGetGenresQuery,
} from "@/app/services/genres.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import GenreTable from "./GenreTable";
import { useTranslation } from "react-i18next";

const GenreList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const breadcrumb = [{ label: t("GENRE_LIST"), href: "/admin/genres" }];
  const { data, isLoading: isFetchingGenres, refetch } = useGetGenresQuery();
  const [createGenre, { isLoading: isLoadingCreate }] =
    useCreateGenreMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  if (isFetchingGenres) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreate = (values: { name: string }) => {
    createGenre(values)
      .unwrap()
      .then((_data) => {
        form.resetFields();
        setOpen(false);
        message.success(t("CREATE_GENRE_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("GENRE_LIST")}</title>
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
            {t("CREATE_GENRE")}
          </Button>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            {t("REFRESH")}
          </Button>
        </Space>

        <GenreTable data={data || []} />
      </div>
      <Modal
        open={open}
        title={t("CREATE_GENRE")}
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
                message: t("GENRE_NAME_REQUIRED"),
              },
              {
                max: 50,
                message: t("GENRE_NAME_MAX_LENGTH"),
              },
            ]}
          >
            <Input placeholder={t("ENTER_GENRE_NAME")} />
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

export default GenreList;
