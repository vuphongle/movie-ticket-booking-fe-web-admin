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
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useGetAllMoviesInScheduleQuery } from "@services/movies.service";
import { useCreateShowtimesMutation } from "@services/showtimes.service";
import { isSameDay } from "@utils/functionUtils";
import Row from "./Row";
import { useTranslation } from "react-i18next";
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
  const { data: movies, isLoading: _isFetchingMovies } =
    useGetAllMoviesInScheduleQuery(dayjs(dateSelected).format("DD-MM-YYYY"));
  const [createShowtimes, { isLoading: isLoadingCreateShowtimes }] =
    useCreateShowtimesMutation();
  const { t } = useTranslation();

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
    form.setFieldsValue({
      date: dateSelected,
      slotId: selectedSlot,
    });
  }, [dateSelected, selectedSlot, form]);

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
    form.resetFields();
  };

  const getClassification = (showDateStr: string) => {
    const now = dateSelected.toDate();
    const showDate = new Date(showDateStr);
    if (now.getTime() < showDate.getTime()) return 1;
    return 2;
  };

  const onFinish = (values: ShowtimeFormData) => {
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
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
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
                  const classification = getClassification(movie.showDate); // Sử dụng hàm từ sorter
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
                    searchValue: movie.name, // Property mới chỉ chứa text để search
                  };
                })}
                onChange={handleMovieChange}
              />
            </Form.Item>

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
                  loading={isLoadingCreateShowtimes}
                  disabled={
                    !selectedMovie || !selectedSlot || isLoadingCreateShowtimes
                  }
                >
                  {t("CREATE_SHOWTIME")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default ShowtimesByAuditorium;
