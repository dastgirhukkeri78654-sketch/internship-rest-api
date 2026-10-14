
const API_URL = "/api/internships";
const APPLICATION_API_URL = "/api/applications";

// Internship board elements
const list = document.querySelector("#internship-list");
const searchInput = document.querySelector("#search-input");
const domainFilter = document.querySelector("#domain-filter");
const clearButton = document.querySelector("#clear-button");
const emptyState = document.querySelector("#empty-state");
const errorState = document.querySelector("#error-state");
const retryButton = document.querySelector("#retry-button");
const resultCount = document.querySelector("#result-count");

// Application form elements
const applicationForm = document.querySelector("#application-form");
const applicantName = document.querySelector("#applicant-name");
const applicantEmail = document.querySelector("#applicant-email");
const applicationInternship = document.querySelector("#application-internship");
const applicationSubmit = document.querySelector("#application-submit");
const applicationStatus = document.querySelector("#application-status");

let internshipRecords = [];
let isLoading = false;

// Populate the domain filter
function populateDomains(records) {
  const domains = [
    ...new Set(records.map(item => item.domain))
  ].sort();

  domainFilter.innerHTML =
    '<option value="all">All domains</option>';

  domains.forEach(domain => {
    const option = document.createElement("option");
    option.value = domain;
    option.textContent = domain;
    domainFilter.appendChild(option);
  });
}

// Populate the internship selection in the application form
function populateApplicationInternships(records) {
  applicationInternship.innerHTML =
    '<option value="">Select an internship</option>';

  records
    .filter(item =>
      item.applicationsOpen === true &&
      Number(item.openings) > 0
    )
    .forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.title} (${item.id})`;
      applicationInternship.appendChild(option);
    });
}

// Create an internship card
function createCard(item) {
  const article = document.createElement("article");
  article.className = "card";
  article.tabIndex = 0;

  const top = document.createElement("div");
  top.className = "card-top";

  const title = document.createElement("h3");
  title.textContent = item.title;

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = item.domain;

  top.append(title, badge);

  const mode = document.createElement("p");
  mode.className = "meta";
  mode.textContent = `${item.mode} · ${item.location}`;

  const skillsLabel = document.createElement("p");
  skillsLabel.className = "meta";
  skillsLabel.textContent = "Skills";

  const skills = document.createElement("div");
  skills.className = "skills";
  skills.setAttribute("aria-label", `${item.title} skills`);

  const skillNames = Array.isArray(item.skills)
    ? item.skills
    : [];

  if (skillNames.length > 0) {
    skillNames.forEach(skillName => {
      const skill = document.createElement("span");
      skill.className = "skill";
      skill.textContent = skillName;
      skills.appendChild(skill);
    });
  } else {
    const unavailable = document.createElement("span");
    unavailable.className = "skill";
    unavailable.textContent = "Skills not specified";
    skills.appendChild(unavailable);
  }

  const openings = document.createElement("p");
  openings.className = "openings";
  openings.textContent =
    `${item.openings} opening${item.openings === 1 ? "" : "s"} · ${item.id}`;

  article.append(top, mode, skillsLabel, skills, openings);

  return article;
}

// Display internship cards
function render(records) {
  list.innerHTML = "";

  emptyState.hidden = records.length !== 0;

  resultCount.textContent =
    `${records.length} result${records.length === 1 ? "" : "s"}`;

  const fragment = document.createDocumentFragment();

  records.forEach(item => {
    fragment.appendChild(createCard(item));
  });

  list.appendChild(fragment);
}

// Search and filter internships
function filterRecords() {
  if (isLoading) return;

  const query = searchInput.value.trim().toLowerCase();
  const selectedDomain = domainFilter.value;

  const filtered = internshipRecords.filter(item => {
    const searchable = [
      item.title,
      item.domain,
      item.mode,
      item.location,
      ...(Array.isArray(item.skills) ? item.skills : [])
    ].join(" ").toLowerCase();

    return searchable.includes(query) &&
      (selectedDomain === "all" ||
        item.domain === selectedDomain);
  });

  render(filtered);
}

// Load internships from the backend API
async function initialise() {
  isLoading = true;

  errorState.hidden = true;
  emptyState.hidden = true;
  list.innerHTML = "";

  resultCount.textContent = "Loading internships…";
  list.setAttribute("aria-busy", "true");

  retryButton.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("The API returned an unexpected response.");
    }

    internshipRecords = result.data;

    populateDomains(internshipRecords);
    populateApplicationInternships(internshipRecords);

    isLoading = false;

    list.setAttribute("aria-busy", "false");
    retryButton.disabled = false;

    filterRecords();
  } catch (error) {
    console.error("Could not load internships:", error);

    isLoading = false;

    list.setAttribute("aria-busy", "false");
    list.innerHTML = "";

    emptyState.hidden = true;
    errorState.hidden = false;
    resultCount.textContent = "Unable to load internships";

    retryButton.disabled = false;

    applicationInternship.innerHTML =
      '<option value="">Internships unavailable</option>';
  }
}

// Submit an application to the backend API
applicationForm.addEventListener("submit", async event => {
  event.preventDefault();

  applicationStatus.textContent = "";

  if (!applicationForm.checkValidity()) {
    applicationForm.reportValidity();
    return;
  }

  applicationSubmit.disabled = true;
  applicationStatus.textContent = "Submitting your application…";

  try {
    const response = await fetch(APPLICATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        applicantName: applicantName.value.trim(),
        email: applicantEmail.value.trim(),
        internshipId: applicationInternship.value
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const details = result.error?.details;
      const messages = [
        result.error?.message || "Application failed.",
        ...(Array.isArray(details) ? details : [])
      ];

      throw new Error(messages.join(" "));
    }

    applicationStatus.textContent =
      result.message || "Application submitted successfully.";

    applicationForm.reset();
  } catch (error) {
    console.error("Application submission failed:", error);

    applicationStatus.textContent =
      error.message ||
      "Unable to submit your application. Please try again.";
  } finally {
    applicationSubmit.disabled = false;
  }
});

// Search, filter, clear, and retry events
searchInput.addEventListener("input", filterRecords);
domainFilter.addEventListener("change", filterRecords);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  domainFilter.value = "all";
  searchInput.focus();
  filterRecords();
});

retryButton.addEventListener("click", initialise);

// Start the application
initialise();
