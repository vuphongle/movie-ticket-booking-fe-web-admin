import { Button, Form, Modal, Select, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateSeatMutation } from "@/app/services/seats.service";
import type { Seat as SeatType, Auditorium, SeatFormValues } from "@/types";

interface SeatProps {
  seat: SeatType;
  isLastRow: boolean;
  auditorium: Auditorium;
}

function Seat({ seat, isLastRow, auditorium }: SeatProps) {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateSeat, { isLoading }] = useUpdateSeatMutation();

  useEffect(() => {
    // Force form to re-render when language changes
    form.validateFields();
  }, [i18n.language, form]);

  const onFinish = (values: SeatFormValues) => {
    updateSeat({ ...seat, ...values, auditoriumId: auditorium.id })
      .unwrap()
      .then((_data) => {
        message.success(t("UPDATE_SEAT_SUCCESS"));
        setIsModalOpen(false);
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  const getSeatColor = (seat: SeatType) => {
    if (!seat.status) {
      return "rgb(64, 64, 64)";
    }

    switch (seat.type) {
      case "NORMAL":
        return "rgb(114, 46, 209)";
      case "VIP":
        return "rgb(245, 34, 45)";
      case "COUPLE":
        return "rgb(236, 47, 150)";
      default:
        return "rgb(64, 64, 64)";
    }
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
        type="primary"
        style={{
          backgroundColor: getSeatColor(seat),
          width: "40px",
          height: "40px",
          margin: "2px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        {seat.code}
      </Button>

      <Modal
        title={t("UPDATE_SEAT")}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ ...seat }}
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
              placeholder="Select a type"
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
              placeholder="Select a status"
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
                {t("UPDATE")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Seat;
