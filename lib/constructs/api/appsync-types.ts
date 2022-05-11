import {
  GraphqlType,
  IIntermediateType,
  InputType,
  InterfaceType,
  ObjectType,
  ResolvableField,
} from "@aws-cdk/aws-appsync-alpha";

import { currencyCodeEnum } from "./currency-code-enum";

export const requiredId = GraphqlType.id({ isRequired: true });
export const requiredDate = GraphqlType.awsDate({ isRequired: true });
export const requiredInt = GraphqlType.int({ isRequired: true });
export const requiredString = GraphqlType.string({ isRequired: true });
export const optionalString = GraphqlType.string();
export const requiredCurrencyCode = GraphqlType.intermediate({
  intermediateType: currencyCodeEnum,
  isRequired: true,
});

const nodeInterface = new InterfaceType("Node", {
  definition: { id: requiredId },
});

export const addTransactionInput = new InputType("AddTransactionInput", {
  definition: {
    userId: requiredId,
    date: requiredDate,
    amount: requiredInt,
    vendor: optionalString,
    memo: optionalString,
    currencyCode: requiredCurrencyCode,
  },
});

export const transactionType = new ObjectType("Transaction", {
  interfaceTypes: [nodeInterface],
  definition: {
    userId: requiredId,
    date: requiredDate,
    amount: requiredInt,
    vendor: optionalString,
    memo: optionalString,
    currencyCode: requiredCurrencyCode,
  },
});

const gqlObjects: IIntermediateType[] = [nodeInterface, transactionType];

export { gqlObjects };
