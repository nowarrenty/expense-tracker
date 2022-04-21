import { Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ReceiptRuleSet } from "aws-cdk-lib/aws-ses";
import { Subscription, SubscriptionProtocol, Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

/**
 * Construct that allows configured SES domain to received emails.
 *
 * AWS Resources used:
 * * SNS
 * * SES
 * * S3
 * * Lambda
 * * EventBridge
 *
 *  SES must be configured in your region to accept emails from
 *  the domain of your choice.
 *  See https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html for more info.
 */
export class EmailReceiver extends Construct {
  readonly ruleSet: ReceiptRuleSet;
  readonly classierFn: NodejsFunction;
  readonly emailTopic: Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.ruleSet = new ReceiptRuleSet(this, "rule-set", {
      dropSpam: true,
    });

    //TODO Remove this confidential info
    //TODO define the emails patterns that emails should be received from.
    const receiveRule = this.ruleSet.addRule("alerts", {
      recipients: ["", "", "", ""],
    });

    // Create a topic that emails should be send to
    this.emailTopic = new Topic(this, "topic");

    // Create a lambda funciton to be invoked by SES ruleset
    this.classierFn = new NodejsFunction(this, "", {
      entry: "",
      handler: "",
      tracing: Tracing.ACTIVE,
    });

    // Subcscription to invoke lambda after SNS receives an email
    const emailSubscription = new Subscription(this, "subscription", {
      topic: this.emailTopic,
      protocol: SubscriptionProtocol.LAMBDA,
      endpoint: this.classierFn.functionArn,
    });
  }
}
