import { Result } from "neverthrow";

/**
 * Checks if date can be parsed into a valid ISO string
 */
const isISODateCompatible = (date: string) => {
  const maybeDate = new Date(date);
  const dateResult = Result.fromThrowable(
    maybeDate.toISOString.bind(maybeDate)
  );
  if (dateResult().isErr()) return false;
  return true;
};

export default isISODateCompatible;
