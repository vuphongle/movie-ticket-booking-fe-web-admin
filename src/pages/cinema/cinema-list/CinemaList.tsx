import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useGetCinemasQuery } from "@/app/services/cinemas.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import CinemaTable from "./CinemaTable";

const CinemaList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data,
    isLoading: isFetchingCinemas,
    refetch,
  } = useGetCinemasQuery({});

  const breadcrumb = [{ label: t("CINEMA_LIST"), href: "/admin/cinemas" }];

  const handleRefresh = () => {
    refetch();
  };

  if (isFetchingCinemas) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("CINEMA_LIST_TITLE")}</title>
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
          <RouterLink to="/admin/cinemas/create">
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("CREATE_CINEMA_BUTTON")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isFetchingCinemas}
          >
            {t("REFRESH")}
          </Button>
        </Space>

        <CinemaTable data={data} />
      </div>
    </>
  );
};

export default CinemaList;
