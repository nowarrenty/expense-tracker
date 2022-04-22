import isISODateCompatible from "../is-iso-date-compatible";

describe("isISODateCompatible", () => {
  it("Should return should return true for valid date", () => {
    expect(isISODateCompatible("2022-1-22")).toBe(true);
  });
  it("Should return should return true for valid date", () => {
    expect(isISODateCompatible("2022-04-14T09:24:36+0000")).toBe(true);
  });
  it("Should return should return false for invalid date", () => {
    expect(isISODateCompatible("sa9990a")).toBe(false);
  });
  it("Should return should return false for invalid date", () => {
    expect(isISODateCompatible("2022-13-1")).toBe(false);
  });
  it("Should return should convert leap year to valid date", () => {
    expect(isISODateCompatible("2022-2-29")).toBe(true);
  });
  it("Should return should convert leap year to valid date", () => {
    expect(isISODateCompatible("2022-04-06T03:58:21+0000")).toBe(true);
  });
});