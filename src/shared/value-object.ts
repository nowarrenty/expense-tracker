import shallowEqual = require("shallowequal");

interface ValueObjectsProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectsProps> {
  readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }


  equals(object: ValueObject<T>): boolean {
    if (object === null || object === undefined) return false;
    if (object.props === undefined) return false;
    return shallowEqual(this.props, object.props);
  }
}
