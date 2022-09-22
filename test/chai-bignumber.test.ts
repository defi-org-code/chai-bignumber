import BigNumber from "bignumber.js";
import chaiBigNumber from "../src/chai-bignumber";
import { expect, use } from "chai";
import _ from "lodash";

use(chaiBigNumber());

describe("chai-bignumber", () => {
  const matchInvalidError = /to be an instance of string, number, BN or BigNumber/;

  it("uses bignumber", () => {
    expect(1234.5678).bignumber.not.undefined;
  });

  const inputs = [10, 10.5, 10.6, 11, 1.000000000000000001, 1.000000000000000002, 100e18, 123456789.123456789];
  const inputsAllTypes = inputs.flatMap((i) => [i, `${i}`, BigNumber(i)]);
  const allPermutations = inputsAllTypes.flatMap((i) => inputsAllTypes.flatMap((ii) => [i, ii]));
  const pairs = _.chunk(allPermutations, 2);

  const invalidInputs = [
    [{}, 1],
    [1, {}],
    [function () {}, []],
  ];

  describe("equal/equals/eq", () => {
    it("equal", () => {
      pairs.forEach(([a, b]) => {
        if (BigNumber(a).eq(b)) expect(a).bignumber.eq(b).equal(b).equals(b);
      });
    });

    it("not equal", () => {
      pairs.forEach(([a, b]) => {
        if (!BigNumber(a).eq(b)) expect(a).bignumber.not.eq(b).equals(b).equal(b);
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      invalidInputs.forEach(([a, b]) => {
        expect(() => expect(a as any).bignumber.eq(b as any)).to.throw(matchInvalidError);
      });
    });
  });

  describe("above/gt/greaterThan", () => {
    it("greater than", () => {
      pairs.forEach(([a, b]) => {
        if (BigNumber(a).gt(b)) expect(a).bignumber.gt(b).greaterThan(b).above(b);
      });
    });

    it("not greater than", () => {
      pairs.forEach(([a, b]) => {
        if (!BigNumber(a).gt(b)) expect(a).bignumber.not.gt(b).greaterThan(b).above(b);
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      invalidInputs.forEach(([a, b]) => {
        expect(() => expect(a as any).bignumber.gt(b as any)).to.throw(matchInvalidError);
      });
    });
  });

  describe("least/gte", () => {
    it("greater than or equal to", () => {
      pairs.forEach(([a, b]) => {
        if (BigNumber(a).gte(b)) expect(a).bignumber.gte(b).least(b);
      });
    });

    it("not grater than or equal to", () => {
      pairs.forEach(([a, b]) => {
        if (!BigNumber(a).gte(b)) expect(a).bignumber.not.gte(b).least(b);
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      invalidInputs.forEach(([a, b]) => {
        expect(() => expect(a as any).bignumber.gte(b as any)).to.throw(matchInvalidError);
      });
    });
  });

  describe("below/lt/lessThan", () => {
    it("less than", () => {
      pairs.forEach(([a, b]) => {
        if (BigNumber(a).lt(b)) expect(a).bignumber.lt(b).lessThan(b).below(b);
      });
    });

    it("not less than", () => {
      pairs.forEach(([a, b]) => {
        if (!BigNumber(a).lt(b)) expect(a).bignumber.not.lt(b).lessThan(b).below(b);
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      invalidInputs.forEach(([a, b]) => {
        expect(() => expect(a as any).bignumber.lt(b as any)).to.throw(matchInvalidError);
      });
    });
  });

  describe("lte/most", () => {
    it("less than or equal to", () => {
      pairs.forEach(([a, b]) => {
        if (BigNumber(a).lte(b)) expect(a).bignumber.lte(b).most(b);
      });
    });

    it("not less than or equal to", () => {
      pairs.forEach(([a, b]) => {
        if (!BigNumber(a).lte(b)) expect(a).bignumber.not.lte(b).most(b);
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      invalidInputs.forEach(([a, b]) => {
        expect(() => expect(a as any).bignumber.lte(b as any)).to.throw(matchInvalidError);
      });
    });
  });

  describe("closeTo", () => {
    it("closeTo", () => {
      const closeNumbers = [1, 1.1, 5];
      const closeAllTypes = closeNumbers.flatMap((i) => [i, `${i}`, BigNumber(i)]);
      const closeAllPermutations = closeAllTypes.flatMap((i) => closeAllTypes.flatMap((ii) => [i, ii]));
      const closePairs = _.chunk(closeAllPermutations, 2);
      closePairs.forEach(([a, b]) => {
        expect(a).bignumber.closeTo(b, 5);
      });
    });

    it("not closeTo", () => {
      const farNumbers = [1, 10, 100];
      const farAllTypes = farNumbers.flatMap((i) => [i, `${i}`, BigNumber(i)]);
      const farAllPermutations = farAllTypes.flatMap((i) => farAllTypes.flatMap((ii) => [i, ii]));
      const farPairs = _.chunk(farAllPermutations, 2);
      farPairs.forEach(([a, b]) => {
        if (!BigNumber(a).eq(b)) expect(a).bignumber.not.closeTo(b, 5);
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      invalidInputs.forEach(([a, b]) => {
        expect(() => expect(a as any).bignumber.closeTo(b as any, 5)).to.throw(matchInvalidError);
      });
    });
  });

  describe("finite", () => {
    it("finite", () => {
      inputsAllTypes.forEach((i) => {
        expect(i).bignumber.finite;
      });
    });

    it("not finite", () => {
      [100 / 0, NaN, Infinity, -Infinity, +Infinity, BigNumber(100).dividedBy(0)].forEach((i) => {
        expect(i).bignumber.not.finite;
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      [function () {}, [], {}].forEach((i) => {
        expect(() => expect(i as any).bignumber.finite).to.throw(matchInvalidError);
      });
    });
  });

  describe("negative", () => {
    it("negative", () => {
      [-100, -100.5, -Infinity, "-1000000000000000001", BigNumber("-1000000000000000001")].forEach((i) => {
        expect(i).bignumber.negative;
      });
    });

    it("not negative", () => {
      [NaN, 0, 100, 100.5, Infinity, +Infinity, "1000000000000000001", BigNumber("1000000000000000001")].forEach((i) => {
        expect(i).bignumber.not.negative;
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      [function () {}, [], {}].forEach((i) => {
        expect(() => expect(i as any).bignumber.negative).to.throw(matchInvalidError);
      });
    });
  });

  describe("integer", () => {
    it("integer", () => {
      [0, 100, "1000000000000000001", BigNumber("1000000000000000001")].forEach((i) => {
        expect(i).bignumber.integer;
      });
    });

    it("not integer", () => {
      [NaN, 100.5, Infinity, -Infinity, +Infinity, "1.000000000000000001", BigNumber("1.000000000000000001")].forEach((i) => {
        expect(i).bignumber.not.integer;
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      [function () {}, [], {}].forEach((i) => {
        expect(() => expect(i as any).bignumber.integer).to.throw(matchInvalidError);
      });
    });
  });

  describe("zero", () => {
    it("zero", () => {
      [0, -0, "+0", BigNumber("0")].forEach((i) => {
        expect(i).bignumber.zero;
      });
    });

    it("not zero", () => {
      [NaN, -100.5, -100, 100, 100.5, Infinity, +Infinity, -Infinity, "1000000000000000001", BigNumber("1000000000000000001")].forEach((i) => {
        expect(i).bignumber.not.zero;
      });
    });

    it("fails on args not string, number, BigNumber", () => {
      [function () {}, [], {}].forEach((i) => {
        expect(() => expect(i as any).bignumber.zero).to.throw(matchInvalidError);
      });
    });
  });
});
