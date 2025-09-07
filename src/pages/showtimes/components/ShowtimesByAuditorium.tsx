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
  TimePicker,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useGetAllMoviesInScheduleQuery } from "@services/movies.service";
import { useCreateShowtimesMutation } from "@services/showtimes.service";
import { isSameDay } from "@utils/functionUtils";
import Row from "./Row";
import { useTranslation } from "react-i18next";

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

const parseGraphicsType = (type: string) => {
  switch (type) {
    case "_2D":
      return <Tag color="blue">2D</Tag>;
    case "_3D":
      return <Tag color="red">3D</Tag>;
    default:
      return "";
  }
};

function ShowtimesByAuditorium({
  data,
  cinema,
  auditorium,
  dateSelected,
}: ShowtimesByAuditoriumProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [timeRange, setTimeRange] = useState<Dayjs[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>(data.showtimes);
  const [form] = Form.useForm();
  const { data: movies, isLoading: _isFetchingMovies } =
    useGetAllMoviesInScheduleQuery(dayjs(dateSelected).format("DD-MM-YYYY"));
  const [createShowtimes, { isLoading: isLoadingCreateShowtimes }] =
    useCreateShowtimesMutation();
  const { t } = useTranslation();

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
      time: timeRange,
    });
  }, [dateSelected, timeRange, form]);

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
        return parseGraphicsType(text);
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
        return (
          <Tag color="volcano">
            {record.startTime} - {record.endTime}
          </Tag>
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
        const now = new Date();
        const startTime = new Date(`${record.date}T${record.startTime}`);
        const endTime = new Date(`${record.date}T${record.endTime}`);

        if (now < startTime) {
          return <Tag color="blue">{t("UPCOMING")}</Tag>;
        } else if (now >= startTime && now <= endTime) {
          return <Tag color="green">{t("NOW_SHOWING")}</Tag>;
        } else {
          return <Tag color="red">{t("ALREADY_SHOWN")}</Tag>;
        }
      },
    },
  ];

  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 8) {
        hours.push(i);
      }
    }
    return hours;
  };

  const getClassification = (showDateStr: string) => {
    const now = dateSelected.toDate();
    const showDate = new Date(showDateStr);
    if (now.getTime() < showDate.getTime()) return 1;
    return 2;
  };

  const onFinish = (values: any) => {
    const [startTime, endTime] = values.time.map((time: Dayjs) =>
      time.format("HH:mm")
    );
    createShowtimes({
      auditoriumId: auditorium.id,
      movieId: values.movieId,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      startTime,
      endTime,
      graphicsType: values.graphicsType,
      translationType: values.translationType,
    })
      .unwrap()
      .then((_data: any) => {
        form.resetFields();
        setIsModalOpen(false);
        message.success(t("CREATE_SHOWTIME_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  const handleTimeChange = (values: [Dayjs, Dayjs] | null) => {
    if (!values || !selectedMovie) return;
    const startTime = values[0];
    const endTime = dayjs(startTime).add(selectedMovie.duration, "minutes");
    setTimeRange([startTime, endTime]);
  };

  const handleMovieChange = (value: string) => {
    const movie = movies?.find((movie: Movie) => movie.id === Number(value));
    if (!movie) return;
    setSelectedMovie(movie);

    // Lấy startTime từ hàm getLatestEndTime và thêm duration
    const startTime = getLatestEndTime(showtimes);
    let endTime = dayjs(startTime).add(movie.duration, "minutes");

    // Làm tròn endTime lên sao cho phút chia hết cho 5
    const roundedMinutes = roundUpToNextFive(endTime.minute());
    if (roundedMinutes >= 60) {
      // Nếu số phút làm tròn lớn hơn 60, cần tăng giờ lên và reset phút về 0
      endTime = endTime
        .add(roundedMinutes - endTime.minute(), "minutes")
        .add(1, "hour")
        .minute(0);
    } else {
      endTime = endTime.minute(roundedMinutes);
    }

    setTimeRange([startTime, endTime]);
  };

  // Hàm làm tròn phút lên đến số gần nhất chia hết cho 5
  const roundUpToNextFive = (num: number) => {
    return Math.ceil(num / 5) * 5;
  };

  const getLatestEndTime = (showtimes: Showtime[]) => {
    if (showtimes.length === 0) {
      // Trả về 08:00 nếu không có suất chiếu nào
      return dayjs().hour(8).minute(0).second(0);
    }

    const latestEndTime = showtimes.reduce(
      (latest: Dayjs, showtime: Showtime) => {
        const currentEndTime = dayjs(`${showtime.date}T${showtime.endTime}`);
        return currentEndTime.isAfter(latest) ? currentEndTime : latest;
      },
      dayjs(`${showtimes[0].date}T${showtimes[0].endTime}`)
    );

    // Thêm 30 phút vào endTime muộn nhất
    return latestEndTime.add(30, "minute");
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
    _2D: "2D",
    _3D: "3D",
  };

  const translationMapping = {
    SUBTITLING: "Phụ đề",
    DUBBING: "Lồng tiếng",
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
          onCancel={() => setIsModalOpen(false)}
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
              label={t("SHOW_TIME")}
              name="time"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: t("SHOW_TIME_REQUIRED"),
                },
              ]}
            >
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={5}
                onCalendarChange={(dates) => {
                  if (dates && dates.length === 2 && dates[0] && dates[1]) {
                    handleTimeChange([dates[0], dates[1]]);
                  }
                }}
                disabled={!selectedMovie}
                placeholder={[t("START_TIME"), t("END_TIME")]}
                disabledTime={(_current, type) => {
                  if (type === "start") {
                    return {
                      disabledHours: disabledHours,
                    };
                  } else {
                    return {
                      disabledHours: () => [],
                    };
                  }
                }}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoadingCreateShowtimes}
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
