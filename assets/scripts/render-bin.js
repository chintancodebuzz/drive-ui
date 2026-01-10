console.log("render-bin.js LOADED");

let binCurrentView = "grid";

function renderGridViewBin() {
  console.log("Rendering bin grid view...");

  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    console.error("Files container element not found!");
    return;
  }

  if (!window.binFilesData || !Array.isArray(window.binFilesData)) {
    console.error("binFilesData is not defined!");
    filesContainer.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  // Reset to grid view classes
  filesContainer.className = "files-grid";

  const fileCards = window.binFilesData.map((file) => {
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
              <img
                src="../assets/images/common/three_dot.svg"
                class="three-dots"
                alt="options"
              />

              <ul class="dropdown-menu file-menu">
                <li data-action="restore"><img src="assets/images/common/action/info.svg" alt="restore"/>Restore</li>
                <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete Permanently</li>
              </ul>
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  filesContainer.innerHTML = fileCards.join("");
  console.log(`Rendered ${window.binFilesData.length} files in grid view`);
  if (window.__modals && window.__modals.attachFileActionHandlers) window.__modals.attachFileActionHandlers();
}

// Function to render list/table view
function renderListViewBin() {
  console.log("Rendering bin list view...");

  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    console.error("Files container element not found!");
    return;
  }

  if (!window.binFilesData || !Array.isArray(window.binFilesData)) {
    console.error("binFilesData is not defined!");
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
        ${window.binFilesData
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
                  <div class="file-format">Deleted <img src="assets/images/mydrive/shared.svg" alt="deleted"/></div>
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
                    <li data-action="restore"><img src="assets/images/common/action/info.svg" alt="restore"/>Restore</li>
                    <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete Permanently</li>
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
  console.log(`Rendered ${window.binFilesData.length} files in list view`);
  if (window.__modals && window.__modals.attachFileActionHandlers) window.__modals.attachFileActionHandlers();
}

// Function to switch between views
function switchViewBin(viewType) {
  binCurrentView = viewType;

  // Update active button state
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (viewType === "grid") {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    renderGridViewBin();
  } else {
    gridBtn.classList.remove("active");
    listBtn.classList.add("active");
    renderListViewBin();
  }
}

// Initialize view toggle buttons
function initViewToggleBin() {
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => switchViewBin("grid"));
    listBtn.addEventListener("click", () => switchViewBin("list"));
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing Bin...");
  initViewToggleBin();
  renderGridViewBin(); // Default to grid view
});

// Make functions available globally
window.initBin = function () {
  console.log("Bin page initialized");
  initViewToggleBin();
  renderGridViewBin();
};

// Alias expected by PageLoader when pages are loaded dynamically
window.initBinPage = window.initBin;