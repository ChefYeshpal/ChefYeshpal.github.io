const projectsGrid = document.getElementById("projects-grid");
const statusNode = document.getElementById("projects-status");
const searchInput = document.getElementById("projects-search");

if (searchInput) {
  searchInput.disabled = true;
}

let allProjects = [];

const PROJECTS_JSON = "projects.json";

async function loadProjects() {
  try {
    const response = await fetch(PROJECTS_JSON);
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.status}`);
    }

    allProjects = await response.json();
    renderProjects(allProjects, summaryText(allProjects.length, allProjects.length));

    if (searchInput) {
      searchInput.disabled = false;
      searchInput.addEventListener("input", handleSearch);
    }
  } catch (error) {
    statusNode.textContent = "Could not load projects.";
    statusNode.classList.add("error");
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function handleSearch(event) {
  if (!Array.isArray(allProjects) || allProjects.length === 0) {
    return;
  }

  const rawQuery = event.target.value || "";
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    renderProjects(allProjects, summaryText(allProjects.length, allProjects.length));
    return;
  }

  const filtered = allProjects.filter((project) => {
    const haystack = [
      project.title,
      project.description,
      project.repoLink,
      project.demoLink,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  const message = filtered.length
    ? summaryText(filtered.length, allProjects.length)
    : `No matches for "${rawQuery}"`;

  renderProjects(filtered, message);
}

function renderProjects(projects, message) {
  statusNode.classList.remove("error");

  if (!Array.isArray(projects) || projects.length === 0) {
    projectsGrid.replaceChildren();
    projectsGrid.hidden = true;
    statusNode.hidden = false;
    statusNode.textContent = message || "No projects to show yet.";
    return;
  }

  projectsGrid.replaceChildren(...projects.map(createProjectCard));

  projectsGrid.hidden = false;

  if (message) {
    statusNode.hidden = false;
    statusNode.textContent = message;
  } else {
    statusNode.hidden = true;
  }
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const title = document.createElement("h2");
  title.textContent = project.title || "Untitled project";
  card.append(title);

  if (project.description) {
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;
    card.append(description);
  }

  const links = document.createElement("div");
  links.className = "project-links";
  addProjectLink(links, project.demoLink, "Demo", "project-link-demo");
  addProjectLink(links, project.repoLink, "Repo", "project-link-repo");

  if (links.childElementCount > 0) {
    card.append(links);
  }

  return card;
}

function addProjectLink(container, href, label, className) {
  if (!href) {
    return;
  }

  const link = document.createElement("a");
  link.className = `project-link ${className}`;
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = label;
  container.append(link);
}

function summaryText(visible, total) {
  if (!total) {
    return "";
  }

  const totalLabel = total === 1 ? "project" : "projects";
  const visibleLabel = visible === 1 ? "project" : "projects";

  if (visible === total) {
    return `Showing ${total} ${totalLabel}.`;
  }

  return `Showing ${visible} ${visibleLabel} of ${total} total.`;
}

loadProjects();
