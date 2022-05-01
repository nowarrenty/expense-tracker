import { JMD } from "@dinero.js/currencies";
import { dinero } from "dinero.js";
import { NonIntegerAmountError } from "../errors";
import { Transaction } from "../trxn";
import { TransactionProps, TransactionSnapshot } from "../types";

describe("Transactions", () => {
  test("Creating a new Transaction", () => {
    const props: TransactionProps = {
      id: "id",
      userId: "userId",
      value: dinero({ amount: 500, currency: JMD }),
      date: new Date(Date.now()),
      vendor: "Vendor",
    };
    Transaction.create(props)
      .map((transaction) => {
        expect(transaction).toBeInstanceOf(Transaction);
        expect(transaction.userId).toBe(props.userId);
        expect(transaction.id).toBe(props.id);
        expect(transaction.value).toBe(props.value);
        expect(transaction.date).toBe(props.date);
        expect(transaction.vendor).toBe(props.vendor);
      })
      .mapErr((error) => fail(error));
  });

  test("Creating a new Transaction snapshot with all fields", () => {
    const props: TransactionProps = {
      id: "id",
      userId: "userId",
      value: dinero({ amount: 500, currency: JMD }),
      date: new Date(Date.now()),
      vendor: "Vendor",
      memo: "Memo",
    };
    Transaction.create(props)
      .map((transaction) => {
        const snapshot = transaction.toSnapshot();
        expect(snapshot.userId).toBe(transaction.userId);
        expect(snapshot.id).toBe(transaction.id);
        expect(snapshot.amount).toBe(transaction.value.toJSON().amount);
        expect(snapshot.date).toBe(transaction.date.toISOString());
        expect(snapshot.vendor).toBe(transaction.vendor);
        expect(snapshot.memo).toBe(transaction.memo);
      })
      .mapErr((error) => {
        fail(error);
      });
  });

  test("Hydrating a Transaction from a snapshot", () => {
    const props: TransactionSnapshot = {
      id: "id",
      userId: "userId",
      date: new Date(Date.now()).toISOString(),
      amount: 90009,
      currencyCode: "USD",
      vendor: "Vendor",
      memo: "Memo",
    };
    Transaction.fromSnapshot(props)
      .map((transaction) => {
        const snapshot = transaction.toSnapshot();
        expect(snapshot.userId).toBe(transaction.userId);
        expect(snapshot.id).toBe(transaction.id);
        expect(snapshot.amount).toStrictEqual(
          transaction.value.toJSON().amount
        );
        expect(snapshot.currencyCode).toStrictEqual(
          transaction.value.toJSON().currency.code
        );
        expect(snapshot.date).toBe(transaction.date.toISOString());
        expect(snapshot.vendor).toBe(transaction.vendor);
        expect(snapshot.memo).toBe(transaction.memo);
      })
      .mapErr((error) => {
        fail(error);
      });
  });
  test("Hydrating a Transaction from a faulty snapshot: Decimal amount", () => {
    const props: TransactionSnapshot = {
      id: "id",
      userId: "userId",
      date: new Date(Date.now()).toISOString(),
      amount: 5.000000000000001,
      currencyCode: "USD",
      vendor: "Vendor",
      memo: "Memo",
    };
    Transaction.fromSnapshot(props)
      .map((transaction) => fail(transaction))
      .mapErr((error) => expect(error).toBe(NonIntegerAmountError));
  });
});
