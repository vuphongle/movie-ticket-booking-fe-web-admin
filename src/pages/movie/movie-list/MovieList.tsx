import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useGetMoviesQuery } from "@/app/services/movies.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import MovieTable from "./MovieTable";

const MovieList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, isLoading: isFetchingMovies } = useGetMoviesQuery(undefined);

  const breadcrumb = [{ label: t("MOVIE_LIST"), href: "/admin/movies" }];

  if (isFetchingMovies) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("MOVIE_LIST")}</title>
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
          <RouterLink to="/admin/movies/create">
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("CREATE_MOVIE")}
            </Button>
          </RouterLink>
          <RouterLink to="/admin/movies">
            <Button
              style={{ backgroundColor: "rgb(0, 192, 239)" }}
              type="primary"
              icon={<ReloadOutlined />}
            >
              {t("REFRESH")}
            </Button>
          </RouterLink>
        </Space>

        <MovieTable data={data} />
      </div>
    </>
  );
};

export default MovieList;
