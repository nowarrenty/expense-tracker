import { Stack, StackProps } from "aws-cdk-lib";
import { Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { join } from "path";
import { DynamoDBTable } from "./constructs/dynamodb-table";

export class ExpenseTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new DynamoDBTable(this, "table");

    const tableNameParamter = StringParameter.fromStringParameterAttributes(
      this,
      "tableNameParamter",
      { parameterName: "/expense-tracker/dynamodb-table-name" }
    );

    const addTrxnFn = new NodejsFunction(this, "add-trxn-fn", {
      entry: join(
        __dirname,
        "../src/Budgeting/infrastructure/lambda/add-trxn-fn.ts"
      ),
      logRetention: 30,
      tracing: Tracing.ACTIVE,
      memorySize: 2048,
      environment: { DATABASE_NAME: tableNameParamter.stringValue },
    });
    table.table.grantReadWriteData(addTrxnFn);
  }
}
