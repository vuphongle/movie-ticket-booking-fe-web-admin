import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Space,
  Spin,
  message,
  theme,
} from "antd";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import { useGetMoviesQuery } from "@services/movies.service";
import {
  useCreateScheduleMutation,
  useGetSchedulesQuery,
} from "@services/schedules.service";
import AppBreadCrumb from "@components/layout/AppBreadCrumb";
import ScheduleTable from "./components/ScheduleTable";
import ScheduleFilters from "./components/ScheduleFilters";
import type { ScheduleFormData, Schedule } from "@/types";

const ScheduleList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, isLoading: isFetchingSchedules } =
    useGetSchedulesQuery(undefined);
  const { data: movies, isLoading: isFetchingMovies } = useGetMoviesQuery(true);
  const [createSchedule, { isLoading: isLoadingCreate }] =
    useCreateScheduleMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<number | string>("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const breadcrumb = [{ label: t("SCHEDULE_LIST"), href: "/admin/schedules" }];

  // Get classification helper function
  const getClassification = (record: Schedule): number => {
    const now = new Date();
    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);
    if (now < startDate) return 1;
    if (now >= startDate && now <= endDate) return 2;
    return 3;
  };

  // Filter data based on search criteria
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((schedule: Schedule) => {
      // Text search across multiple fields
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const movieName = schedule.movie?.name?.toLowerCase() || "";
        const startDate = dayjs(schedule.startDate).format("DD/MM/YYYY");
        const endDate = dayjs(schedule.endDate).format("DD/MM/YYYY");
        const timeRange = `${startDate} - ${endDate}`;

        if (
          !movieName.includes(searchLower) &&
          !timeRange.includes(searchLower)
        ) {
          return false;
        }
      }

      // Movie filter - Ensure proper type comparison
      if (selectedMovie && selectedMovie !== "") {
        // Convert both to strings for consistent comparison
        const scheduleMovieId = String(schedule.movieId || "");
        const selectedMovieStr = String(selectedMovie);
        if (scheduleMovieId !== selectedMovieStr) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "" && typeof selectedStatus === "number") {
        if (getClassification(schedule) !== selectedStatus) {
          return false;
        }
      }

      // Date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        const scheduleStart = dayjs(schedule.startDate);
        const scheduleEnd = dayjs(schedule.endDate);
        const filterStart = dateRange[0].startOf("day");
        const filterEnd = dateRange[1].endOf("day");

        // Check if schedule overlaps with filter range
        if (
          scheduleEnd.isBefore(filterStart) ||
          scheduleStart.isAfter(filterEnd)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchText, selectedMovie, selectedStatus, dateRange]);

  if (isFetchingSchedules || isFetchingMovies) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }

  const handleCreate = (values: ScheduleFormData) => {
    createSchedule(values)
      .unwrap()
      .then((_data) => {
        form.resetFields();
        setOpen(false);
        message.success(t("SCHEDULE_CREATED_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("SCHEDULE_LIST")}</title>
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
            {t("CREATE_SCHEDULE")}
          </Button>
          <RouterLink to="/admin/Schedules">
            <Button
              style={{ backgroundColor: "rgb(0, 192, 239)" }}
              type="primary"
              icon={<ReloadOutlined />}
            >
              {t("REFRESH")}
            </Button>
          </RouterLink>
        </Space>

        <ScheduleFilters
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedMovie={selectedMovie}
          onMovieChange={setSelectedMovie}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          movies={movies || []}
        />
        <ScheduleTable data={filteredData} movies={movies || []} />
      </div>
      <Modal
        open={open}
        title={t("CREATE_SCHEDULE")}
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
                (option?.label?.toString() ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={(movies || []).map((movie: any) => ({
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
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const today = dayjs().startOf("day");
                  if (value.isBefore(today)) {
                    return Promise.reject(
                      new Error(
                        t("START_DATE_CANNOT_BE_PAST") ||
                          "Ngày bắt đầu không được ở quá khứ"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
              placeholder={t("SELECT_DATE")}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
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
                  if (!value) return Promise.resolve();
                  const startDate = getFieldValue("startDate");
                  if (startDate && !value.isAfter(startDate, "day")) {
                    return Promise.reject(
                      new Error(
                        t("END_DATE_MUST_BE_AFTER_START_DATE") ||
                          "Ngày kết thúc phải lớn hơn ngày bắt đầu"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
              placeholder={t("SELECT_DATE")}
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

export default ScheduleList;
