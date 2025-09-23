import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetDirectorsQuery } from "@/app/services/directors.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import DirectorTable from "./DirectorTable";

const DirectorList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const breadcrumb = [{ label: t("DIRECTOR_LIST"), href: "/admin/directors" }];

  const {
    data,
    isLoading: isFetchingDirectors,
    refetch,
  } = useGetDirectorsQuery();

  if (isFetchingDirectors) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>
          {t("DIRECTOR_LIST")} | {t("ADMIN")}
        </title>
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
          <RouterLink to="/admin/directors/create">
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("CREATE_DIRECTOR")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            {t("REFRESH")}
          </Button>
        </Space>

        <DirectorTable data={data || []} />
      </div>
    </>
  );
};

export default DirectorList;
