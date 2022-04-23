import { RemovalPolicy } from "aws-cdk-lib";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface TableProps {
  prod: boolean;
}

export class BaseTable extends Construct {
  readonly table: Table;

  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id);

    this.table = new Table(this, id, {
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props?.prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
  }
}
