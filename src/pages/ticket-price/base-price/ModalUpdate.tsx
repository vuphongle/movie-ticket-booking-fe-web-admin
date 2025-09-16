import { Button, Form, InputNumber, message, Modal, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useUpdateBaseTicketPriceMutation } from "@/app/services/baseTicketPrice.service";
import type { BaseTicketPrice, UpdateBaseTicketPriceRequest } from "@/types";

interface ModalUpdateProps {
  baseTicketPrice: BaseTicketPrice | null;
  open: boolean;
  onCancel: () => void;
}

const ModalUpdate = (props: ModalUpdateProps) => {
  const { t } = useTranslation();
  const { baseTicketPrice, open, onCancel } = props;
  const [updateBaseTicketPrice, { isLoading }] =
    useUpdateBaseTicketPriceMutation();

  const onFinish = (values: Omit<UpdateBaseTicketPriceRequest, "id">) => {
    if (!baseTicketPrice) return;

    updateBaseTicketPrice({ id: baseTicketPrice.id, ...values })
      .unwrap()
      .then((_data) => {
        message.success(t("UPDATE_SUCCESS"));
        onCancel();
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Modal
        open={open}
        title={t("UPDATE_TICKET_PRICE")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...baseTicketPrice }}
        >
          <Form.Item
            label={t("SEAT_TYPE")}
            name="seatType"
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
              options={[
                { label: t("NORMAL_SEAT"), value: "NORMAL" },
                { label: t("VIP_SEAT"), value: "VIP" },
                { label: t("COUPLE_SEAT"), value: "COUPLE" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("GRAPHICS_TYPE")}
            name="graphicsType"
            rules={[
              {
                required: true,
                message: t("GRAPHICS_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_GRAPHICS_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: "2D", value: "_2D" },
                { label: "3D", value: "_3D" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("SCREENING_TIME_TYPE")}
            name="screeningTimeType"
            rules={[
              {
                required: true,
                message: t("SCREENING_TIME_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_SCREENING_TIME_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("EARLY_SCREENING"), value: "SUAT_CHIEU_SOM" },
                {
                  label: t("SCHEDULED_SCREENING"),
                  value: "SUAT_CHIEU_THEO_LICH",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("DAY_TYPE")}
            name="dayType"
            rules={[
              {
                required: true,
                message: t("DAY_TYPE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_DAY_TYPE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { label: t("WEEKDAY"), value: "WEEKDAY" },
                { label: t("WEEKEND"), value: "WEEKEND" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("AUDITORIUM_TYPE")}
            name="auditoriumType"
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
                { label: t("STANDARD_AUDITORIUM"), value: "STANDARD" },
                { label: t("IMAX_AUDITORIUM"), value: "IMAX" },
                { label: t("GOLD_CLASS_AUDITORIUM"), value: "GOLDCLASS" },
              ]}
            />
          </Form.Item>

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
                    return Promise.reject(t("PRICE_MUST_GREATER_THAN_ZERO"));
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
