import * as DineroCurrencies from "@dinero.js/currencies";
import hasKey from "../../../utils/hasKey";
import { TransactionItem } from "../types";

export function isTransactionItem(val: unknown): val is TransactionItem {
  const stringTypes = ["PK", "SK", "accountId", "date", "currencyCode"];

  // Loop through all the string types
  // and verify if they exisit and
  // are if type string
  // If not string return false.
  for (const type of stringTypes) {
    if (!(typeof (val as Record<string, any>)[type] === "string")) return false;
  }

  // Check that the currencyCode value
  // is a valid dinero currency
  if (!hasKey(DineroCurrencies, (val as Record<string, any>)["currencyCode"]))
    return false;

  // Check that amount is type number
  const amount = (val as Record<string, any>)["amount"];
  if (!(typeof amount === "number")) return false;
  if (!Number.isSafeInteger(amount)) return false;

  // if everything is ok return true;
  return true;
}
