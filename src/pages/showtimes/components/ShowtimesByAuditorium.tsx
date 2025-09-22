import { PlusOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  DatePicker,
  Form,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Alert,
  Checkbox,
  Radio,
  Row as AntRow,
  Col,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useGetAllMoviesInScheduleQuery } from "@services/movies.service";
import {
  useCreateShowtimesMutation,
  useCreateBulkShowtimesMutation,
} from "@services/showtimes.service";
import { isSameDay } from "@utils/functionUtils";
import Row from "./Row";
import { useTranslation } from "react-i18next";
import ConflictResolutionModal from "@/components/conflicts/ConflictResolutionModal";
import {
  calculateSlotSpans,
  getSlotSelectOptions,
  getActualTimeRange,
  slotToApiTimes,
  requiresMultipleSlots,
  calculateActualEndTime,
} from "@/data/showtimeSlots";
import type {
  ShowtimeFormData,
  ShowtimeApiPayload,
  BulkShowtimeFormData,
  BulkShowtimeApiPayload,
  ConflictDetail,
} from "@/types/showtime.types";
import {
  handleShowtimeError,
  validateSlotSelection,
  parseShowtimeError,
} from "@/utils/showtimeErrorHandler";

// Type definitions
interface Movie {
  id: number;
  name: string;
  duration: number;
  showDate: string;
  graphics: string[];
  translations: string[];
}

interface Cinema {
  id: string;
  name: string;
}

interface Auditorium {
  id: string;
  name: string;
}

interface Showtime {
  id: string;
  movie: Movie;
  date: string;
  startTime: string;
  endTime: string;
  graphicsType: string;
  translationType: string;
  status: string;
}

interface ShowtimesByAuditoriumData {
  auditorium: Auditorium;
  showtimes: Showtime[];
}

interface ShowtimesByAuditoriumProps {
  data: ShowtimesByAuditoriumData;
  cinema: Cinema;
  auditorium: Auditorium;
  dateSelected: Dayjs;
}

function ShowtimesByAuditorium({
  data,
  cinema,
  auditorium,
  dateSelected,
}: ShowtimesByAuditoriumProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [previewTime, setPreviewTime] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>(data.showtimes);
  const [form] = Form.useForm();

  // Bulk creation states
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<ConflictDetail[]>([]);
  const [pendingBulkRequest, setPendingBulkRequest] =
    useState<BulkShowtimeApiPayload | null>(null);
  const [validCount, setValidCount] = useState(0);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);

  const { data: movies, isLoading: _isFetchingMovies } =
    useGetAllMoviesInScheduleQuery(dayjs(dateSelected).format("DD-MM-YYYY"));
  const [createShowtimes, { isLoading: isLoadingCreateShowtimes }] =
    useCreateShowtimesMutation();
  const [createBulkShowtimes, { isLoading: isLoadingCreateBulkShowtimes }] =
    useCreateBulkShowtimesMutation();
  const { t } = useTranslation();

  // Days of week options
  const daysOfWeekOptions = [
    { label: t("MONDAY"), value: 2 },
    { label: t("TUESDAY"), value: 3 },
    { label: t("WEDNESDAY"), value: 4 },
    { label: t("THURSDAY"), value: 5 },
    { label: t("FRIDAY"), value: 6 },
    { label: t("SATURDAY"), value: 7 },
    { label: t("SUNDAY"), value: 1 },
  ];

  const parseGraphicsTypeTranslated = (type: string) => {
    switch (type) {
      case "_2D":
        return <Tag color="blue">{t("GRAPHICS_2D")}</Tag>;
      case "_3D":
        return <Tag color="red">{t("GRAPHICS_3D")}</Tag>;
      default:
        return "";
    }
  };

  const parseTranslationType = (type: string) => {
    switch (type) {
      case "SUBTITLING":
        return <Tag color="green">{t("SUBTITLING")}</Tag>;
      case "DUBBING":
        return <Tag color="orange">{t("DUBBING")}</Tag>;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!isBulkMode) {
      form.setFieldsValue({
        date: dateSelected,
        slotId: selectedSlot,
      });
    } else {
      form.setFieldsValue({
        slotId: selectedSlot,
      });
    }
  }, [dateSelected, selectedSlot, form, isBulkMode]);

  useEffect(() => {
    setShowtimes(data.showtimes);
  }, [data]);

  const columns = [
    {
      key: "sort",
    },
    {
      title: t("MOVIE_SCREENING"),
      dataIndex: "movie",
      key: "movie",
      render: (text: Movie, _record: Showtime, _index: number) => {
        return (
          <RouterLink to={`/admin/movies/${text.id}/detail`}>
            {text.name}
          </RouterLink>
        );
      },
    },
    {
      title: t("GRAPHICS_TYPE"),
      dataIndex: "graphicsType", // Sử dụng trực tiếp dataIndex nếu có thể
      key: "graphicsType",
      render: (text: string, _record: Showtime, _index: number) => {
        return parseGraphicsTypeTranslated(text);
      },
    },
    {
      title: t("TRANSLATION_TYPE"),
      dataIndex: "translationType", // Sử dụng trực tiếp dataIndex nếu có thể
      key: "translationType",
      render: (text: string, _record: Showtime, _index: number) => {
        return parseTranslationType(text);
      },
    },
    {
      title: t("SHOW_TIME"),
      dataIndex: "startTime", // Sử dụng trực tiếp dataIndex nếu có thể
      key: "time",
      render: (_text: string, record: Showtime, _index: number) => {
        const spans = calculateSlotSpans(record.movie.duration);
        // Calculate actual end time instead of using slot boundary
        const actualEndTime = calculateActualEndTime(
          record.startTime,
          record.movie.duration
        );

        return (
          <Space>
            <Tag color="volcano">
              {record.startTime} - {actualEndTime}
            </Tag>
            {spans > 1 && (
              <Tag color="purple">{`${t("SPANS_BADGE_PREFIX")} ${spans} ${t("SPANS_BADGE_SUFFIX")}`}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: t("SHOW_TYPE"),
      dataIndex: "", // Sử dụng một trong các trường ngày để xác định phân loại
      key: "type",
      render: (_text: string, record: Showtime, _index: number) => {
        const dateSelectedObj = dateSelected.toDate();
        const showDate = new Date(record.movie.showDate);

        if (showDate.getTime() > dateSelectedObj.getTime()) {
          return <Tag color="orange">{t("PREMIERE")}</Tag>;
        } else {
          return <Tag color="green">{t("SCHEDULED")}</Tag>;
        }
      },
    },
    {
      title: t("STATUS"),
      dataIndex: "status",
      key: "status",
      render: (_text: string, record: Showtime, _index: number) => {
        // Use dayjs for better timezone handling
        const now = dayjs();
        const startTime = dayjs(
          `${record.date} ${record.startTime}`,
          "DD/MM/YYYY HH:mm"
        );
        const endTime = dayjs(
          `${record.date} ${record.endTime}`,
          "DD/MM/YYYY HH:mm"
        );

        if (now.isBefore(startTime)) {
          return <Tag color="blue">{t("UPCOMING")}</Tag>;
        } else if (now.isAfter(startTime) && now.isBefore(endTime)) {
          return <Tag color="green">{t("NOW_SHOWING")}</Tag>;
        } else {
          return <Tag color="red">{t("ALREADY_SHOWN")}</Tag>;
        }
      },
    },
  ];

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setSelectedSlot(null);
    setPreviewTime(null);
    setIsBulkMode(false);
    form.resetFields();
  };

  const getClassification = (showDateStr: string) => {
    const now = dateSelected.toDate();
    const showDate = new Date(showDateStr);
    if (now.getTime() < showDate.getTime()) return 1;
    return 2;
  };

  const onFinish = (values: ShowtimeFormData | BulkShowtimeFormData) => {
    if (!selectedMovie) return;

    if (isBulkMode) {
      handleBulkSubmit(values as BulkShowtimeFormData);
    } else {
      handleSingleSubmit(values as ShowtimeFormData);
    }
  };

  const handleSingleSubmit = (values: ShowtimeFormData) => {
    if (!selectedMovie) return;

    // Validate slot selection before API call
    const validation = validateSlotSelection(
      selectedMovie.duration,
      values.slotId
    );
    if (!validation.isValid) {
      message.error(validation.errorMessage);
      return;
    }

    const apiPayload = slotToApiTimes(values.slotId, selectedMovie.duration);
    if (!apiPayload) {
      message.error(t("BAD_INPUT_ERROR"));
      return;
    }

    const createPayload: ShowtimeApiPayload = {
      auditoriumId: auditorium.id,
      movieId: values.movieId,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      startTime: apiPayload.startTime,
      endTime: apiPayload.endTime,
      graphicsType: values.graphicsType,
      translationType: values.translationType,
    };

    createShowtimes(createPayload)
      .unwrap()
      .then((_data: any) => {
        form.resetFields();
        setSelectedMovie(null);
        setSelectedSlot(null);
        setPreviewTime(null);
        setIsModalOpen(false);
        message.success(t("CREATE_SHOWTIME_SUCCESS"));
      })
      .catch((error: any) => {
        const parsedError = parseShowtimeError(error);
        handleShowtimeError(parsedError);
      });
  };

  const handleBulkSubmit = (values: BulkShowtimeFormData) => {
    if (!selectedMovie) return;

    // Validate slot selection
    const validation = validateSlotSelection(
      selectedMovie.duration,
      values.slotId
    );
    if (!validation.isValid) {
      message.error(validation.errorMessage);
      return;
    }

    // Validate date range
    const dateFrom = dayjs(values.dateFrom);
    const dateTo = dayjs(values.dateTo);

    if (dateFrom.isAfter(dateTo)) {
      message.error(t("DATE_FROM_AFTER_DATE_TO"));
      return;
    }

    if (dateFrom.add(90, "days").isBefore(dateTo)) {
      message.error(t("DATE_RANGE_TOO_LARGE"));
      return;
    }

    if (!values.daysOfWeek || values.daysOfWeek.length === 0) {
      message.error(t("NO_DAYS_SELECTED"));
      return;
    }

    const apiPayload = slotToApiTimes(values.slotId, selectedMovie.duration);
    if (!apiPayload) {
      message.error(t("BAD_INPUT_ERROR"));
      return;
    }

    const bulkPayload: BulkShowtimeApiPayload = {
      auditoriumId: parseInt(auditorium.id),
      movieId: values.movieId,
      dateFrom: dateFrom.format("YYYY-MM-DD"),
      dateTo: dateTo.format("YYYY-MM-DD"),
      startTime: apiPayload.startTime,
      endTime: apiPayload.endTime,
      graphicsType: values.graphicsType,
      translationType: values.translationType,
      daysOfWeek: values.daysOfWeek,
      conflictPolicy: "FAIL", // Start with FAIL to detect conflicts
    };

    createBulkShowtimes(bulkPayload)
      .unwrap()
      .then((response: any) => {
        form.resetFields();
        setSelectedMovie(null);
        setSelectedSlot(null);
        setPreviewTime(null);
        setIsModalOpen(false);

        // Check if all requested showtimes were created successfully
        if (response.successfullyCreated === response.totalRequested) {
          message.success(
            t("BULK_CREATION_SUCCESS", {
              created: response.successfullyCreated,
              total: response.totalRequested,
            })
          );
        } else if (response.successfullyCreated > 0) {
          // Partial success - some were created, some failed/skipped
          message.warning(
            t("BULK_CREATION_PARTIAL", {
              created: response.successfullyCreated,
              total: response.totalRequested,
              skipped: response.totalRequested - response.successfullyCreated,
            })
          );
        } else {
          // None were created
          message.error(t("BULK_CREATION_FAILED"));
        }
      })
      .catch((error: any) => {
        if (error?.data?.code === "409_BULK_SHOWTIME_CONFLICT") {
          // Handle conflicts
          const conflicts = error.data.conflicts?.conflicts || [];
          const totalRequested = error.data.conflicts?.totalRequested || 0;
          const conflictsCount = conflicts.length;

          setConflictDetails(conflicts);
          setValidCount(totalRequested - conflictsCount);
          setPendingBulkRequest({ ...bulkPayload, conflictPolicy: "SKIP" });
          setConflictModalVisible(true);
        } else {
          const parsedError = parseShowtimeError(error);
          handleShowtimeError(parsedError);
        }
      });
  };

  const handleSkipConflicts = () => {
    if (!pendingBulkRequest) return;

    createBulkShowtimes(pendingBulkRequest)
      .unwrap()
      .then((response: any) => {
        form.resetFields();
        setSelectedMovie(null);
        setSelectedSlot(null);
        setPreviewTime(null);
        setIsModalOpen(false);
        setConflictModalVisible(false);
        setPendingBulkRequest(null);
        setConflictDetails([]);
        setValidCount(0);

        // Show appropriate message based on results
        if (response.successfullyCreated === 0) {
          message.error(t("BULK_CREATION_FAILED"));
        } else if (response.successfullyCreated === response.totalRequested) {
          message.success(
            t("BULK_CREATION_SUCCESS", {
              created: response.successfullyCreated,
              total: response.totalRequested,
            })
          );
        } else {
          message.warning(
            t("BULK_CREATION_PARTIAL", {
              created: response.successfullyCreated,
              total: response.totalRequested,
              skipped: response.totalRequested - response.successfullyCreated,
            })
          );
        }
      })
      .catch((error: any) => {
        const parsedError = parseShowtimeError(error);
        handleShowtimeError(parsedError);
      });
  };

  const handleCancelConflictResolution = () => {
    setConflictModalVisible(false);
    setPendingBulkRequest(null);
    setConflictDetails([]);
    setValidCount(0);
  };

  // Quick selection handlers for days of week
  const handleQuickSelectDays = (type: "all" | "weekdays" | "weekends") => {
    let selectedDays: number[] = [];

    switch (type) {
      case "all":
        selectedDays = [1, 2, 3, 4, 5, 6, 7]; // Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
        break;
      case "weekdays":
        selectedDays = [2, 3, 4, 5, 6]; // Monday to Friday
        break;
      case "weekends":
        selectedDays = [1, 7]; // Sunday and Saturday
        break;
    }

    // Update both form and local state
    form.setFieldValue("daysOfWeek", selectedDays);
    setSelectedDaysOfWeek(selectedDays);

    // Force component re-render by triggering form validation
    form.validateFields(["daysOfWeek"]);
  };

  const handleSlotChange = (slotId: number) => {
    if (!selectedMovie) return;

    setSelectedSlot(slotId);
    // Use actual time range for preview (shows real movie end time)
    const actualPreview = getActualTimeRange(slotId, selectedMovie.duration);
    setPreviewTime(actualPreview);
  };

  const handleMovieChange = (value: string) => {
    const movie = movies?.find((movie: Movie) => movie.id === Number(value));
    if (!movie) return;

    setSelectedMovie(movie);
    setSelectedSlot(null);
    setPreviewTime(null);

    // Reset dependent fields when movie changes
    form.setFieldsValue({
      slotId: undefined,
      graphicsType: undefined,
      translationType: undefined,
    });
  };
  const getOptions = (
    movie: Movie | null,
    property: keyof Movie,
    mapping: Record<string, string>
  ) => {
    if (!movie || !movie[property]) return [];
    return (movie[property] as string[]).map((type: string) => {
      return { label: mapping[type], value: type };
    });
  };

  const graphicsMapping = {
    _2D: t("GRAPHICS_2D"),
    _3D: t("GRAPHICS_3D"),
  };

  const translationMapping = {
    SUBTITLING: t("SUBTITLING"),
    DUBBING: t("DUBBING"),
  };

  const getGraphicsTypeOptions = (movie: Movie | null) =>
    getOptions(movie, "graphics", graphicsMapping);
  const getTranslationTypeOptions = (movie: Movie | null) =>
    getOptions(movie, "translations", translationMapping);

  const onDragEnd = ({ active, over }: { active: any; over: any }) => {
    if (active.id !== over?.id) {
      setShowtimes((previous) => {
        const activeIndex = previous.findIndex((i) => i.id === active.id);
        const overIndex = previous.findIndex((i) => i.id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
    message.warning(t("FEATURE_UNDER_DEVELOPMENT"));
  };
  return (
    <>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={showtimes.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            style={{ marginBottom: 30, position: "relative", zIndex: 1 }}
            columns={columns}
            dataSource={showtimes}
            pagination={false}
            rowKey="id"
            title={() => (
              <Typography.Title level={5} style={{ color: "#722ed1" }}>
                {data.auditorium.name}
              </Typography.Title>
            )}
            footer={() => {
              const now = new Date();
              const dateSelectedObj = dateSelected.toDate();

              if (
                isSameDay(now, dateSelectedObj) ||
                dateSelectedObj.getTime() >= now.getTime()
              ) {
                return (
                  <Button
                    style={{ backgroundColor: "rgb(60, 141, 188)" }}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                  >
                    {t("ADD_SHOWTIME")}
                  </Button>
                );
              } else {
                return null;
              }
            }}
          />
        </SortableContext>
      </DndContext>

      {isModalOpen && (
        <Modal
          title={`${t("ADD_SCREENINGS")} (${cinema.name} - ${auditorium.name})`}
          open={isModalOpen}
          footer={null}
          onCancel={handleModalClose}
          width={isBulkMode ? 800 : 600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Creation Mode Toggle */}
            <Form.Item label={t("CREATION_MODE")}>
              <Radio.Group
                value={isBulkMode ? "bulk" : "single"}
                onChange={(e) => {
                  setIsBulkMode(e.target.value === "bulk");
                  form.resetFields([
                    "date",
                    "dateFrom",
                    "dateTo",
                    "daysOfWeek",
                  ]);
                }}
              >
                <Radio value="single">{t("SINGLE_DATE_MODE")}</Radio>
                <Radio value="bulk">{t("BULK_CREATION_MODE")}</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={t("MOVIE_SCREENING")}
              name="movieId"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: t("MOVIE_SCREENING_REQUIRED"),
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder={t("SELECT_MOVIE")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.searchValue ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={movies?.map((movie: Movie) => {
                  const classification = getClassification(movie.showDate);
                  const color = classification === 1 ? "processing" : "success";
                  const statusText =
                    classification === 1 ? t("UPCOMING") : t("NOW_SHOWING");
                  return {
                    value: movie.id,
                    label: (
                      <>
                        {movie.name} <Tag color={color}>{statusText}</Tag>
                      </>
                    ),
                    searchValue: movie.name,
                  };
                })}
                onChange={handleMovieChange}
              />
            </Form.Item>

            {/* Date Selection - Single vs Bulk */}
            {!isBulkMode ? (
              <Form.Item
                label={t("SHOW_DATE")}
                name="date"
                rules={[
                  {
                    required: true,
                    message: t("SHOW_DATE_REQUIRED"),
                  },
                ]}
              >
                <DatePicker
                  disabled
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            ) : (
              <>
                <AntRow gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={t("DATE_FROM")}
                      name="dateFrom"
                      rules={[
                        {
                          required: true,
                          message: t("DATE_FROM_REQUIRED"),
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("DATE_TO")}
                      name="dateTo"
                      rules={[
                        {
                          required: true,
                          message: t("DATE_TO_REQUIRED"),
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                </AntRow>

                <Form.Item
                  label={t("DAYS_OF_WEEK")}
                  name="daysOfWeek"
                  rules={[
                    {
                      required: true,
                      message: t("NO_DAYS_SELECTED"),
                    },
                  ]}
                >
                  <div>
                    {/* Quick selection buttons */}
                    <div style={{ marginBottom: 8 }}>
                      <Typography.Text
                        type="secondary"
                        style={{ marginRight: 8 }}
                      >
                        {t("QUICK_SELECT")}
                      </Typography.Text>
                      <Space>
                        <Button
                          size="small"
                          onClick={() => handleQuickSelectDays("all")}
                        >
                          {t("SELECT_ALL_DAYS")}
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleQuickSelectDays("weekdays")}
                        >
                          {t("SELECT_WEEKDAYS")}
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleQuickSelectDays("weekends")}
                        >
                          {t("SELECT_WEEKENDS")}
                        </Button>
                      </Space>
                    </div>
                    <Checkbox.Group
                      options={daysOfWeekOptions}
                      value={selectedDaysOfWeek}
                      onChange={(checkedValues) => {
                        setSelectedDaysOfWeek(checkedValues);
                        form.setFieldValue("daysOfWeek", checkedValues);
                      }}
                    />
                  </div>
                </Form.Item>
              </>
            )}

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
                disabled={!selectedMovie}
                style={{ width: "100%" }}
                showSearch
                placeholder={t("SELECT_GRAPHICS_TYPE")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={getGraphicsTypeOptions(selectedMovie)}
              />
            </Form.Item>

            <Form.Item
              label={t("TRANSLATION_TYPE")}
              name="translationType"
              rules={[
                {
                  required: true,
                  message: t("TRANSLATION_TYPE_REQUIRED"),
                },
              ]}
            >
              <Select
                disabled={!selectedMovie}
                style={{ width: "100%" }}
                showSearch
                placeholder={t("SELECT_TRANSLATION_TYPE")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={getTranslationTypeOptions(selectedMovie)}
              />
            </Form.Item>

            <Form.Item
              label={t("SHOW_TIME_SLOT")}
              name="slotId"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: t("SLOT_REQUIRED"),
                },
              ]}
            >
              <Select
                disabled={!selectedMovie}
                style={{ width: "100%" }}
                placeholder={t("SELECT_SLOT")}
                onChange={handleSlotChange}
                options={
                  selectedMovie
                    ? getSlotSelectOptions(selectedMovie.duration)
                    : []
                }
              />
            </Form.Item>

            {previewTime && (
              <Alert
                message={`${t("ACTUAL_SHOW_TIME_PREFIX")}: ${previewTime.startTime} - ${previewTime.endTime}`}
                type="info"
                style={{ marginBottom: 16 }}
              />
            )}

            {selectedMovie && requiresMultipleSlots(selectedMovie.duration) && (
              <Alert
                message={`${t("SLOT_OCCUPANCY_WARNING_PREFIX")} ${calculateSlotSpans(selectedMovie.duration)} ${t("SLOT_OCCUPANCY_WARNING_SUFFIX")}`}
                type="warning"
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    isLoadingCreateShowtimes || isLoadingCreateBulkShowtimes
                  }
                  disabled={
                    !selectedMovie ||
                    !selectedSlot ||
                    isLoadingCreateShowtimes ||
                    isLoadingCreateBulkShowtimes
                  }
                >
                  {isBulkMode
                    ? t("CREATE_BULK_SHOWTIMES")
                    : t("CREATE_SHOWTIME")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        visible={conflictModalVisible}
        conflicts={conflictDetails}
        totalRequested={conflictDetails.length + validCount}
        validCount={validCount}
        onSkipConflicts={handleSkipConflicts}
        onCancel={handleCancelConflictResolution}
        loading={isLoadingCreateBulkShowtimes}
      />
    </>
  );
}

export default ShowtimesByAuditorium;
