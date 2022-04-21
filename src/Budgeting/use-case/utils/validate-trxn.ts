import * as DineroCurrencies from "@dinero.js/currencies";
import { dinero } from "dinero.js";
import { err, ok, Result } from "neverthrow";
import hasKey from "../../../utils/hasKey";
import isISODateCompatible from "../../../utils/isISODateCompatible";
import { Transaction } from "../../model/trxn";
import {
  InvalidTimeError,
  MaximumAmountExceededError,
  MemoTooLongError,
  MissingAccountIdError,
  NonIntegerAmountError,
} from "../errors";
import { ApplicationError, TransactionDTO, AddTransactionDTO } from "../types";

export function validateTransactionDTO(
  dto: TransactionDTO | AddTransactionDTO
): Result<Transaction, ApplicationError> {
  if (!Number.isSafeInteger(dto.amount)) {
    return err(NonIntegerAmountError);
  }

  if (!isISODateCompatible(dto.date)) {
    return err(InvalidTimeError);
  }
  if (Number(dto.amount) < 0) {
    return err(InvalidTimeError);
  }

  if (Number(dto.amount) > Number.MAX_SAFE_INTEGER) {
    return err(MaximumAmountExceededError);
  }

  if (dto.memo) {
    if (dto.memo?.length > 150) {
      return err(MemoTooLongError);
    }
  }

  if (!dto.accountId) {
    return err(MissingAccountIdError);
  }

  if (!hasKey(DineroCurrencies, dto.currencyCode)) {
    return err({
      message: "Currency not found",
      name: "Invalid_Currency_Error",
    });
  }

  const transactionResult = Transaction.create({
    accountId: dto.accountId,
    date: new Date(dto.date),
    value: dinero({
      amount: Number(dto.amount),
      currency: DineroCurrencies[dto.currencyCode],
    }),
    vendor: dto.vendor,
    memo: dto.memo,
  });

  // TODO
  // Convert domain error to application error to prevent leaking
  // domain details
  if (transactionResult.isErr()) {
    return err(transactionResult.error);
  }

  return ok(transactionResult.value);
}
