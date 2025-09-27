import { Space, Tag } from "antd";
import { TargetType, BenefitType } from "@/types";
import { TARGET_TYPE_COLORS, BENEFIT_TYPE_COLORS } from "../constants";

interface TargetTypeDisplayProps {
  targetType: TargetType;
  targetRefId?: number;
}

export const TargetTypeDisplay = ({ targetType }: TargetTypeDisplayProps) => {
  return (
    <Space direction="vertical" size="small">
      <Tag color={TARGET_TYPE_COLORS[targetType]} style={{ margin: 0 }}>
        {targetType.replace("_", " ")}
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
        {benefitType.replace("_", " ")}
      </Tag>
      {benefitValue && (
        <small style={{ color: "#666", fontSize: "11px", fontWeight: 500 }}>
          {benefitValue}
        </small>
      )}
    </Space>
  );
};
