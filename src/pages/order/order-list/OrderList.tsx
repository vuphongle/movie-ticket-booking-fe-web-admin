import { ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useGetOrdersQuery } from "@/app/services/orders.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import OrderTable from "./OrderTable";

const OrderList = () => {
  const { t } = useTranslation();
  const breadcrumb = [{ label: t("ORDER_LIST"), href: "/admin/orders" }];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, isLoading: isFetchingorders, refetch } = useGetOrdersQuery();

  if (isFetchingorders) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("ORDER_LIST")}</title>
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
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetchingorders}
          >
            {t("ORDER_REFRESH")}
          </Button>
        </Space>

        <OrderTable data={data || []} />
      </div>
    </>
  );
};

export default OrderList;
