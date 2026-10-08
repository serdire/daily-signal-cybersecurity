const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildBrief } = require("../scripts/publish");

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "weekly-news.json"), "utf8"));

test("features one item per UTC weekday and starts the next week over", () => {
  const monday = buildBrief(articles, "2026-01-05");
  const tuesday = buildBrief(articles, "2026-01-06");
  const sunday = buildBrief(articles, "2026-01-11");
  const nextMonday = buildBrief(articles, "2026-01-12");

  assert.equal(monday.slug, articles[0].slug);
  assert.equal(tuesday.slug, articles[1].slug);
  assert.equal(sunday.slug, articles[6].slug);
  assert.equal(nextMonday.slug, monday.slug);
  assert.equal(nextMonday.featuredOn, "2026-01-12");
});

test("every weekly story has a unique route, full content, a source, and a local illustration", () => {
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
    assert.match(article.image, /^images\/[\w-]+\.svg$/);
    assert.ok(fs.existsSync(path.join(__dirname, "..", article.image)));
    assert.ok(article.imageAlt);
  }
});

test("rejects invalid dates and empty article lists", () => {
  assert.throws(() => buildBrief(articles, "not-a-date"), /Invalid UTC date/);
  assert.throws(() => buildBrief([], "2026-01-01"), /seven stories/);
  assert.throws(() => buildBrief(articles.slice(0, 6), "2026-01-01"), /seven stories/);
});
