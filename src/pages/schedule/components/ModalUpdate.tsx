import { Button, DatePicker, Form, message, Modal, Select, Space } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useUpdateScheduleMutation } from "@services/schedules.service";
import { convertDateArrayToDate } from "@/utils/functionUtils";
import type { ScheduleModalUpdateProps, ScheduleFormData } from "@/types";

const ModalUpdate = (props: ScheduleModalUpdateProps) => {
  const { schedule, open, onCancel, movies } = props;
  const { t } = useTranslation();
  const [updateSchedule, { isLoading }] = useUpdateScheduleMutation();
  const [form] = Form.useForm();

  const onFinish = (values: ScheduleFormData) => {
    updateSchedule({ id: schedule.id, ...values })
      .unwrap()
      .then((_data) => {
        message.success(t("SCHEDULE_UPDATED_SUCCESS"));
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
        title={t("UPDATE_SCHEDULE")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            movieId: schedule.movie.id,
            startDate: schedule.startDate
              ? dayjs(convertDateArrayToDate(schedule.startDate))
              : null,
            endDate: schedule.endDate
              ? dayjs(convertDateArrayToDate(schedule.endDate))
              : null,
          }}
        >
          <Form.Item
            label={t("MOVIE")}
            name="movieId"
            rules={[
              {
                required: true,
                message: t("MOVIE_REQUIRED"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder={t("SELECT_MOVIE")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={movies.map((movie: any) => ({
                label: movie.name,
                value: movie.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={t("START_DATE")}
            name="startDate"
            rules={[
              {
                required: true,
                message: t("START_DATE_REQUIRED"),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>

          <Form.Item
            label={t("END_DATE")}
            name="endDate"
            dependencies={["startDate"]}
            rules={[
              {
                required: true,
                message: t("END_DATE_REQUIRED"),
              },
              ({ getFieldValue }) => ({
                validator: (_, value) => {
                  const startDate = getFieldValue("startDate");
                  if (!value || !startDate || value.isAfter(startDate, "day")) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      t("END_DATE_MUST_BE_AFTER_START_DATE") ||
                        "Ngày kết thúc phải lớn hơn ngày bắt đầu",
                    ),
                  );
                },
              }),
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
              disabledDate={(current) => {
                const startDate = form.getFieldValue("startDate");
                return (
                  current && startDate && !current.isAfter(startDate, "day")
                );
              }}
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
