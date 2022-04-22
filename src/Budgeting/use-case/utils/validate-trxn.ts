import * as DineroCurrencies from "@dinero.js/currencies";
import { dinero } from "dinero.js";
import { err, ok, Result } from "neverthrow";
import hasKey from "../../../utils/has-key";
import isISODateCompatible from "../../../utils/is-iso-date-compatible";
import { Transaction } from "../../model/trxn";
import {
  InvalidTimeError,
  MaximumAmountExceededError,
  MemoTooLongError,
  MissingAccountIdError,
  NotSafeIntegerAmountError,
  NegativeAmountError,
} from "../errors";
import { ApplicationError, TransactionDTO, AddTransactionDTO } from "../types";

export function validateTransactionDTO(
  dto: TransactionDTO | AddTransactionDTO
): Result<Transaction, ApplicationError> {
  if (!Number.isSafeInteger(Number(dto.amount))) {
    return err(NotSafeIntegerAmountError);
  }

  if (!isISODateCompatible(dto.date)) {
    return err(InvalidTimeError);
  }
  if (Number(dto.amount) < 0) {
    return err(NegativeAmountError);
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
