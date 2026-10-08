const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildBrief } = require("../scripts/publish");

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "articles.json"), "utf8"));

test("rotates through all articles and repeats after one week", () => {
  const first = buildBrief(articles, "2026-01-01");
  const seventh = buildBrief(articles, "2026-01-07");
  const eighth = buildBrief(articles, "2026-01-08");

  assert.equal(first.slug, articles[0].slug);
  assert.equal(seventh.slug, articles[6].slug);
  assert.equal(eighth.slug, first.slug);
  assert.equal(eighth.featuredOn, "2026-01-08");
});

test("every story has a unique route, useful article content, and a source", () => {
  assert.equal(articles.length, 7);
  assert.equal(new Set(articles.map((article) => article.slug)).size, articles.length);

  for (const article of articles) {
    assert.ok(article.category);
    assert.ok(article.title);
    assert.ok(article.summary);
    assert.ok(article.readingTime > 0);
    assert.ok(article.body.length >= 3);
    assert.ok(article.takeaways.length >= 2);
    assert.match(article.sourceUrl, /^https:\/\//);
  }
});

test("rejects invalid dates and empty article lists", () => {
  assert.throws(() => buildBrief(articles, "not-a-date"), /Invalid UTC date/);
  assert.throws(() => buildBrief([], "2026-01-01"), /at least one article/);
});
