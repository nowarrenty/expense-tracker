import { Result } from "neverthrow";
import { ResolvableError } from "../../shared/types";
import { CurrencyCode, Id, TransactionSnapshot } from "../model/types";

export interface TransactionDTO {
  id: Id;
  userId: Id;
  date: string;
  amount: bigint;
  currencyCode: CurrencyCode;
  vendor?: string;
  memo?: string;
  // category: string;
}

export interface AddTransactionDTO {
  userId: Id;
  date: string;
  amount: bigint;
  currencyCode: CurrencyCode;
  vendor?: string;
  memo?: string;
}

export type AddTransactionResult = Promise<
  Result<TransactionSnapshot, ResolvableError>
>;

export interface ApplicationError extends ResolvableError {}

export type LogProps = { level: string; message: string };

export interface Logger {
  log(props: LogProps): void;
}
