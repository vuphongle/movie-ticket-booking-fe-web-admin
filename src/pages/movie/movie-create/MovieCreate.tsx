import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  message,
  theme,
} from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetActorsQuery } from "@/app/services/actors.service";
import { useGetCountriesQuery } from "@/app/services/countries.service";
import { useGetDirectorsQuery } from "@/app/services/directors.service";
import { useGetGenresQuery } from "@/app/services/genres.service";
import { useCreateMovieMutation } from "@/app/services/movies.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";

const MovieCreate = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [createMovie, { isLoading }] = useCreateMovieMutation();
  const { data: countries, isLoading: isLoadingCountries } =
    useGetCountriesQuery();
  const { data: genres, isLoading: isLoadingGenres } = useGetGenresQuery();
  const { data: directors, isLoading: isLoadingDirectors } =
    useGetDirectorsQuery();
  const { data: actors, isLoading: isLoadingActors } = useGetActorsQuery();

  const breadcrumb = [
    { label: t("MOVIE_LIST"), href: "/admin/movies" },
    { label: t("MOVIE_CREATE"), href: "/admin/movies/create" },
  ];

  // Reset form validation when language changes
  useEffect(() => {
    if (form.isFieldsTouched()) {
      // Clear all field errors first
      const fieldsErrors = form.getFieldsError();
      const fieldsWithErrors = fieldsErrors.filter(
        ({ errors }) => errors.length > 0
      );

      if (fieldsWithErrors.length > 0) {
        // Re-validate only fields that have errors to update error messages
        const fieldNames = fieldsWithErrors.map(({ name }) => name);
        form.validateFields(fieldNames).catch(() => {
          // Ignore validation errors, just trigger re-validation with new language
        });
      }
    }
  }, [t, form]);

  if (
    isLoadingCountries ||
    isLoadingGenres ||
    isLoadingDirectors ||
    isLoadingActors
  ) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        return createMovie(values).unwrap();
      })
      .then((data) => {
        message.success(t("CREATE_SUCCESS"));
        setTimeout(() => {
          navigate(`/admin/movies/${data.id}/detail`);
        }, 1500);
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  // Helper functions for validation rules that always use current translation
  const getRequiredRule = (messageKey: string) => ({
    required: true,
    message: t(messageKey),
  });

  const getPositiveNumberRule = (messageKey: string) => ({
    validator: (_: any, value: number) => {
      if (value <= 0) {
        return Promise.reject(t(messageKey));
      }
      return Promise.resolve();
    },
  });

  return (
    <>
      <Helmet>
        <title>{t("MOVIE_CREATE")}</title>
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
          <RouterLink to="/admin/movies">
            <Button type="default" icon={<LeftOutlined />}>
              {t("BACK")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={isLoading}
          >
            {t("CREATE_MOVIE")}
          </Button>
        </Space>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ status: false }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={t("MOVIE_NAME")}
                name="name"
                rules={[getRequiredRule("MOVIE_NAME_REQUIRED")]}
              >
                <Input placeholder={t("ENTER_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("MOVIE_NAME_EN")}
                name="nameEn"
                rules={[getRequiredRule("MOVIE_NAME_EN_REQUIRED")]}
              >
                <Input placeholder={t("ENTER_ENGLISH_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("TRAILER")}
                name="trailer"
                rules={[getRequiredRule("TRAILER_REQUIRED")]}
              >
                <Input placeholder={t("ENTER_TRAILER")} />
              </Form.Item>

              <Form.Item
                label={t("DESCRIPTION")}
                name="description"
                rules={[getRequiredRule("DESCRIPTION_REQUIRED")]}
              >
                <Input.TextArea rows={5} placeholder={t("ENTER_DESCRIPTION")} />
              </Form.Item>

              <Form.Item label={t("GENRES")} name="genreIds">
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_GENRES")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={genres?.map((genre) => ({
                    label: genre.name,
                    value: genre.id,
                  }))}
                />
              </Form.Item>

              <Form.Item label={t("DIRECTORS")} name="directorIds">
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_DIRECTORS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={directors?.map((director) => ({
                    label: director.name,
                    value: director.id,
                  }))}
                />
              </Form.Item>

              <Form.Item label={t("ACTORS")} name="actorIds">
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_ACTORS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={actors?.map((actor) => ({
                    label: actor.name,
                    value: actor.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("GRAPHICS")}
                name="graphics"
                rules={[getRequiredRule("GRAPHICS_REQUIRED")]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_GRAPHICS")}
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
                label={t("TRANSLATIONS")}
                name="translations"
                rules={[getRequiredRule("TRANSLATIONS_REQUIRED")]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_TRANSLATIONS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: t("SUBTITLING"), value: "SUBTITLING" },
                    { label: t("DUBBING"), value: "DUBBING" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label={t("AGE_RATING")}
                name="age"
                rules={[getRequiredRule("AGE_RATING_REQUIRED")]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_AGE")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: "P", value: "P" },
                    { label: "K", value: "K" },
                    { label: "T13", value: "T13" },
                    { label: "T16", value: "T16" },
                    { label: "T18", value: "T18" },
                    { label: "C", value: "C" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={t("SHOW_DATE")}
                name="showDate"
                rules={[getRequiredRule("SHOW_DATE_REQUIRED")]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  placeholder={t("SELECT_DATE")}
                />
              </Form.Item>

              <Form.Item
                label={t("RELEASE_YEAR")}
                name="releaseYear"
                rules={[
                  getRequiredRule("RELEASE_YEAR_REQUIRED"),
                  getPositiveNumberRule("RELEASE_YEAR_POSITIVE"),
                ]}
              >
                <InputNumber
                  placeholder={t("ENTER_RELEASE_YEAR")}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={t("DURATION")}
                name="duration"
                rules={[
                  getRequiredRule("DURATION_REQUIRED"),
                  getPositiveNumberRule("DURATION_POSITIVE"),
                ]}
              >
                <InputNumber
                  placeholder={t("ENTER_DURATION")}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={t("STATUS")}
                name="status"
                rules={[getRequiredRule("STATUS_REQUIRED")]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_STATUS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: t("DRAFT"), value: false },
                    { label: t("PUBLIC"), value: true },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={t("COUNTRY")}
                name="countryId"
                rules={[getRequiredRule("COUNTRY_REQUIRED")]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_COUNTRY")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={countries?.map((country) => ({
                    label: country.name,
                    value: country.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default MovieCreate;
