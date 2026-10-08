const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("workflow schedules ten runs exactly 144 minutes apart", () => {
  const workflow = fs.readFileSync(
    path.join(__dirname, "..", ".github", "workflows", "daily-brief.yml"),
    "utf8"
  );
  const schedules = [...workflow.matchAll(/cron: "(\d+) (\d+) \* \* \*"/g)]
    .map((match) => Number(match[2]) * 60 + Number(match[1]));

  assert.equal(schedules.length, 10);
  for (let index = 0; index < schedules.length; index += 1) {
    const next = schedules[(index + 1) % schedules.length];
    const gap = (next - schedules[index] + 1440) % 1440;
    assert.equal(gap, 144);
  }
});
