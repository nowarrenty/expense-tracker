import { EventBus } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

export interface EventBridgeProps {}

export class EventBridge extends Construct {
  readonly bus: EventBus;
  constructor(scope: Construct, id: string, props: EventBridgeProps) {
    super(scope, id);
    this.bus = new EventBus(this, "bus");
  }
}
