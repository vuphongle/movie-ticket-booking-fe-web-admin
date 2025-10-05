import { EditOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateRowSeatMutation } from "@/app/services/seats.service";
import type { Auditorium, RowSeatUpdateValues } from "@/types";

interface RowSeatActionProps {
  rowIndex: number;
  isLastRow: boolean;
  auditorium: Auditorium;
}

function RowSeatAction({
  rowIndex,
  isLastRow,
  auditorium,
}: RowSeatActionProps) {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateRowSeat, { isLoading }] = useUpdateRowSeatMutation();

  useEffect(() => {
    // Force form to re-render when language changes
    form.validateFields();
  }, [i18n.language, form]);

  const onFinish = (
    values: Omit<RowSeatUpdateValues, "rowIndex" | "auditoriumId">,
  ) => {
    updateRowSeat({ auditoriumId: auditorium.id, rowIndex, ...values })
      .unwrap()
      .then((_data) => {
        message.success(t("UPDATE_ROW_SEAT_SUCCESS"));
        setIsModalOpen(false);
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  const options = [
    { label: t("NORMAL_SEAT"), value: "NORMAL" },
    { label: t("VIP_SEAT"), value: "VIP" },
  ];

  if (isLastRow) {
    options.push({ label: t("COUPLE_SEAT"), value: "COUPLE" });
  }

  return (
    <>
      <Button
        style={{
          backgroundColor: "rgb(82, 196, 26)",
          width: "40px",
          height: "40px",
          margin: "2px",
        }}
        type="primary"
        icon={<EditOutlined />}
        onClick={() => {
          setIsModalOpen(true);
        }}
      ></Button>

      <Modal
        title={t("UPDATE_ROW_SEAT_TITLE")}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ status: true }}
          onFinish={onFinish}
          key={i18n.language}
        >
          <Form.Item
            label={t("SEAT_TYPE")}
            name="type"
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
              options={options}
            />
          </Form.Item>

          <Form.Item
            label={t("SEAT_STATUS")}
            name="status"
            rules={[
              {
                required: true,
                message: t("SEAT_STATUS_REQUIRED"),
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
                { label: t("ACTIVE_STATUS"), value: true },
                { label: t("LOCKED_STATUS"), value: false },
              ]}
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
}

export default RowSeatAction;
