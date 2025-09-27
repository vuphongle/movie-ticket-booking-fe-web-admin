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

const { Title } = Typography;

export const TargetSelector = () => {
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
          label="Target Reference ID"
          extra="Optional for ticket targets"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Optional for tickets"
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
          label="Select Product"
          rules={[{ required: true, message: "Please select a product" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select a product"
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
                        SKU: {product.sku || "N/A"}
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
          label="Select Service"
          rules={[{ required: true, message: "Please select a service" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select a service"
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
                        Type: {service.type}
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
      <Title level={5}>Target Configuration</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="targetType"
            label="Target Type"
            rules={[{ required: true, message: "Please select target type" }]}
          >
            <Select placeholder="Select target type">
              <Select.Option value={TargetType.PRODUCT}>Product</Select.Option>
              <Select.Option value={TargetType.ADDITIONAL_SERVICE}>
                Additional Service
              </Select.Option>
              <Select.Option value={TargetType.TICKET}>Ticket</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>{renderTargetReferenceField()}</Col>
      </Row>
    </>
  );
};
