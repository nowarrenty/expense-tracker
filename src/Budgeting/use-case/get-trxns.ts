import { WinstonLogger } from "../../utils/winston-logger";
import { TransactionProbe } from "./utils/trnx-probe";
import { MissinguserIdError } from "./errors";

export interface GetTransactionsProps {
  userId: string;
}

export async function getTransactions(props: GetTransactionsProps) {
  const probe = new TransactionProbe(new WinstonLogger());
  if (!props.userId) return MissinguserIdError;
  
}
