import { Construct } from "constructs";
import {
  GraphqlApi,
  MappingTemplate,
  ResolvableField,
  Schema,
} from "@aws-cdk/aws-appsync-alpha";
import {
  addTransactionInput,
  gqlObjects,
  requiredString,
  transactionType,
} from "./appsync-types";
import { currencyCodeEnum } from "./currency-code-enum";
import type { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { CfnOutput } from "aws-cdk-lib";

interface GraphAPIProps {
  database: Table;
  transactionFn: NodejsFunction;
}

export class GraphAPI extends Construct {
  readonly api: GraphqlApi;

  constructor(scope: Construct, id: string, props: GraphAPIProps) {
    super(scope, id);

    const schema = new Schema();
    schema.addType(currencyCodeEnum);
    gqlObjects.forEach((type) => schema.addType(type));

    this.api = new GraphqlApi(this, "GraphAPI", {
      name: "GraphQLAPI",
      schema: schema,
      xrayEnabled: true,
    });

    const dynamodbDataSource = this.api.addDynamoDbDataSource(
      "dynamodb-data-source",
      props.database,
      {
        name: "dynamodb-data-source",
        description: "DynamoDB table used for all app data",
      }
    );

    const transactionFnSource = this.api.addLambdaDataSource(
      "transaction",
      props.transactionFn,
      {
        name: "transactionfn",
        description: "Lambda function to handle transactions",
      }
    );

    this.api.addQuery(
      "transaction",
      new ResolvableField({
        returnType: transactionType.attribute(),
        args: { id: requiredString },
        dataSource: dynamodbDataSource,
        requestMappingTemplate: MappingTemplate.fromFile(
          join(
            __dirname,
            "mapping-templates/by-id-request.vtl"
          )
        ),
        responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
      })
    );

    this.api.addMutation(
      "addTransaction",
      new ResolvableField({
        returnType: transactionType.attribute(),
        args: { input: addTransactionInput.attribute() },
        dataSource: transactionFnSource,
      })
    );

    new CfnOutput(this, "graphql-url", {
      exportName: "graphql-url",
      value: this.api.graphqlUrl,
    });

    new CfnOutput(this, "graphql-id", {
      exportName: "graphql-api-id",
      value: this.api.apiId,
    });
  }
}
