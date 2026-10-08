const fs = require("node:fs");
const path = require("node:path");

function buildBrief(articles, date) {
  if (!Array.isArray(articles) || articles.length !== 7) {
    throw new Error("Expected seven stories for the weekly edition");
  }
  const day = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(day.getTime()) || day.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid UTC date: ${date}`);
  }
  const index = (day.getUTCDay() + 6) % 7;
  return { ...articles[index], featuredOn: date };
}

function main() {
  const articles = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "weekly-news.json"), "utf8"));
  const today = new Date().toISOString().slice(0, 10);
  const brief = buildBrief(articles, today);
  fs.writeFileSync(path.join(__dirname, "..", "current.json"), `${JSON.stringify(brief, null, 2)}\n`);
}

if (require.main === module) main();

module.exports = { buildBrief };
