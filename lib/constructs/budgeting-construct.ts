import { CfnOutput } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface BudgetingConstructProps {
  table: Table;
}

export class BudgetingConstruct extends Construct {
  readonly addTrnxFn: NodejsFunction;

  constructor(scope: Construct, id: string, props: BudgetingConstructProps) {
    super(scope, id);

    this.addTrnxFn = new NodejsFunction(this, "add-trnx-fn", {
      logRetention: 30,
      tracing: Tracing.ACTIVE,
      memorySize: 1024,
      environment: { DATABASE_NAME: props.table.tableName },
      entry: join(
        __dirname,
        "../../src/Budgeting/infrastructure/lambda/add-trxn-fn.ts"
      ),
    });

    new CfnOutput(this, "add-trnx-fn name", {
      exportName: "add-trnx-fn-name",
      value: this.addTrnxFn.functionName,
    });
  }
}
