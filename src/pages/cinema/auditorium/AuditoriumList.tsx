import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateAuditoriumMutation,
  useGetAuditoriumsByCinemaQuery,
} from "@/app/services/auditorium.service";
import AuditoriumTable from "./AuditoriumTable";
import type { AuditoriumCreateValues } from "@/types";

interface AuditoriumListProps {
  cinemaId: number;
}

const AuditoriumList = ({ cinemaId }: AuditoriumListProps) => {
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, isLoading: isFetchingAuditoriums } =
    useGetAuditoriumsByCinemaQuery(cinemaId);
  const [createAuditorium, { isLoading: isLoadingCreate }] =
    useCreateAuditoriumMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // Reset form when language changes
  useEffect(() => {
    form.resetFields();
  }, [i18n.language, form]);

  if (isFetchingAuditoriums) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreate = (values: Omit<AuditoriumCreateValues, "cinemaId">) => {
    createAuditorium({ ...values, cinemaId })
      .unwrap()
      .then((_data) => {
        form.resetFields();
        setOpen(false);
        message.success(t("CREATE_AUDITORIUM_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <div
        style={{
          marginTop: 24,
          marginBottom: 24,
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
          <Typography.Title level={4}>{t("AUDITORIUM_LIST")}</Typography.Title>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}
            loading={isLoadingCreate}
          >
            {t("CREATE_AUDITORIUM")}
          </Button>
        </Flex>

        <AuditoriumTable data={data} cinemaId={cinemaId} />
      </div>
      <Modal
        open={open}
        title={t("CREATE_AUDITORIUM")}
        footer={null}
        onCancel={() => setOpen(false)}
        confirmLoading={isLoadingCreate}
      >
        <Form
          key={i18n.language}
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
                      t("TOTAL_ROWS_MUST_GREATER_THAN_ZERO")
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
                      t("TOTAL_COLUMNS_MUST_GREATER_THAN_ZERO")
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

export default AuditoriumList;
