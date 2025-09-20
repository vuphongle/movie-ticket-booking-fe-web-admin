import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import AdditionalServiceTable from "./AdditionalServiceTable";

const AdditionalServiceList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data,
    isLoading: isFetchingAdditionalServices,
    refetch,
  } = useGetAdditionalServicesQuery();

  const handleRefresh = () => {
    refetch();
  };

  const breadcrumb = [
    { label: t("ADDITIONAL_SERVICE_LIST"), href: "/admin/additional-services" },
  ];

  if (isFetchingAdditionalServices) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("ADDITIONAL_SERVICE_LIST")}</title>
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
          <RouterLink to="/admin/additional-services/create">
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("CREATE_ADDITIONAL_SERVICE")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isFetchingAdditionalServices}
          >
            {t("REFRESH")}
          </Button>
        </Space>

        <AdditionalServiceTable data={data || []} />
      </div>
    </>
  );
};

export default AdditionalServiceList;
