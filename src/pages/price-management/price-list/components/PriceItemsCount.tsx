import { Tag } from "antd";
import { useGetPriceItemsByPriceListIdQuery } from "@/app/services/priceItem.service";
import type { PriceList } from "@/types";

interface PriceItemsCountProps {
  priceList: PriceList;
}

const PriceItemsCount = ({ priceList }: PriceItemsCountProps) => {
  // Check if we already have the count from existing data
  const hasDirectCount = priceList.priceItemsCount !== undefined;
  const hasArrayData =
    priceList.priceItems && Array.isArray(priceList.priceItems);

  // Only fetch if we don't have any existing data
  const shouldFetch = !hasDirectCount && !hasArrayData;

  const {
    data: priceItems,
    isLoading,
    error,
  } = useGetPriceItemsByPriceListIdQuery(priceList.id, {
    skip: !shouldFetch,
  });

  // Priority 1: Use priceItemsCount if available
  if (hasDirectCount) {
    return <Tag color="blue">{priceList.priceItemsCount}</Tag>;
  }

  // Priority 2: Use priceItems array length if available
  if (hasArrayData) {
    return <Tag color="blue">{priceList.priceItems!.length}</Tag>;
  }

  // Priority 3: Handle API fetch states
  if (isLoading) {
    return <Tag color="blue">...</Tag>;
  }

  if (error) {
    return <Tag color="orange">-</Tag>;
  }

  // Priority 4: Use fetched data length
  const count = priceItems?.length ?? 0;
  return <Tag color="blue">{count}</Tag>;
};

export default PriceItemsCount;
