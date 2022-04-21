import { Dinero, DineroSnapshot } from "dinero.js";
import * as DineroCurrencyCodes from "@dinero.js/currencies";
import { ResolvableError } from "../../shared/types";

export enum TransactionType {
  BNS_ATM_WITHDRAWAL,
  BNS_BILL_PAYMENT,
  BNS_CREDIT_CARD_USED,
  BNS_DEBIT_CARD_PURCHASE,
  BNS_PURCHASE_OUTSIDE_COUNTRY,
  BNS_TRANSFER_TO_RECIPIENT,
  BNS_OUTSIDE_OF_COUNTRY_AUTH,
  NONE,
}

export enum CardType {
  DEBIT,
  CREDIT,
}

export interface DomainError extends ResolvableError {}

export enum TransactionCategory {
  EXPENSE,
  INCOME,
}

export type Id = string;
export type Money = Dinero<number>;
export type MoneySnapshot = DineroSnapshot<number>;
export type CurrencyCode = keyof typeof DineroCurrencyCodes;

export interface TransactionProps {
  id?: Id;
  accountId: Id;
  date: Date;
  value: Money;
  vendor?: string;
  memo?: string;
}

export interface TransactionSnapshot {
  id: Id;
  accountId: Id;
  date: string;
  amount: number;
  currencyCode: CurrencyCode;
  vendor?: string;
  memo?: string;
}
