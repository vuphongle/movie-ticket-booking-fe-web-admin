import { Button, Form, Input, Modal, Space, message } from "antd";
import { useTranslation } from "react-i18next";
import { useUpdateGenreMutation } from "@/app/services/genres.service";
import type { Genre } from "@/types/movie.types";

interface ModalUpdateProps {
  genre: Genre | null;
  open: boolean;
  onCancel: () => void;
}

const ModalUpdate = (props: ModalUpdateProps) => {
  const { t } = useTranslation();
  const { genre, open, onCancel } = props;
  const [updateGenre, { isLoading }] = useUpdateGenreMutation();

  const onFinish = (values: { name: string }) => {
    if (!genre) return;

    updateGenre({ id: genre.id, name: values.name })
      .unwrap()
      .then((_data) => {
        message.success(t("UPDATE_GENRE_SUCCESS"));
        onCancel();
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Modal
        open={open}
        title={t("UPDATE_GENRE")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ name: genre?.name }}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: t("GENRE_NAME_REQUIRED"),
              },
            ]}
          >
            <Input placeholder={t("ENTER_GENRE_NAME")} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("UPDATE")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpdate;
