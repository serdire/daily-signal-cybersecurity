const app = document.querySelector("#app");
const searchInput = document.querySelector("#story-search");
const sectionLabel = document.querySelector("#current-section");
const categoryButtons = [...document.querySelectorAll("[data-category]")];
let articles = [];
let briefing;
let selectedCategory = "";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function storyLink(story, className, label) {
  const link = element("a", className);
  link.href = `#/story/${encodeURIComponent(story.slug)}`;
  link.setAttribute("aria-label", label || story.title);
  return link;
}

function addMeta(parent, story, includeDate = false) {
  const meta = element("div", "story-meta");
  meta.append(element("span", "category-pill", story.category));
  if (includeDate && briefing.featuredOn) {
    const date = element("time", "", `FEATURED ${briefing.featuredOn}`);
    date.dateTime = briefing.featuredOn;
    meta.append(date);
  } else {
    meta.append(element("span", "", `${story.readingTime} MIN READ`));
  }
  parent.append(meta);
}

function renderCard(story, index) {
  const card = element("article", "story-card");
  const link = storyLink(story, "story-card-link");
  const art = element("div", "story-art");
  const image = element("img");
  image.src = story.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  art.setAttribute("aria-hidden", "true");
  art.append(image, element("span", "art-index", String(index + 1).padStart(2, "0")));

  const body = element("div", "story-card-body");
  body.append(element("p", "eyebrow", story.category));
  body.append(element("h3", "", story.title));
  body.append(element("p", "card-summary", story.summary));
  addMeta(body, story);
  link.append(art, body);
  card.append(link);
  return card;
}

function sectionHeading(title, note) {
  const heading = element("div", "section-heading");
  heading.append(element("h2", "", title));
  if (note) heading.append(element("span", "heading-note", note));
  return heading;
}

function renderHero(featured, others) {
  const grid = element("section", "lead-grid");
  grid.setAttribute("aria-label", "Daily feature and more explainers");
  const lead = element("article", "lead-story");
  lead.setAttribute("aria-labelledby", "lead-title");
  const image = element("img", "lead-photo");
  image.src = featured.image;
  image.alt = featured.imageAlt;
  image.fetchPriority = "high";
  image.decoding = "async";
  lead.append(image);

  const copy = element("div", "lead-copy");
  copy.append(element("p", "eyebrow", "TODAY'S CYBERSECURITY EXPLAINER"));
  const meta = element("div", "lead-meta");
  meta.append(element("span", "category-pill", featured.category));
  meta.append(element("span", "", `${featured.readingTime} MIN READ`));
  meta.append(element("span", "", "·"));
  meta.append(element("time", "", briefing.featuredOn));
  copy.append(meta);
  const title = element("h1");
  title.id = "lead-title";
  const titleLink = storyLink(featured);
  titleLink.textContent = featured.title;
  title.append(titleLink);
  copy.append(title);
  copy.append(element("p", "lead-summary", featured.summary));
  const read = storyLink(featured, "read-link", `Read ${featured.title}`);
  read.append(document.createTextNode("Read the full explainer "), element("span", "", "→"));
  copy.append(read);
  lead.append(copy);

  const rail = element("aside", "lead-rail");
  rail.setAttribute("aria-label", "More from the briefing");
  const railHeading = element("div", "rail-title");
  railHeading.append(element("h2", "", "Also in the briefing"));
  railHeading.append(element("span", "", `${String(others.length).padStart(2, "0")} STORIES`));
  rail.append(railHeading);
  for (const story of others) {
    const link = storyLink(story, "rail-story");
    link.append(element("span", "category-name", story.category));
    link.append(element("strong", "", story.title));
    link.append(element("small", "", `${story.readingTime} MIN READ`));
    rail.append(link);
  }
  grid.append(lead, rail);
  return grid;
}

function renderHome() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = articles.filter((story) => {
    const matchesCategory = !selectedCategory || story.category === selectedCategory;
    const searchable = `${story.title} ${story.summary} ${story.category} ${story.sourceName}`.toLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
  app.replaceChildren();

  if (query || selectedCategory) {
    const label = selectedCategory || "Search results";
    sectionLabel.textContent = label.toUpperCase();
    app.append(sectionHeading(label, `${matches.length} ${matches.length === 1 ? "STORY" : "STORIES"}`));
    if (matches.length) {
      const cards = element("div", "desk-grid");
      matches.forEach((story, index) => cards.append(renderCard(story, index)));
      app.append(cards);
    } else {
      const empty = element("div", "empty-state");
      empty.append(
        element("strong", "", "No stories found"),
        element("span", "", "Try another search term or choose a different section.")
      );
      app.append(empty);
    }
    return;
  }

  sectionLabel.textContent = "TOP STORIES";
  const featured = articles.find((story) => story.slug === briefing.slug);
  if (!featured) throw new Error("Today's featured article is missing from the article list");
  const others = articles.filter((story) => story.slug !== featured.slug).slice(0, 3);
  app.append(renderHero(featured, others));

  const note = element("div", "briefing-note");
  note.append(
    element("strong", "", "A note on this week's edition"),
    element("span", "", "The seven stories in the weekly file are featured Monday through Sunday. Each links to its source; this site does not provide live incident alerts.")
  );
  app.append(note);

  const remaining = articles.filter((story) => story.slug !== featured.slug && !others.includes(story));
  app.append(sectionHeading("Explore this week's stories", `${remaining.length} MORE STORIES`));
  const cards = element("div", "desk-grid");
  remaining.forEach((story, index) => cards.append(renderCard(story, index + others.length + 1)));
  app.append(cards);
}

function renderArticle(slug) {
  const story = articles.find((item) => item.slug === slug);
  app.replaceChildren();
  sectionLabel.textContent = story ? story.category.toUpperCase() : "STORY NOT FOUND";
  if (!story) {
    const empty = element("div", "empty-state");
    empty.append(element("strong", "", "We couldn't find that story"), element("a", "read-link", "Return to the top stories"));
    empty.querySelector("a").href = "./";
    app.append(empty);
    return;
  }

  const article = element("article", "article-detail");
  const back = element("a", "back-link", "←  Back to top stories");
  back.href = "./";
  article.append(back);
  article.append(element("p", "eyebrow", `THE DAILY SIGNAL EXPLAINER  /  ${story.category.toUpperCase()}`));
  article.append(element("h1", "", story.title));
  article.append(element("p", "article-dek", story.summary));

  const byline = element("div", "article-byline");
  byline.append(element("span", "", `${story.readingTime} MIN READ`));
  byline.append(element("span", "", "·"));
  byline.append(element("span", "", "WEEKLY EDITION"));
  if (story.slug === briefing.slug) {
    byline.append(element("span", "", "·"));
    byline.append(element("time", "", `FEATURED ${briefing.featuredOn}`));
  }
  article.append(byline);

  const visual = element("figure", "article-visual");
  const image = element("img");
  image.src = story.image;
  image.alt = story.imageAlt;
  image.loading = "lazy";
  image.decoding = "async";
  const caption = element("figcaption");
  caption.append(
    element("span", "", `DAILY SIGNAL  /  ${story.category.toUpperCase()}`),
    element("span", "", "Original illustration · Stored locally")
  );
  visual.append(image, caption);
  article.append(visual);

  const copy = element("div", "article-copy");
  for (const paragraph of story.body) copy.append(element("p", "", paragraph));
  const takeaways = element("section", "takeaways");
  takeaways.append(element("h2", "", "What to remember"));
  const list = element("ul");
  for (const point of story.takeaways) list.append(element("li", "", point));
  takeaways.append(list);
  copy.append(takeaways);
  const source = element("aside", "source-box");
  source.append(element("p", "", "PRIMARY SOURCE"));
  const sourceLink = element("a", "", story.sourceName);
  sourceLink.href = story.sourceUrl;
  sourceLink.target = "_blank";
  sourceLink.rel = "noopener noreferrer";
  source.append(sourceLink);
  copy.append(source);
  article.append(copy);
  app.append(article);
}

function renderAbout() {
  app.replaceChildren();
  sectionLabel.textContent = "ABOUT THIS DESK";
  const page = element("article", "about-page");
  page.append(element("p", "eyebrow", "OUR APPROACH"));
  page.append(element("h1", "", "Cybersecurity, without the noise."));
  page.append(element("p", "about-lede", "Daily Signal is a small independent learning project built to make practical security guidance easier to find and understand."));

  const blocks = [
    ["What this site publishes", "Seven stories are kept in a weekly file and featured one per UTC day from Monday through Sunday. The starter file contains evergreen cybersecurity explainers; replace them with your reviewed weekly stories as you build the news edition."],
    ["How we source information", "Every story includes a primary source link. Check that source and the publication date when adding weekly content. This site is educational and is not a substitute for professional incident response."],
    ["How the daily edition works", "A scheduled GitHub Actions workflow selects the story for the UTC weekday from weekly-news.json, updates the featured date, runs the content checks, and deploys the static site. It uses no AI API key and makes one daily publishing commit when the feature date changes."],
    ["What it does not do", "There is no live news feed, AI writing, or automated fact-checking. The workflow checks the weekly file and local illustrations but does not create maintenance changes just to make extra commits. Scheduled runs can be delayed or fail; do not rely on this site for urgent alerts."]
  ];
  for (const [heading, copy] of blocks) {
    const block = element("section", "about-block");
    block.append(element("h2", "", heading), element("p", "", copy));
    page.append(block);
  }
  app.append(page);
}

function renderRoute() {
  const route = decodeURIComponent(location.hash.slice(1));
  if (route === "/about") {
    renderAbout();
  } else if (route.startsWith("/story/")) {
    renderArticle(route.slice("/story/".length));
  } else {
    renderHome();
  }
}

async function loadBriefing() {
  const [articlesResponse, briefingResponse] = await Promise.all([
    fetch("weekly-news.json", { cache: "no-store" }),
    fetch("current.json", { cache: "no-store" })
  ]);
  if (!articlesResponse.ok) throw new Error(`Article library request failed (${articlesResponse.status})`);
  if (!briefingResponse.ok) throw new Error(`Daily feature request failed (${briefingResponse.status})`);
  articles = await articlesResponse.json();
  briefing = await briefingResponse.json();
  if (articles.length !== 7 || !briefing.slug || !articles.some((story) => story.slug === briefing.slug)) {
    throw new Error("The weekly stories or today's selected story are invalid");
  }
  const editionDate = document.querySelector("#edition-date");
  editionDate.textContent = new Intl.DateTimeFormat("en", {
    weekday: "short", day: "2-digit", month: "short", timeZone: "UTC"
  }).format(new Date(`${briefing.featuredOn}T00:00:00Z`)).toUpperCase();
  renderRoute();
}

for (const button of categoryButtons) {
  button.addEventListener("click", () => {
    selectedCategory = selectedCategory === button.dataset.category ? "" : button.dataset.category;
    categoryButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button && selectedCategory !== "")));
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    renderRoute();
  });
}

document.querySelector("#story-search").addEventListener("input", () => {
  selectedCategory = "";
  categoryButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  renderHome();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    selectedCategory = "";
    categoryButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    renderRoute();
  }
});

window.addEventListener("hashchange", () => {
  selectedCategory = "";
  categoryButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  searchInput.value = "";
  renderRoute();
});

loadBriefing().catch((error) => {
  console.error(error);
  const message = element("div", "empty-state");
  message.append(
    element("strong", "", "The daily edition couldn't be loaded"),
    element("span", "", "Please check your connection and reload the page.")
  );
  const retry = element("button", "read-link", "Reload page");
  retry.type = "button";
  retry.addEventListener("click", () => location.reload());
  message.append(retry);
  app.replaceChildren(message);
});
