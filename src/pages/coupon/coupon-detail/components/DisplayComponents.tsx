import { Space, Tag } from "antd";
import { TargetType, BenefitType } from "@/types";
import { TARGET_TYPE_COLORS, BENEFIT_TYPE_COLORS } from "../constants";
import { useTranslation } from "react-i18next";

interface TargetTypeDisplayProps {
  targetType: TargetType;
  targetRefId?: number;
}

export const TargetTypeDisplay = ({ targetType }: TargetTypeDisplayProps) => {
  const { t } = useTranslation();
  const targetLabels: Record<TargetType, string> = {
    [TargetType.PRODUCT]: t("COUPON_TARGET_PRODUCT"),
    [TargetType.ADDITIONAL_SERVICE]: t("COUPON_TARGET_SERVICE"),
    [TargetType.TICKET]: t("COUPON_TARGET_TICKET"),
  };

  return (
    <Space direction="vertical" size="small">
      <Tag color={TARGET_TYPE_COLORS[targetType]} style={{ margin: 0 }}>
        {targetLabels[targetType]}
      </Tag>
    </Space>
  );
};

interface BenefitTypeDisplayProps {
  benefitType: BenefitType;
  terms?: any;
}

export const BenefitTypeDisplay = ({
  benefitType,
  terms,
}: BenefitTypeDisplayProps) => {
  const { t } = useTranslation();
  const benefitLabels: Record<BenefitType, string> = {
    [BenefitType.DISCOUNT_PERCENT]: t("BENEFIT_DISCOUNT_PERCENT"),
    [BenefitType.DISCOUNT_AMOUNT]: t("BENEFIT_DISCOUNT_AMOUNT"),
    [BenefitType.FREE_PRODUCT]: t("BENEFIT_FREE_PRODUCT"),
  };

  const getBenefitValue = () => {
    if (!terms) return "";

    switch (benefitType) {
      case BenefitType.DISCOUNT_PERCENT:
        return terms.percent ? `${terms.percent}%` : "";
      case BenefitType.DISCOUNT_AMOUNT:
        return terms.amount ? `$${Number(terms.amount).toFixed(2)}` : "";
      case BenefitType.FREE_PRODUCT:
        return terms.giftQuantity ? `×${terms.giftQuantity}` : "";
      default:
        return "";
    }
  };

  const benefitValue = getBenefitValue();

  return (
    <Space direction="vertical" size="small">
      <Tag color={BENEFIT_TYPE_COLORS[benefitType]} style={{ margin: 0 }}>
        {benefitLabels[benefitType]}
      </Tag>
      {benefitValue && (
        <small style={{ color: "#666", fontSize: "11px", fontWeight: 500 }}>
          {benefitValue}
        </small>
      )}
    </Space>
  );
};
