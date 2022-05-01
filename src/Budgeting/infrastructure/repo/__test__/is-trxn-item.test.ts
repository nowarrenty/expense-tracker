import { isTransactionItem } from "../is-trxn-item";

describe("isTransactionItem typeguard", () => {
  it("Verifies a valid Transaction Item", () => {
    const item: unknown = {
      PK: "PK",
      SK: "SK",
      userId: "userId",
      date: Date.now().toString(),
      amount: 900099,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(true);
  });

  it("Fails an object that amount is not an integer", () => {
    const item: unknown = {
      PK: "PK",
      SK: "SK",
      userId: "userId",
      date: Date.now().toString(),
      amount: 90009.9,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object without key PK", () => {
    const item: unknown = {
      SK: "SK",
      userId: "userId",
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object without key SK", () => {
    const item: unknown = {
      PK: "PK",
      userId: "userId",
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object without key userId", () => {
    const item: unknown = {
      PK: "PK",
      SK: "SK",
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object without key amount", () => {
    const item: unknown = {
      PK: "PK",
      SK: "SK",
      userId: "userId",
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object without key amount", () => {
    const item: unknown = {
      PK: "PK",
      SK: "SK",
      userId: "userId",
      date: Date.now().toString(),
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object without key currencyCode ", () => {
    const item: unknown = {
      PK: "PK",
      SK: "SK",
      userId: "userId",
      date: Date.now().toString(),
      amount: 900099,
    };
    expect(isTransactionItem(item)).toBe(false);
  });
  it("Fails an object with a non-string key PK", () => {
    const item: unknown = {
      PK: 90,
      SK: "SK",
      userId: "userId",
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object with a non-string key SK", () => {
    const item: unknown = {
      PK: "90",
      SK: true,
      userId: "userId",
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object with a non-string key userId", () => {
    const item: unknown = {
      PK: "90",
      SK: "true",
      userId: 190982,
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMD",
    };
    expect(isTransactionItem(item)).toBe(false);
  });

  it("Fails an object with an invalid currencyCode", () => {
    const item: unknown = {
      PK: "SK",
      SK: "SK",
      userId: "190982",
      date: Date.now().toString(),
      amount: 90009,
      currencyCode: "JMDS",
    };
    expect(isTransactionItem(item)).toBe(false);
  });
});
