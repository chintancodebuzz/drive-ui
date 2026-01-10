console.log("render-starred.js LOADED");

let starredCurrentView = "grid";

function renderGridViewStarred() {
  console.log("Rendering starred grid view...");

  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    console.error("Files container element not found!");
    return;
  }

  if (!window.starredFilesData || !Array.isArray(window.starredFilesData)) {
    console.error("starredFilesData is not defined!");
    filesContainer.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  // Reset to grid view classes
  filesContainer.className = "files-grid";

  const fileCards = window.starredFilesData.map((file) => {
    const starIcon = file.isStarred
      ? "assets/images/home/star.svg"
      : "assets/images/home/inactive_star.svg";

    const starClass = file.isStarred ? "star-icon" : "inactive-star-icon";

    return `
      <div class="file-card folder" data-file-id="${file.id}">
        <div class="file-thumbnail">
          <img src="${file.image}" alt="${file.name}" />
          <div class="file-rating">
            <img 
              src="${starIcon}" 
              alt="${file.isStarred ? "starred" : "not starred"}" 
              class="rating-icon ${starClass}"
            />
          </div>
        </div>
        <div class="file-info">
          <div class="file-name-wrapper">
            <div class="file-name">${file.name}</div>
            <div class="file-actions" data-file-id="${file.id}">
                <img src="../assets/images/common/three_dot.svg" class="three-dots" />

                <ul class="dropdown-menu file-menu">
                  <li data-action="rename">Rename</li>
                  <li data-action="download">Download</li>
                  <li data-action="delete" class="danger">Delete</li>
                </ul>
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  filesContainer.innerHTML = fileCards.join("");
  console.log(`Rendered ${window.starredFilesData.length} files in grid view`);
}

// Function to render list/table view
function renderListViewStarred() {
  console.log("Rendering starred list view...");

  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    console.error("Files container element not found!");
    return;
  }

  if (!window.starredFilesData || !Array.isArray(window.starredFilesData)) {
    console.error("starredFilesData is not defined!");
    filesContainer.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  // Change to list view classes
  filesContainer.className = "files-grid list-view";

  // Create table structure
  const tableHTML = `
    <table class="files-table">
      <thead style="background: #2152910A">

        <tr>
          <th class="th-name">
            <div class="table-header-cell">
              <span>File Name</span>
            </div>
          </th>
          <th class="th-category">
            <div class="table-header-cell">
              <span>Category</span>
            </div>
          </th>
          <th class="th-date">
            <div class="table-header-cell">
              <span>Uploaded Date</span>
            </div>
          </th>
          <th class="th-size">
            <div class="table-header-cell">
              <span>File Size</span>
              </div>
              </th>
              <th class="th-actions">
              <div class="table-header-cell">
              <span></span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        ${window.starredFilesData
      .map(
        (file) => `
          <tr class="file-row" data-file-id="${file.id}">
            <td class="td-name">
              <div class="file-info-cell">
                <div class="file-icon-wrapper">
                  <img src="${file.icon}" alt="${file.name}" class="file-icon">
                 
                </div>
                <div class="file-details">
                  <div class="file-name-table">${file.name}</div>
                  <div class="file-format">Shared <img src="assets/images/mydrive/shared.svg" alt="shared"/></div>
                </div>
              </div>
            </td>
            <td class="td-category">
              <span class="">${file.category}</span>
            </td>
            <td class="td-date">${file.uploaded}</td>
            <td class="td-size">${file.size}</td>
            <td class="td-actions">
              <div class="action-buttons">
               ${file.isStarred
            ? `
<button class="action-btn info-btn" title="Info">
                  <img src="assets/images/home/star.svg" alt="info" width="16" height="16">
                </button>                  `
            : `<button class="action-btn info-btn" title="Info">
                  <img src="assets/images/home/inactive_star.svg" alt="info" width="16" height="16">
                </button>`
          }
                
                <div class="file-actions" data-file-id="${file.id}">
                  <img
                    src="../assets/images/common/three_dot.svg"
                    class="three-dots"
                    alt="options"
                  />

                  <ul class="dropdown-menu file-menu">
                    <li data-action="restore">Restore</li>
                    <li data-action="delete" class="danger">Delete Permanently</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        `
      )
      .join("")}
      </tbody>
    </table>
  `;

  filesContainer.innerHTML = tableHTML;
  console.log(`Rendered ${window.starredFilesData.length} files in list view`);
}

// Function to switch between views
function switchViewStarred(viewType) {
  starredCurrentView = viewType;

  // Update active button state
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (viewType === "grid") {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    renderGridViewStarred();
  } else {
    gridBtn.classList.remove("active");
    listBtn.classList.add("active");
    renderListViewStarred();
  }
}

// Initialize view toggle buttons
function initViewToggleStarred() {
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => switchViewStarred("grid"));
    listBtn.addEventListener("click", () => switchViewStarred("list"));
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing Starred...");
  initViewToggleStarred();
  renderGridViewStarred(); // Default to grid view
});

// Make functions available globally
window.initStarred = function () {
  console.log("Starred page initialized");
  initViewToggleStarred();
  renderGridViewStarred();
};

// Alias expected by PageLoader when pages are loaded dynamically
window.initStarredPage = window.initStarred;