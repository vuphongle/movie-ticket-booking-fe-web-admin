import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useGetProductsQuery } from "@/app/services/products.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import ProductTable from "./ProductTable";

const ProductList = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data,
    isLoading: isFetchingProducts,
    refetch,
  } = useGetProductsQuery(undefined);

  const breadcrumb = [{ label: t("PRODUCT_LIST"), href: "/admin/products" }];

  const handleRefresh = () => {
    refetch();
  };

  if (isFetchingProducts) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("PRODUCT_LIST")}</title>
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
          <RouterLink to="/admin/products/create">
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("CREATE_PRODUCT")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(0, 192, 239)" }}
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isFetchingProducts}
          >
            {t("REFRESH")}
          </Button>
        </Space>

        <ProductTable data={data} />
      </div>
    </>
  );
};

export default ProductList;
