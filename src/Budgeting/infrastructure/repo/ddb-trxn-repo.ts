import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { err, ok, ResultAsync } from "neverthrow";
import { WinstonLogger } from "../../../utils/winston-logger";
import { Transaction } from "../../model/trxn";
import { TransactionSnapshot } from "../../model/types";
import { Logger } from "../../use-case/types";
import {
  DDBTransactionRepoProps,
  FindByIdResult,
  RepositoryError,
  SaveTransactionResult,
  TransactionRepository,
} from "../types";
import { isTransactionItem } from "./is-trxn-item";

export class DDBTransactionRepo implements TransactionRepository {
  #ddbDocClient: DynamoDBDocumentClient;
  #tableName: string;
  #logger: Logger = new WinstonLogger();

  constructor(props: DDBTransactionRepoProps) {
    this.#ddbDocClient = props.client;
    this.#tableName = props.tableName;
  }

  /**
   *
   * @param transaction
   * @returns
   */
  async save(transaction: Transaction): SaveTransactionResult {
    const snapshot = transaction.toSnapshot();
    const input: PutCommandInput = {
      TableName: this.#tableName,
      Item: {
        PK: snapshot.id,
        SK: snapshot.id,
        accountId: snapshot.accountId,
        date: snapshot.date,
        amount: snapshot.amount,
        currencyCode: snapshot.currencyCode,
        vendor: snapshot.vendor,
        memo: snapshot.memo,
      },
    };

    this.#logger.log({
      level: "info",
      message: `Attempting to execute DynamoDB Put on: ${JSON.stringify(
        input
      )}`,
    });

    const command = new PutCommand(input);
    const result = await ResultAsync.fromPromise(
      this.#ddbDocClient.send(command),
      (error) => {
        const dynamoDBErr = error as DynamoDBServiceException;
        const rError: RepositoryError = {
          message: dynamoDBErr.message,
          name: dynamoDBErr.name,
        };
        return rError;
      }
    );
    if (result.isErr()) {
      this.#logger.log({
        level: "error",
        message: `Error: ${JSON.stringify(result.error)}`,
      });
      return err(result.error);
    }
    this.#logger.log({
      level: "info",
      message: `Successfully executed DynamoDB Put on: ${JSON.stringify(
        input.Item
      )}`,
    });
    return ok(snapshot);
  }

  async findById(id: string): FindByIdResult {
    const input: GetCommandInput = {
      TableName: this.#tableName,
      Key: {
        PK: id,
        SK: id,
      },
    };
    const command = new GetCommand(input);
    const dbResult = await ResultAsync.fromPromise(
      this.#ddbDocClient.send(command),
      (error) => {
        const dynamoDBErr = error as DynamoDBServiceException;
        const rError: RepositoryError = {
          message: dynamoDBErr.message,
          name: dynamoDBErr.name,
        };
        return err(rError);
      }
    );
    if (dbResult.isErr()) return dbResult.error;
    const item = dbResult.value.Item;
    if (!item) return err(false);
    if (!isTransactionItem(item)) {
      const error: RepositoryError = {
        message: "Malformed TransactionItem",
        name: "Malformed_Transaction_Item",
      };
      return err(error);
    }

    const snapshot: TransactionSnapshot = {
      id: item.PK,
      accountId: item.accountId,
      date: item.date,
      currencyCode: item.currencyCode,
      amount: item.amount,
    };

    // Handle optional fields
    if (item.vendor) snapshot.vendor = item.vendor;
    if (item.memo) snapshot.memo = item.memo;

    return Transaction.fromSnapshot(snapshot);
  }
}
