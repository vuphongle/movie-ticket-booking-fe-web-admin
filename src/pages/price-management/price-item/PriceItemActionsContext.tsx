import { createContext, useContext } from "react";
import type { PriceItem } from "@/types";

interface PriceItemActionsContextType {
  onEdit?: (item: PriceItem) => void;
}

export const PriceItemActionsContext =
  createContext<PriceItemActionsContextType>({});

export const usePriceItemActions = () => {
  return useContext(PriceItemActionsContext);
};
