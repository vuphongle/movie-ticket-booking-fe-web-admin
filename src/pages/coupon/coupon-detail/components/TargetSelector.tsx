import {
  Form,
  Select,
  InputNumber,
  Avatar,
  Space,
  Row,
  Col,
  Typography,
} from "antd";
import { useGetProductsQuery } from "@/app/services/products.service";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import { TargetType, type Product, type AdditionalService } from "@/types";
import { API_DOMAIN } from "@/data/constants";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const TargetSelector = () => {
  const { t } = useTranslation();
  const targetType = Form.useWatch("targetType");

  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery(true);
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  const renderTargetReferenceField = () => {
    if (targetType === TargetType.TICKET) {
      return (
        <Form.Item
          name="targetRefId"
          label={t("COUPON_DETAIL_REF_ID_LABEL")}
          extra={t("REF_ID_TOOLTIP_ORDER")}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder={t("COUPON_DETAIL_REF_ID_PLACEHOLDER_TICKET")}
            min={1}
            disabled
          />
        </Form.Item>
      );
    }

    if (targetType === TargetType.PRODUCT) {
      return (
        <Form.Item
          name="targetRefId"
          label={t("COUPON_DETAIL_TARGET_PRODUCT_LABEL")}
          rules={[{ required: true, message: t("PRODUCT_REQUIRED") }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("SELECT_PRODUCT")}
            loading={isLoadingProducts}
            showSearch
            filterOption={(input, option) =>
              (option?.searchText || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            optionLabelProp="label"
          >
            {products.map((product: Product) => {
              const imageUrl = product.thumbnail?.startsWith("/api")
                ? `${API_DOMAIN}${product.thumbnail}`
                : product.thumbnail || "/placeholder.png";

              return (
                <Select.Option
                  key={product.id}
                  value={
                    typeof product.id === "string"
                      ? parseInt(product.id)
                      : product.id
                  }
                  label={product.name}
                  searchText={`${product.name} ${product.sku || ""}`}
                >
                  <Space>
                    <Avatar size={32} src={imageUrl} alt={product.name} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      <small style={{ color: "#666" }}>
                        {t("PRODUCT_SKU")}:{" "}
                        {product.sku || t("NOT_AVAILABLE_SHORT")}
                      </small>
                    </div>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      );
    }

    if (targetType === TargetType.ADDITIONAL_SERVICE) {
      return (
        <Form.Item
          name="targetRefId"
          label={t("COUPON_DETAIL_TARGET_SERVICE_LABEL")}
          rules={[{ required: true, message: t("SERVICE_REQUIRED") }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("SELECT_SERVICE_PLACEHOLDER")}
            loading={isLoadingServices}
            showSearch
            filterOption={(input, option) =>
              (option?.searchText || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            optionLabelProp="label"
          >
            {additionalServices.map((service: AdditionalService) => {
              const imageUrl = service.thumbnail?.startsWith("/api")
                ? `${API_DOMAIN}${service.thumbnail}`
                : service.thumbnail || "/placeholder.png";

              return (
                <Select.Option
                  key={service.id}
                  value={
                    typeof service.id === "string"
                      ? parseInt(service.id)
                      : service.id
                  }
                  label={service.name}
                  searchText={`${service.name} ${service.description || ""}`}
                >
                  <Space>
                    <Avatar size={32} src={imageUrl} alt={service.name} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{service.name}</div>
                      <small style={{ color: "#666" }}>
                        {t("COUPON_DETAIL_SERVICE_TYPE_LABEL", {
                          type: service.type,
                        })}
                        {service.description &&
                          ` • ${service.description.substring(0, 30)}...`}
                      </small>
                    </div>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      );
    }

    return null;
  };

  return (
    <>
      <Title level={5}>{t("COUPON_DETAIL_TARGET_SECTION_TITLE")}</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="targetType"
            label={t("COUPON_DETAIL_TARGET_TYPE_LABEL")}
            rules={[{ required: true, message: t("TARGET_TYPE_REQUIRED") }]}
          >
            <Select placeholder={t("SELECT_TARGET_PLACEHOLDER")}>
              <Select.Option value={TargetType.PRODUCT}>
                {t("COUPON_TARGET_PRODUCT")}
              </Select.Option>
              <Select.Option value={TargetType.ADDITIONAL_SERVICE}>
                {t("COUPON_TARGET_SERVICE")}
              </Select.Option>
              <Select.Option value={TargetType.TICKET}>
                {t("COUPON_TARGET_TICKET")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>{renderTargetReferenceField()}</Col>
      </Row>
    </>
  );
};
