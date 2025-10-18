import { ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useGetOrdersQuery } from "@/app/services/orders.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import OrderTable from "./OrderTable";

const breadcrumb = [{ label: "Danh sách đơn hàng", href: "/admin/orders" }];
const OrderList = () => {
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
        <title>Danh sách đơn hàng</title>
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
            Refresh
          </Button>
        </Space>

        <OrderTable data={data || []} />
      </div>
    </>
  );
};

export default OrderList;
