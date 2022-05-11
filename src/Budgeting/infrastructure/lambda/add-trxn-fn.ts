import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Handler } from "aws-lambda";
import { AddTransactionDTO } from "../../use-case/types";
import { DDBTransactionRepo } from "../repo/ddb-trxn-repo";
import { addTransaction } from "../../use-case/add-trxn";
import { TransactionSnapshot } from "../../model/types";
import initDocClient from "../repo/init-doc-client";
import { getEnvVar } from "./utils/get-env-var";

type AddTransactionHandler = Handler<any, TransactionSnapshot | string>;

let docClient: DynamoDBDocumentClient;
docClient ??= initDocClient();
let tableName = getEnvVar("DATABASE_NAME");

export const handler: AddTransactionHandler = async (event, context) => {
  const repo = new DDBTransactionRepo({
    client: docClient,
    tableName: tableName,
  });

  const input = event.arguments.input;
  const addTransactionDTO: AddTransactionDTO = {
    userId: input.userId,
    date: input.date,
    currencyCode: input.currencyCode,
    amount: input.amount,
    memo: input.memo,
    vendor: input.vendor,
  };
  const result = await addTransaction(addTransactionDTO, repo);
  return result.isErr() ? result.error.message : result.value;
};
