import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class SharedDatastore extends Construct {
  readonly ddbTable: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.ddbTable = new Table(this, "table", {
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, "Dynamodb-Table-Name", {
      exportName: "DynamoDB-Table-Name",
      value: this.ddbTable.tableName,
    });
  }

  grantReadWritePermissions(functions: NodejsFunction[]) {
    functions.forEach((fn) => this.ddbTable.grantReadWriteData(fn));
  }
}
