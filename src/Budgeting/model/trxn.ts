import { dinero } from "dinero.js";
import { err, ok, Result } from "neverthrow";
import { Entity } from "../../shared/entity";
import {
  CurrencyCode,
  TransactionProps,
  TransactionSnapshot,
} from "./types";
import {
  InvalidAccountError,
  NegativeAmountError,
  InvalidCurrencyCodeError,
  NonIntegerAmountError,
  InvalidTimeError,
} from "./errors";
import { DomainError, Id, Money } from "./types";
import * as DineroCurrencyCodes from "@dinero.js/currencies";
import hasKey from "../../utils/has-key";
import isISODateCompatible from "../../utils/is-iso-date-compatible";

export class Transaction extends Entity {
  #accountId: Id;
  #date: Date;
  #value: Money;
  #vendor?: string;
  #memo?: string; //TODO add a value object for memo
  // #category: TransactionCategory;

  get accountId() {
    return Object.freeze(this.#accountId);
  }
  get date() {
    return Object.freeze(this.#date);
  }

  get value() {
    return Object.freeze(this.#value);
  }

  get vendor() {
    return Object.freeze(this.#vendor);
  }

  get memo() {
    return Object.freeze(this.#memo);
  }

  // get category() {
  //   return Object.freeze(this.#category);
  // }

  private constructor(props: TransactionProps, id?: Id) {
    super(id);
    this.#accountId = props.accountId;
    this.#date = props.date;
    this.#value = props.value;
    this.#vendor = props.vendor;
    this.#memo = props.memo;
  }

  static create(props: TransactionProps): Result<Transaction, DomainError> {
    if (props.accountId.length < 1) return err(InvalidAccountError);
    if (props.value.toJSON().amount < 0) return err(NegativeAmountError);
    const currencyCodeString = props.value.toJSON().currency.code;
    if (!hasKey(DineroCurrencyCodes, currencyCodeString)) {
      return err(InvalidCurrencyCodeError);
    }
    return ok(new Transaction(props, props.id));
  }

  static fromSnapshot(
    snapshot: TransactionSnapshot
  ): Result<Transaction, DomainError> {
    if (!hasKey(DineroCurrencyCodes, snapshot.currencyCode)) {
      return err(InvalidCurrencyCodeError);
    }
    if (!Number.isSafeInteger(snapshot.amount))
      return err(NonIntegerAmountError);

    if (!isISODateCompatible(snapshot.date)) return err(InvalidTimeError);

    const props: TransactionProps = {
      id: snapshot.id,
      accountId: snapshot.accountId,
      date: new Date(snapshot.date),
      value: dinero({
        amount: snapshot.amount,
        currency: DineroCurrencyCodes[snapshot.currencyCode],
      }),
    };
    if (snapshot.memo) props.memo = snapshot.memo;
    if (snapshot.vendor) props.vendor = snapshot.vendor;

    return Transaction.create(props);
  }

  toSnapshot(): TransactionSnapshot {
    const snapshot: TransactionSnapshot = {
      accountId: this.#accountId,
      id: this.id,
      date: this.#date.toISOString(),
      amount: this.value.toJSON().amount,
      // Type from toJSON returns a string
      // but is casted to CurrencyCode.
      // It will be consistent with CurrencyCode
      // due to the Transaction class only
      // allowing valid (built-in)CountryCodes
      // from static factory functions
      // create and fromSnapshot
      currencyCode: this.#value.toJSON().currency.code as CurrencyCode,
    };

    if (this.#vendor) snapshot.vendor = this.#vendor;

    if (this.memo) snapshot.memo = this.#memo;

    return Object.freeze(snapshot);
  }
}
