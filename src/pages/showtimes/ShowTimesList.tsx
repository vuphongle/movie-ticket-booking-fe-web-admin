import { Button, DatePicker, Form, Select, Space, theme } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useLazyGetAuditoriumsByCinemaQuery } from "@services/auditorium.service";
import { useGetCinemasQuery } from "@services/cinemas.service";
import { useLazySearchShowtimesQuery } from "@services/showtimes.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import { formatDate } from "@/utils/functionUtils";
import ShowtimesTable from "./components/ShowtimesTable";
import { useTranslation } from "react-i18next";

interface Cinema {
  id: string;
  name: string;
}

interface Auditorium {
  id: string;
  name: string;
}

interface SearchValues {
  cinemaId?: string;
  auditoriumId?: string;
  showDate: Dayjs;
}

const ShowTimesList = () => {
  const [form] = Form.useForm();
  const [_dateSelected, setDateSelected] = useState<Dayjs>(
    dayjs(new Date().toISOString())
  );
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data: cinemas,
    isLoading: _isFetchingCinemas,
    error: _cinemasError,
  } = useGetCinemasQuery({});

  const [
    getAuditoriumsByCinema,
    { data: auditoriums, isFetching: _isFetchingAuditoriums },
  ] = useLazyGetAuditoriumsByCinemaQuery();

  const [
    searchShowtimes,
    { data: _showtimes, isFetching: isFetchingSearchShowtimes },
  ] = useLazySearchShowtimesQuery();

  const handleSearchShowtimes = useCallback(() => {
    const showDate = new Date().toISOString();
    searchShowtimes({ showDate: formatDate(showDate) });
  }, [searchShowtimes]);

  useEffect(() => {
    handleSearchShowtimes();
  }, [handleSearchShowtimes]);

  const handleSearch = (values: SearchValues) => {
    const { cinemaId, auditoriumId, showDate } = values;
    searchShowtimes({
      cinemaId,
      auditoriumId,
      showDate: formatDate(showDate.toISOString()),
    });
    setDateSelected(dayjs(values.showDate.toISOString()));
  };

  const { t } = useTranslation();

  const breadcrumb = [{ label: t("SHOWTIME_LIST"), href: "/admin/showtimes" }];

  return (
    <>
      <Helmet>
        <title>{t("SHOWTIME_LIST")}</title>
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
        <Space style={{ marginBottom: "2rem" }}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            autoComplete="off"
            initialValues={{
              showDate: dayjs(
                formatDate(new Date().toISOString()),
                "DD/MM/YYYY"
              ),
            }}
          >
            <Form.Item
              label={t("CINEMA")}
              name="cinemaId"
              style={{ width: "400px" }}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder={t("SELECT_CINEMA")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={cinemas?.map((cinema: Cinema) => ({
                  value: cinema.id,
                  label: cinema.name,
                }))}
                onChange={(value) => {
                  form.setFieldsValue({ auditoriumId: undefined });
                  getAuditoriumsByCinema(value);
                }}
              />
            </Form.Item>

            <Form.Item
              label={t("AUDITORIUM")}
              name="auditoriumId"
              style={{ width: "300px" }}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder={t("SELECT_AUDITORIUM")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={auditoriums?.map((auditorium: Auditorium) => ({
                  value: auditorium.id,
                  label: auditorium.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={t("SHOW_DATE")}
              name="showDate"
              rules={[
                {
                  required: true,
                  message: t("SHOW_DATE_REQUIRED"),
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format={"DD/MM/YYYY"}
                placeholder={t("SELECT_SHOW_DATE")}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isFetchingSearchShowtimes}
                >
                  {t("SEARCH")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>

        <ShowtimesTable data={_showtimes || []} dateSelected={_dateSelected} />
      </div>
    </>
  );
};

export default ShowTimesList;
