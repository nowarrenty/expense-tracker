import { RemovalPolicy } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

/**
 * Properties used to construc S3 bucket,
 * 
 * @param prod  Whether this bucket will be used in production or not. Only production buckets will be retained after stack destruction.
 */
interface S3Props {
  prod: Boolean;
}

/**
 * Encrypted S3 Bucket class.
 */
export class S3 extends Construct {

  /**
   * AWS Bucket construct
   */
  readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props: S3Props) {
    super(scope, id);
    this.bucket = new Bucket(this, id + "-bucket", {
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: props.prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      versioned: true,
    });
  }
}
