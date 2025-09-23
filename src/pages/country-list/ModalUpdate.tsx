import { Button, Form, Input, Modal, Space, message } from "antd";
import { useTranslation } from "react-i18next";
import { useUpdateCountryMutation } from "@/app/services/countries.service";
import type { Country } from "@/types/movie.types";

interface ModalUpdateProps {
  country: Country | null;
  open: boolean;
  onCancel: () => void;
}

const ModalUpdate = (props: ModalUpdateProps) => {
  const { t } = useTranslation();
  const { country, open, onCancel } = props;
  const [updateCountry, { isLoading }] = useUpdateCountryMutation();

  const onFinish = (values: { name: string }) => {
    if (!country) return;

    updateCountry({ id: country.id, name: values.name })
      .unwrap()
      .then((_data) => {
        message.success(t("UPDATE_COUNTRY_SUCCESS"));
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
        title={t("UPDATE_COUNTRY")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ name: country?.name }}
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
