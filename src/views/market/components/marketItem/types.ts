import { ActionType } from "@/types";

export interface IMarketItem {
  id: string;
  name: string;
  coinIcon: string;
  hasGuarantee: boolean;
  marketType: ActionType;

  unitPrice: string;
  totalPrice: string;
  currencyName: string;
}