import { RepositoryError } from "./types";

const MalformedTransactionItemError: RepositoryError = {
  message: "Error: Malformed transaction item",
  name: "Malformed_Transaction_Item",
};

export { MalformedTransactionItemError };
