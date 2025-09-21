import { PlusOutlined } from "@ant-design/icons";
import { Button, theme, Typography, Tabs, Badge } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useGetPriceItemsByPriceListIdQuery } from "@/app/services/priceItem.service";
import type { PriceList, PriceItem } from "@/types";
import PriceItemTable from "./PriceItemTable";
import PriceItemModal from "./PriceItemModal";
import { PriceItemActionsContext } from "./PriceItemActionsContext";

interface PriceItemSectionProps {
  priceList: PriceList;
}

const PriceItemSection = ({ priceList }: PriceItemSectionProps) => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data: priceItems = [], isLoading } =
    useGetPriceItemsByPriceListIdQuery(priceList.id);

  const [activeTab, setActiveTab] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);

  const handleCreateItem = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleEditItem = (item: PriceItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  // Count items by type
  const ticketItems = priceItems.filter((item) => item.targetType === "TICKET");
  const productItems = priceItems.filter(
    (item) => item.targetType === "PRODUCT"
  );
  const serviceItems = priceItems.filter(
    (item) => item.targetType === "ADDITIONAL_SERVICE"
  );

  const tabItems = [
    {
      key: "all",
      label: (
        <Badge count={priceItems.length} size="small" offset={[10, 0]}>
          {t("ALL_PRICE_ITEMS")}
        </Badge>
      ),
      children: (
        <PriceItemActionsContext.Provider value={{ onEdit: handleEditItem }}>
          <PriceItemTable
            data={priceItems}
            loading={isLoading}
            hideTargetType={true}
          />
        </PriceItemActionsContext.Provider>
      ),
    },
    {
      key: "tickets",
      label: (
        <Badge count={ticketItems.length} size="small" offset={[10, 0]}>
          {t("TICKET_PRICES")}
        </Badge>
      ),
      children: (
        <PriceItemActionsContext.Provider value={{ onEdit: handleEditItem }}>
          <PriceItemTable
            data={ticketItems}
            loading={isLoading}
            hideTargetType={true}
            hideTargetName={true}
          />
        </PriceItemActionsContext.Provider>
      ),
    },
    {
      key: "products",
      label: (
        <Badge count={productItems.length} size="small" offset={[10, 0]}>
          {t("PRODUCT_PRICES")}
        </Badge>
      ),
      children: (
        <PriceItemActionsContext.Provider value={{ onEdit: handleEditItem }}>
          <PriceItemTable
            data={productItems}
            loading={isLoading}
            hideTargetType={true}
            hideSpecificity={true}
            hideTicketConditions={true}
          />
        </PriceItemActionsContext.Provider>
      ),
    },
    {
      key: "services",
      label: (
        <Badge count={serviceItems.length} size="small" offset={[10, 0]}>
          {t("ADDITIONAL_SERVICE_PRICES")}
        </Badge>
      ),
      children: (
        <PriceItemActionsContext.Provider value={{ onEdit: handleEditItem }}>
          <PriceItemTable
            data={serviceItems}
            loading={isLoading}
            hideTargetType={true}
            hideSpecificity={true}
            hideTicketConditions={true}
          />
        </PriceItemActionsContext.Provider>
      ),
    },
  ];

  return (
    <PriceItemActionsContext.Provider value={{ onEdit: handleEditItem }}>
      <div
        style={{
          marginTop: 24,
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography.Title level={4}>
            {t("PRICE_ITEMS_FOR_LIST", { name: priceList.name })}
          </Typography.Title>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateItem}
          >
            {t("CREATE_PRICE_ITEM")}
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="small"
        />

        <PriceItemModal
          visible={modalVisible}
          onCancel={handleCloseModal}
          priceList={priceList}
          editingItem={editingItem}
        />
      </div>
    </PriceItemActionsContext.Provider>
  );
};

export default PriceItemSection;
