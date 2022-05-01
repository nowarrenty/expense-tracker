import {
  MemoTooLongError,
  NotSafeIntegerAmountError,
  NegativeAmountError,
} from "../errors";
import { AddTransactionDTO } from "../types";
import { validateTransactionDTO } from "../utils/validate-trxn";

describe("validateTransactionDTO function", () => {
  test("a valid transaction", () => {
    const dto: AddTransactionDTO = {
      userId: "1230831",
      vendor: "Netflix",
      date: "2022-04-06T03:58:21+0000",
      currencyCode: "JMD",
      amount: 1250000n,
      memo: "Monthly netflix",
    };

    validateTransactionDTO(dto)
      .map((t) => {
        expect(t.userId).toBe(dto.userId);
        expect(t.vendor).toBe(dto.vendor);
        expect(t.date).toStrictEqual(new Date(dto.date));
        expect(t.value.toJSON().currency.code).toBe(dto.currencyCode);
        expect(t.value.toJSON().amount).toBe(Number(dto.amount));
        expect(t.memo).toBe(dto.memo);
      })
      .mapErr((e) => fail(e));
  });

  test("Missing userId", () => {
    const dto: AddTransactionDTO = {
      userId: "1230831",
      vendor: "Netflix",
      date: "2022-04-06T03:58:21+0000",
      currencyCode: "JMD",
      amount: 1250000n,
      memo: "Monthly netflix",
    };
  });
  test("Memo that is too long", () => {
    const dto: AddTransactionDTO = {
      userId: "1230831",
      vendor: "Netflix",
      date: "2022-04-06T03:58:21+0000",
      currencyCode: "USD",
      amount: 1250000n,
      memo: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue convallis imperdiet. Integer eget ante odio. Suspendisse nec purus quam lectus.`,
    };

    validateTransactionDTO(dto)
      .map((_) => {
        fail("Memo greater than 150 characters should not pass validation");
      })
      .mapErr((e) => expect(e).toBe(MemoTooLongError));
  });

  test("Negative amount", () => {
    const dto: AddTransactionDTO = {
      userId: "1230831",
      vendor: "Netflix",
      date: "2022-04-06T03:58:21+0000",
      currencyCode: "USD",
      amount: -1250000n,
      memo: `Lorem ipsum dolor sit amet,nec purus quam lectus.`,
    };

    validateTransactionDTO(dto)
      .map((_) => {
        fail("Negative currency should not create a valid transaction");
      })
      .mapErr((e) => expect(e).toStrictEqual(NegativeAmountError));
  });

  test("Amount that is too big", () => {
    const dto: AddTransactionDTO = {
      userId: "1230831",
      vendor: "Netflix",
      date: "2022-04-06T03:58:21+0000",
      currencyCode: "USD",
      amount: BigInt(Number.MAX_SAFE_INTEGER + 1),
      memo: `Lorem ipsum dolor sit amet,nec purus quam lectus.`,
    };

    validateTransactionDTO(dto)
      .map((_) => {
        fail(
          "Amount > Number.MAX_SAFE_INTEGER should not create a valid transaction"
        );
      })
      .mapErr((e) => expect(e).toStrictEqual(NotSafeIntegerAmountError));
  });
});
