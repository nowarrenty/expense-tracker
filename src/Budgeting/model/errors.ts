import { DomainError } from "./types";

const InvalidCurrencyCodeError: DomainError = {
  message: "Error: Invalid Currency Code",
  name: "Invalid_Currency_Code",
};

const InvalidAccountError: DomainError = {
  message: "Error: Transaction must have a valid userId",
  name: "Invalid_Account_Error",
};

const NegativeAmountError: DomainError = {
  message: "Error: Amount value is negative",
  name: "Negative_Amount_Error",
};

const NonIntegerAmountError: DomainError = {
  message: "Error: Transaction amount must not be decimal",
  name: "Non_Integer_Amount_Error",
};

const InvalidTimeError: DomainError = {
  message: "Error: Invalid time value",
  name: "Invalid_Time_Value",
};
export {
  InvalidCurrencyCodeError,
  InvalidAccountError,
  NegativeAmountError,
  NonIntegerAmountError,
  InvalidTimeError,
};
