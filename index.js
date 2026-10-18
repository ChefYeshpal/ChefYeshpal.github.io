const quickLinks = document.querySelector(".quick-links");

function buildQuickLinks() {
  if (!quickLinks) {
    return;
  }

  const seenLinks = new Set();
  const links = [...document.querySelectorAll("a[href]")].filter((link) => {
    const href = link.getAttribute("href");

    if (quickLinks.contains(link) || !href || seenLinks.has(href)) {
      return false;
    }

    seenLinks.add(href);
    return true;
  });

  quickLinks.replaceChildren(...links.map(createQuickLink));
}

function createQuickLink(sourceLink, index) {
  const link = document.createElement("a");
  link.className = `quick-link${index === 0 ? " quick-link-featured" : ""}`;
  link.href = sourceLink.getAttribute("href");

  if (sourceLink.target === "_blank") {
    link.target = "_blank";
    link.rel = "noopener";
  }

  const label = document.createElement("span");
  label.className = "quick-link-label";
  label.textContent = sourceLink.textContent.trim() || "Untitled link";

  const arrow = document.createElement("span");
  arrow.className = "quick-link-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = sourceLink.getAttribute("href").startsWith("#")
    ? "\u2193"
    : "\u2197";

  link.append(label, arrow);
  return link;
}

buildQuickLinks();
