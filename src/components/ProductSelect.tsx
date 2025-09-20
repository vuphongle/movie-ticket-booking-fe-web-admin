import { Select, Empty } from "antd";
import type { SelectProps } from "antd";
import { useTranslation } from "react-i18next";
import { useGetProductsQuery } from "@/app/services/products.service";
import type { Product } from "@/types";

interface ProductSelectProps extends Omit<SelectProps, "options"> {
  onProductChange?: (product: Product | null) => void;
}

const ProductSelect = ({ onProductChange, ...props }: ProductSelectProps) => {
  const { t } = useTranslation();
  const { data: products, isLoading, error } = useGetProductsQuery(true);

  const handleChange = (value: number | null, option: any) => {
    const safeProducts = products || [];
    const selectedProduct = value
      ? safeProducts.find((p: Product) => p && p.id === value) || null
      : null;
    onProductChange?.(selectedProduct);
    props.onChange?.(value, option);
  };

  // Xử lý trường hợp error
  if (error) {
    return (
      <Select
        {...props}
        placeholder={
          t("ERROR_LOADING_PRODUCTS") || "Lỗi tải danh sách sản phẩm"
        }
        disabled
        notFoundContent={
          <Empty
            description={
              t("ERROR_LOADING_PRODUCTS") || "Lỗi tải danh sách sản phẩm"
            }
          />
        }
      />
    );
  }

  // Xử lý trường hợp không có dữ liệu
  const safeProducts = (products || []).filter(
    (product: Product) => product && product.id && product.name
  );
  const options = safeProducts.map((product: Product) => ({
    label: `${product.name} (${product.sku || "N/A"}) - SL: ${product.quantity || 0} ${product.unit || ""}`,
    value: product.id,
    product: product,
  }));

  return (
    <Select
      showSearch
      placeholder={
        isLoading
          ? t("LOADING_PRODUCTS") || "Đang tải..."
          : t("SELECT_PRODUCT") || "Chọn sản phẩm"
      }
      optionFilterProp="label"
      loading={isLoading}
      options={options}
      notFoundContent={
        isLoading ? null : (
          <Empty
            description={
              safeProducts.length === 0
                ? t("NO_PRODUCTS_AVAILABLE") || "Không có sản phẩm nào"
                : t("NO_MATCHING_PRODUCTS") || "Không tìm thấy sản phẩm phù hợp"
            }
          />
        )
      }
      {...props}
      onChange={handleChange}
    />
  );
};

export default ProductSelect;
