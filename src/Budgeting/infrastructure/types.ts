import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Result } from "neverthrow";
import { ResolvableError } from "../../shared/types";
import { Transaction } from "../model/trxn";
import { CurrencyCode, Id, TransactionSnapshot } from "../model/types";

export interface RepositoryError extends ResolvableError {}

export type FindByIdResult = Promise<
  Result<Transaction, boolean | ResolvableError>
>;
export type SaveTransactionResult = Promise<
  Result<TransactionSnapshot, RepositoryError>
>;

export interface DDBTransactionRepoProps {
  client: DynamoDBDocumentClient;
  tableName: string;
}

export interface TransactionRepository {
  save(transaction: Transaction): SaveTransactionResult;
  // remove(id: Id): Result<Id, RepositoryError>;
  findById(id: Id): FindByIdResult;
}
export type TransactionItem = {
  PK: string;
  SK: string;
  userId: Id;
  date: string;
  amount: number;
  currencyCode: CurrencyCode;
  vendor?: string;
  memo?: string;
};
