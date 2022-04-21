import { customAlphabet } from "nanoid";

/**
 *
 * @param alphabet  Alphabet used to generate this ID. The default is "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
 * @param defaultSize  Size of the ID. The default size is 21.
 * @returns A random string.
 */
export function idGenerator(
  alphabet: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  defaultSize: number = 21
): string {
  const customNanoId = customAlphabet(alphabet, defaultSize);
  return customNanoId();
}
