async function showBrief() {
  const container = document.querySelector("#brief");
  try {
    const response = await fetch("current.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Briefing request failed (${response.status})`);
    const briefing = await response.json();

    const label = document.createElement("p");
    label.className = "eyebrow";
    label.textContent = "TODAY'S FEATURE";

    const heading = document.createElement("h2");
    heading.textContent = briefing.title;

    const date = document.createElement("p");
    date.className = "date";
    date.textContent = `Featured ${briefing.featuredOn}`;

    const summary = document.createElement("p");
    summary.className = "summary";
    summary.textContent = briefing.summary;

    const source = document.createElement("a");
    source.className = "source";
    source.href = briefing.sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = `Read the source: ${briefing.sourceName}`;

    container.replaceChildren(label, heading, date, summary, source);
  } catch (error) {
    container.replaceChildren(document.createTextNode("Today's briefing couldn't be loaded. Please try again later."));
    console.error(error);
  }
}

showBrief();
