import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export async function getSSMParam(name: string) {
  const client = new SSMClient({});
  const command = new GetParameterCommand({ Name: name });
  const response = await client.send(command);
  return response.Parameter;
}
