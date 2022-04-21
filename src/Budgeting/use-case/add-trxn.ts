import { err } from "neverthrow";
import { TransactionRepository } from "../infrastructure/types";
import { AddTransactionDTO, AddTransactionResult } from "./types";
import { TransactionProbe } from "./utils/trnx-probe";
import { validateTransactionDTO } from "./utils/validate-trxn";
import { WinstonLogger } from "../../utils/winston-logger";

export interface AddTransctionProps {
  transactionDTO: AddTransactionDTO;
  repo: TransactionRepository;
}

//TODO
/**
 *
 * @param dto
 * @param repo
 * @returns
 */
export async function addTransaction(
  dto: AddTransactionDTO,
  repo: TransactionRepository
): AddTransactionResult {
  const probe = new TransactionProbe(new WinstonLogger());
  probe.attemptingTransactionValidation(dto);
  const transactionOrError = validateTransactionDTO(dto);

  if (transactionOrError.isErr()) {
    const error = transactionOrError.error;
    probe.transactionValidationFailed(error.message);
    return err(transactionOrError.error);
  }

  probe.transactionValidationPassed(transactionOrError.value.toSnapshot());
  return repo.save(transactionOrError.value);
}
