import { ApplicationError } from "./types";

const MissingAccountIdError: ApplicationError = {
  message: "Error: Missing accountId",
  name: "Missing_Account_ID_Error",
};

const NonIntegerAmountError: ApplicationError = {
  message: "Error: Amount must be an integer",
  name: "Invalid_Amount_Error",
};

const InvalidTimeError: ApplicationError = {
  message: "Error: Invalid time value",
  name: "Invalid_Time_Error",
};

const MaximumAmountExceededError: ApplicationError = {
  message: `Error: Amount cannot be greater than ${Number.MAX_SAFE_INTEGER}`,
  name: "Amount_Too_Large_Error",
};

const MemoTooLongError: ApplicationError = {
  message: "Error: Memo cannot be longer than 150 characters",
  name: "Memo_Too_Long_Error",
};

const InvalidCurrencyError: ApplicationError = {
  message: "Error: Currency not found",
  name: "Invalid_Currency_Error",
};

export {
  MissingAccountIdError,
  NonIntegerAmountError,
  InvalidTimeError,
  MaximumAmountExceededError,
  MemoTooLongError,
  InvalidCurrencyError,
};
