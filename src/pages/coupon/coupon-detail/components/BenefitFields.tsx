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
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const BenefitFields = () => {
  const { t } = useTranslation();
  const benefitType = Form.useWatch("benefitType");
  const { data: additionalServices = [], isLoading: isLoadingServices } =
    useGetAdditionalServicesQuery();

  const renderBenefitSpecificFields = () => {
    switch (benefitType) {
      case BenefitType.DISCOUNT_PERCENT:
        return (
          <Form.Item
            name="percent"
            label={t("COUPON_DETAIL_PERCENT_LABEL")}
            rules={[
              { required: true, message: t("PERCENT_REQUIRED") },
              {
                type: "number",
                min: 0.01,
                max: 100,
                message: t("PERCENT_RANGE_MESSAGE"),
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder={t("ENTER_PERCENTAGE")}
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
            label={t("COUPON_DETAIL_AMOUNT_LABEL")}
            rules={[
              { required: true, message: t("AMOUNT_REQUIRED") },
              {
                type: "number",
                min: 0.01,
                message: t("AMOUNT_MIN_MESSAGE"),
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder={t("ENTER_AMOUNT")}
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
                label={t("COUPON_DETAIL_FREE_SERVICE_LABEL")}
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
                          <Avatar size={24} src={imageUrl} alt={service.name} />
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {service.name}
                            </div>
                            <small style={{ color: "#666" }}>
                              {t("COUPON_DETAIL_SERVICE_TYPE_LABEL", {
                                type: service.type,
                              })}
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
                label={t("COUPON_DETAIL_GIFT_QUANTITY_LABEL")}
                rules={[
                  { required: true, message: t("GIFT_QUANTITY_REQUIRED") },
                  {
                    type: "number",
                    min: 1,
                    message: t("GIFT_QUANTITY_MIN_MESSAGE"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("ENTER_QUANTITY")}
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
      <Title level={5}>{t("COUPON_DETAIL_BENEFIT_SECTION_TITLE")}</Title>
      <Form.Item
        name="benefitType"
        label={t("COUPON_DETAIL_BENEFIT_TYPE_LABEL")}
        rules={[{ required: true, message: t("BENEFIT_TYPE_REQUIRED") }]}
      >
        <Select placeholder={t("SELECT_BENEFIT_TYPE_PLACEHOLDER")}>
          <Select.Option value={BenefitType.DISCOUNT_PERCENT}>
            {t("BENEFIT_DISCOUNT_PERCENT")}
          </Select.Option>
          <Select.Option value={BenefitType.DISCOUNT_AMOUNT}>
            {t("BENEFIT_DISCOUNT_AMOUNT")}
          </Select.Option>
          <Select.Option value={BenefitType.FREE_PRODUCT}>
            {t("BENEFIT_FREE_PRODUCT")}
          </Select.Option>
        </Select>
      </Form.Item>

      {renderBenefitSpecificFields()}
    </>
  );
};
