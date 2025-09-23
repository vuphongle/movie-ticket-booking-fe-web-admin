import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetActorsQuery } from "@/app/services/actors.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import ActorTable from "./ActorTable";

const ActorList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const breadcrumb = [{ label: t("ACTOR_LIST"), href: "/admin/actors" }];

  const { data, isLoading: isFetchingActors } = useGetActorsQuery();

  if (isFetchingActors) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>
          {t("ACTOR_LIST")} | {t("ADMIN")}
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
          <RouterLink to="/admin/actors/create">
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("CREATE_ACTOR")}
            </Button>
          </RouterLink>
          <RouterLink to="/admin/actors">
            <Button
              style={{ backgroundColor: "rgb(0, 192, 239)" }}
              type="primary"
              icon={<ReloadOutlined />}
            >
              {t("REFRESH")}
            </Button>
          </RouterLink>
        </Space>

        <ActorTable data={data} />
      </div>
    </>
  );
};

export default ActorList;
