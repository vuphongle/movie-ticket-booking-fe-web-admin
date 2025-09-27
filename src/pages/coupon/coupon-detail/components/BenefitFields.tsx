import {
  Form,
  InputNumber,
  Select,
  Row,
  Col,
  Avatar,
  Space,
  Typography,
} from "antd";
import { useGetAdditionalServicesQuery } from "@/app/services/additionalServices.service";
import { BenefitType, type AdditionalService } from "@/types";
import { API_DOMAIN } from "@/data/constants";

const { Title } = Typography;

export const BenefitFields = () => {
  const benefitType = Form.useWatch("benefitType");
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  const renderBenefitSpecificFields = () => {
    switch (benefitType) {
      case BenefitType.DISCOUNT_PERCENT:
        return (
          <Form.Item
            name="percent"
            label="Discount Percentage"
            rules={[
              { required: true, message: "Please enter discount percentage" },
              {
                type: "number",
                min: 0.01,
                max: 100,
                message: "Percentage must be between 0.01 and 100",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter discount percentage"
              precision={2}
              min={0.01}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value?.replace("%", "") as any}
            />
          </Form.Item>
        );

      case BenefitType.DISCOUNT_AMOUNT:
        return (
          <Form.Item
            name="amount"
            label="Discount Amount"
            rules={[
              { required: true, message: "Please enter discount amount" },
              {
                type: "number",
                min: 0.01,
                message: "Amount must be greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter discount amount"
              precision={2}
              min={0.01}
              formatter={(value) => `$${value}`}
              parser={(value) => value?.replace("$", "") as any}
            />
          </Form.Item>
        );

      case BenefitType.FREE_PRODUCT:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="giftServiceId"
                label="Select Gift Service"
                rules={[
                  { required: true, message: "Please select a gift service" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select a gift service"
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
                          <Avatar size={24} src={imageUrl} alt={service.name} />
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {service.name}
                            </div>
                            <small style={{ color: "#666" }}>
                              Type: {service.type}
                            </small>
                          </div>
                        </Space>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="giftQuantity"
                label="Gift Quantity"
                rules={[
                  { required: true, message: "Please enter gift quantity" },
                  {
                    type: "number",
                    min: 1,
                    message: "Quantity must be positive",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter quantity"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Title level={5}>Benefit Configuration</Title>
      <Form.Item
        name="benefitType"
        label="Benefit Type"
        rules={[{ required: true, message: "Please select benefit type" }]}
      >
        <Select placeholder="Select benefit type">
          <Select.Option value={BenefitType.DISCOUNT_PERCENT}>
            Discount Percentage
          </Select.Option>
          <Select.Option value={BenefitType.DISCOUNT_AMOUNT}>
            Discount Amount
          </Select.Option>
          <Select.Option value={BenefitType.FREE_PRODUCT}>
            Free Product/Service
          </Select.Option>
        </Select>
      </Form.Item>

      {renderBenefitSpecificFields()}
    </>
  );
};
