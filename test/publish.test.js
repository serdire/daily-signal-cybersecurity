const test = require("node:test");
const assert = require("node:assert/strict");
const { buildBrief } = require("../scripts/publish");

const articles = Array.from({ length: 7 }, (_, index) => ({ title: `Article ${index}` }));

test("rotates through all articles and repeats after one week", () => {
  const first = buildBrief(articles, "2026-01-01");
  const seventh = buildBrief(articles, "2026-01-07");
  const eighth = buildBrief(articles, "2026-01-08");

  assert.equal(first.title, "Article 0");
  assert.equal(seventh.title, "Article 6");
  assert.equal(eighth.title, first.title);
  assert.equal(eighth.featuredOn, "2026-01-08");
});

test("rejects invalid dates and empty article lists", () => {
  assert.throws(() => buildBrief(articles, "not-a-date"), /Invalid UTC date/);
  assert.throws(() => buildBrief([], "2026-01-01"), /at least one article/);
});
