import { Construct } from "constructs";
import { BudgetingConstruct } from "./budgeting-construct";
import { SharedDatastore } from "./shared-datastore-construct";

export interface BackendConstructProps {}

export class BackendConstruct extends Construct {
  readonly budgetingConstruct: BudgetingConstruct;
  readonly sharedDatastore: SharedDatastore;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.sharedDatastore = new SharedDatastore(this, "Datastore");
    this.budgetingConstruct = new BudgetingConstruct(
      this,
      "Budgeting-Service-Construct",
      { table: this.sharedDatastore.ddbTable }
    );
    this.sharedDatastore.grantReadWritePermissions([
      this.budgetingConstruct.addTrnxFn,
    ]);
  }
}
