import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BackendConstruct } from "./constructs/backend-construct";

export class ExpenseTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);
    new BackendConstruct(this, "Backend-Construct");
  }
}
