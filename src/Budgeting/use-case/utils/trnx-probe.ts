import { TransactionSnapshot } from "../../model/types";
import { Logger, AddTransactionDTO } from "../types";

export class TransactionProbe {
  #logger: Logger;
  constructor(logger: Logger) {
    this.#logger = logger;
  }

  attemptingTransactionValidation(dto: AddTransactionDTO) {
    this.#logger.log({
      level: "info",
      message: `Attempting transaction validation on ${JSON.stringify(dto)}`,
    });
  }

  transactionValidationPassed(snapshot: TransactionSnapshot) {
    this.#logger.log({
      level: "info",
      message: `Transaction validation passed on ${JSON.stringify(snapshot)}`,
    });
  }

  transactionValidationFailed(message: string) {
    this.#logger.log({
      level: "error",
      message: `Transaction validation failed. Error message: ${message}`,
    });
  }
}
