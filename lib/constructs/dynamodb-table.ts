import { Construct } from "constructs";
import {
  Table,
  AttributeType,
  GlobalSecondaryIndexProps,
  BillingMode,
} from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";

/**
 * @param gsiList List of GSIs to be added to the table
 */
export interface DynamoDBTableProps {
  gsiList?: GlobalSecondaryIndexProps[];
  prod?: Boolean;
}

/**
 * User defined DynamoDB Table construct with some useful defaults
 */
export class DynamoDBTable extends Construct {
  /**
   * AWS DynamoDB table construct
   */
  readonly table: Table;

  constructor(scope: Construct, id: string, props?: DynamoDBTableProps) {
    super(scope, id);

    // Add default Partition and Sort keys
    this.table = new Table(this, id, {
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props?.prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    // Add all GSIs passed in by props
    if (props?.gsiList) {
      props.gsiList.forEach((gsi) => this.table.addGlobalSecondaryIndex(gsi));
    }
  }

  /**
   * Call to table.addGlobalSecondaryIndex
   * @props gsi the property of global secondary index
   */
  addGSI(gsi: GlobalSecondaryIndexProps) {
    this.table.addGlobalSecondaryIndex(gsi);
  }
}
