import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, DatePicker, Card, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import dayjs from "dayjs";
import type { Movie } from "@/types";

const { RangePicker } = DatePicker;

interface ScheduleFiltersProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  selectedMovie: string;
  onMovieChange: (value: string) => void;
  selectedStatus: number | string;
  onStatusChange: (value: number | string) => void;
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
  onDateRangeChange: (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
  ) => void;
  movies: Movie[];
}

const ScheduleFilters = memo(
  ({
    searchText,
    onSearchChange,
    selectedStatus,
    onStatusChange,
    dateRange,
    onDateRangeChange,
  }: ScheduleFiltersProps) => {
    const { t } = useTranslation();

    const statusOptions = useMemo(
      () => [
        { label: t("ALL"), value: "" },
        { label: t("UPCOMING"), value: 1 },
        { label: t("SHOWING"), value: 2 },
        { label: t("ENDED"), value: 3 },
      ],
      [t],
    );

    return (
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder={t("SEARCH_PLACEHOLDER") || "Tìm kiếm..."}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder={t("SELECT_STATUS")}
              value={selectedStatus || undefined}
              onChange={(value) => onStatusChange(value || "")}
              options={statusOptions}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={[t("START_DATE"), t("END_DATE")]}
              value={dateRange}
              onChange={onDateRangeChange}
              allowClear
            />
          </Col>
        </Row>
      </Card>
    );
  },
);

ScheduleFilters.displayName = "ScheduleFilters";

export default ScheduleFilters;
