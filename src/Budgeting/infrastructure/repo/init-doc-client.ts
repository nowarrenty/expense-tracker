import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Creates a DynamoDBDocumentClien using sensible 
 * defaults for marshalling and unmarshalling data.
 * 
 * @returns An initialized DynamoDBDOcumentClient
 */
export default function intDocClient(): DynamoDBDocumentClient {
  const dynamoDBClient = new DynamoDBClient({});
  const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  };

  const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  };

  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(dynamoDBClient, translateConfig);
}
