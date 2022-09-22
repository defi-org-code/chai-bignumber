import { BigNumber } from "bignumber.js";

declare global {
  export namespace Chai {
    export interface BigNumberComparer extends NumberComparer {
      (value: BigNumber.Value, message?: string): BigNumberAssertion;
    }
    export interface BigNumberCloseTo extends CloseTo {
      (value: BigNumber.Value, delta: BigNumber.Value, message?: string): BigNumberAssertion;
    }
    export interface BigNumberAssertion extends Assertion {
      equal: BigNumberComparer;
      equals: BigNumberComparer;
      eq: BigNumberComparer;

      above: BigNumberComparer;
      gt: BigNumberComparer;
      greaterThan: BigNumberComparer;

      least: BigNumberComparer;
      gte: BigNumberComparer;

      below: BigNumberComparer;
      lt: BigNumberComparer;
      lessThan: BigNumberComparer;

      most: BigNumberComparer;
      lte: BigNumberComparer;

      finite: Assertion;
      integer: Assertion;
      negative: Assertion;
      zero: Assertion;

      closeTo: BigNumberCloseTo;

      not: BigNumberAssertion;
    }
    export interface Assertion {
      bignumber: BigNumberAssertion;
    }
  }
}

export default function () {
  return function (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    chai.Assertion.addProperty("bignumber", function () {
      utils.flag(this, "bignumber", true);
    });

    const convert = function (value: any): BigNumber {
      if (value instanceof BigNumber || BigNumber.isBigNumber(value)) return value;
      if (value.constructor && value.constructor.name === "BN") return new BigNumber(value.toString());
      if (typeof value === "string" || typeof value === "number") return new BigNumber(value);
      chai.assert(false, `expected ${value} to be an instance of string, number, BN or BigNumber`);
    };

    const overwriteMethods = function (names: string[], newAssertion: any) {
      names.forEach((name) => {
        chai.Assertion.overwriteMethod(name, function overwriteMethod(originalAssertion) {
          return function (this: any) {
            if (utils.flag(this, "bignumber")) {
              const actual = convert(this._obj);
              const args = [actual].concat([].slice.call(arguments).slice(0, arguments.length).map(convert)).concat(arguments[arguments.length]);
              newAssertion.apply(this, args);
            } else {
              originalAssertion.apply(this, arguments);
            }
          };
        });
      });
    };

    overwriteMethods(["equal", "equals", "eq"], function (this: Chai.AssertionStatic, actual: BigNumber, expected: BigNumber) {
      this.assert(actual.eq(expected), "expected #{act} to equal #{exp}", "expected #{act} to be different from #{exp}", expected.toString(), actual.toString());
    });

    overwriteMethods(["above", "gt", "greaterThan"], function (this: Chai.AssertionStatic, actual: BigNumber, expected: BigNumber) {
      this.assert(actual.gt(expected), "expected #{act} to be greater than #{exp}", "expected #{act} to be less than or equal to #{exp}", expected.toString(), actual.toString());
    });

    overwriteMethods(["least", "gte"], function (this: Chai.AssertionStatic, actual: BigNumber, expected: BigNumber) {
      this.assert(actual.gte(expected), "expected #{act} to be greater than or equal to #{exp}", "expected #{act} to be less than #{exp}", expected.toString(), actual.toString());
    });

    overwriteMethods(["below", "lt", "lessThan"], function (this: Chai.AssertionStatic, actual: BigNumber, expected: BigNumber) {
      this.assert(actual.lt(expected), "expected #{act} to be less than #{exp}", "expected #{act} to be greater than or equal to #{exp}", expected.toString(), actual.toString());
    });

    overwriteMethods(["lte", "most"], function (this: Chai.AssertionStatic, actual: BigNumber, expected: BigNumber) {
      this.assert(actual.lte(expected), "expected #{act} to be less than or equal to #{exp}", "expected #{act} to be greater than #{exp}", expected.toString(), actual.toString());
    });

    overwriteMethods(["closeTo"], function (this: Chai.AssertionStatic, actual: BigNumber, expected: BigNumber, delta: BigNumber) {
      this.assert(
        actual.gte(expected.minus(delta)) && actual.lte(expected.plus(delta)),
        `expected #{act} to be within '${delta}' of #{exp}`,
        `expected #{act} to be further than '${delta}' from #{exp}`,
        expected.toString(),
        actual.toString()
      );
    });

    chai.Assertion.addProperty("finite", function () {
      const value = convert(this._obj);
      this.assert(value.isFinite(), "expected #{this} to be finite", "expected #{this} to not be finite", value.toString());
    });

    chai.Assertion.addProperty("negative", function () {
      const value = convert(this._obj);
      this.assert(value.isNegative(), "expected #{this} to be negative", "expected #{this} to not be negative", value.toString());
    });

    chai.Assertion.addProperty("integer", function () {
      const value = convert(this._obj);
      this.assert(value.isInteger(), "expected #{this} to be an integer", "expected #{this} to not be an integer", value.toString());
    });

    chai.Assertion.addProperty("zero", function () {
      const value = convert(this._obj);
      this.assert(value.isZero(), "expected #{this} to be zero", "expected #{this} to not be zero", value.toString());
    });
  };
}
