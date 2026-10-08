const test = require("node:test");
const assert = require("node:assert/strict");
const { fonts, styleIndex } = require("../wordmark");

test("wordmark cycles through ten styles in equal UTC intervals", () => {
  assert.equal(fonts.length, 10);
  assert.deepEqual(
    Array.from({ length: 10 }, (_, index) => styleIndex(new Date(Date.UTC(2026, 0, 1, 0, index * 144)))),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  );
});

test("wordmark cycle starts over at UTC midnight", () => {
  assert.equal(styleIndex(new Date("2026-01-01T23:59:00Z")), 9);
  assert.equal(styleIndex(new Date("2026-01-02T00:00:00Z")), 0);
});

test("wordmark style index rejects invalid dates", () => {
  assert.throws(() => styleIndex(new Date("invalid")), /valid date/);
});
