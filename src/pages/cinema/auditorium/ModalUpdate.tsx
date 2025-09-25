import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import { useTranslation } from "react-i18next";
import { useUpdateAuditoriumMutation } from "@/app/services/auditorium.service";
import type { Auditorium, AuditoriumCreateValues } from "@/types";

interface ModalUpdateProps {
  auditorium: Auditorium;
  open: boolean;
  onCancel: () => void;
  cinemaId: number;
}

const ModalUpdate = (props: ModalUpdateProps) => {
  const { auditorium, open, onCancel, cinemaId } = props;
  const { t, i18n } = useTranslation();
  const [updateAuditorium, { isLoading }] = useUpdateAuditoriumMutation();

  const onFinish = (values: Omit<AuditoriumCreateValues, "cinemaId">) => {
    updateAuditorium({ id: auditorium.id, ...values, cinemaId })
      .unwrap()
      .then((_data) => {
        message.success(t("UPDATE_AUDITORIUM_SUCCESS"));
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
        title={t("UPDATE_AUDITORIUM")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          key={i18n.language}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...auditorium }}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: t("AUDITORIUM_NAME_REQUIRED"),
              },
            ]}
          >
            <Input placeholder={t("ENTER_AUDITORIUM_NAME")} />
          </Form.Item>
          <Form.Item
            label={t("AUDITORIUM_TYPE")}
            name="type"
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
                { value: "STANDARD", label: t("STANDARD_TYPE") },
                { value: "IMAX", label: t("IMAX_TYPE") },
                { value: "GOLDCLASS", label: t("GOLDCLASS_TYPE") },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={t("TOTAL_ROWS")}
            name="totalRows"
            rules={[
              {
                required: true,
                message: t("TOTAL_ROWS_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(
                      t("TOTAL_ROWS_MUST_GREATER_THAN_ZERO"),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("ENTER_TOTAL_ROWS")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label={t("TOTAL_COLUMNS")}
            name="totalColumns"
            rules={[
              {
                required: true,
                message: t("TOTAL_COLUMNS_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(
                      t("TOTAL_COLUMNS_MUST_GREATER_THAN_ZERO"),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("ENTER_TOTAL_COLUMNS")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("UPDATE_CINEMA")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpdate;
