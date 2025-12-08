const projectsGrid = document.getElementById("projects-grid");
const statusNode = document.getElementById("projects-status");

const PROJECTS_JSON = "projects.json";

async function loadProjects() {
  try {
    const response = await fetch(PROJECTS_JSON);
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.status}`);
    }

    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    statusNode.textContent = "Could not load projects.";
    statusNode.classList.add("error");
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function renderProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    statusNode.textContent = "No projects to show yet.";
    return;
  }

  projectsGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <h2>${project.title}</h2>
          <p class="project-description">${project.description}</p>
          <div class="project-links">
            <a href="${project.demoLink}" target="_blank" rel="noopener">Demo</a>
            <a href="${project.repoLink}" target="_blank" rel="noopener">Repo</a>
          </div>
        </article>
      `
    )
    .join("");

  projectsGrid.hidden = false;
  statusNode.hidden = true;
}

loadProjects();
