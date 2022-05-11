import { Construct } from "constructs";
import { GraphAPI } from "./api/appsync-api-construct";
import { BudgetingConstruct } from "./budgeting-construct";
import { SharedDatastore } from "./shared-datastore-construct";

export interface BackendConstructProps {}

export class BackendConstruct extends Construct {
  readonly budgetingConstruct: BudgetingConstruct;
  readonly sharedDatastore: SharedDatastore;
  readonly graphAPI: GraphAPI;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.sharedDatastore = new SharedDatastore(this, "Datastore");
    this.budgetingConstruct = new BudgetingConstruct(
      this,
      "Budgeting-Service-Construct",
      { table: this.sharedDatastore.ddbTable }
    );
    this.sharedDatastore.grantReadWritePermissions([
      this.budgetingConstruct.addTrxnFn,
    ]);

    this.graphAPI = new GraphAPI(this, "api", {
      database: this.sharedDatastore.ddbTable,
      transactionFn: this.budgetingConstruct.addTrxnFn,
    });
  }
}
