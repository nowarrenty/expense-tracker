/**
 * Use this function to retrieve an environment variable
 * without cluttering code.
 *
 * This method should only be used in a lambda function
 * to separate infrastucture concerns from the rest
 * of the code base.
 *
 * @param name Envrionment variable that should be procossed.
 * @returns string value of the environment variable requested.
 * @throws An error if the environment variable is not found.
 */
export function getEnvVar(name: string) {
  const varOrUndefined = process.env[name];
  if (!varOrUndefined) throw new Error(`Missing env var ${name}`);
  return varOrUndefined;
}
