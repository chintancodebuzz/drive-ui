console.log("render-mydrive.js LOADED");

let currentView = "grid";

function renderGridView() {
  console.log("Rendering grid view...");

  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    console.error("Files container element not found!");
    return;
  }

  if (!window.mydriveFilesData || !Array.isArray(window.mydriveFilesData)) {
    console.error("mydriveFilesData is not defined!");
    filesContainer.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  // Reset to grid view classes
  filesContainer.className = "files-grid";

  const fileCards = window.mydriveFilesData.map((file) => {
    const starIcon = file.isStarred
      ? "../assets/images/home/star.svg"
      : "../assets/images/home/inactive_star.svg";

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
                  <li data-action="file_info"><img src="assets/images/common/action/info.svg" alt="info"/>File Information</li>
                  <li data-action="rename"><img src="assets/images/common/action/rename.svg" alt="rename"/>Rename</li>
                  <li data-action="download"><img src="assets/images/common/action/download.svg" alt="download"/>Download</li>
                  <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete</li>
                </ul>
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  filesContainer.innerHTML = fileCards.join("");
  console.log(`Rendered ${window.mydriveFilesData.length} files in grid view`);

  // Add click handlers to file cards that ignore clicks inside file-actions so menus can open normally
  document.querySelectorAll(".file-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.closest(".file-actions") || e.target.closest(".three-dots"))
        return;
      const fileId = this.getAttribute("data-file-id");
      const file = window.mydriveFilesData.find((f) => f.id == fileId);
      if (file) {
        console.log("File clicked:", file.name);
        // Optional: open preview or navigate to file
      }
    });
  });
}

// Function to render list/table view
function renderListView() {
  console.log("Rendering list view...");

  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    console.error("Files container element not found!");
    return;
  }

  if (!window.mydriveFilesData || !Array.isArray(window.mydriveFilesData)) {
    console.error("mydriveFilesData is not defined!");
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
        ${window.mydriveFilesData
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
               ${
                 file.isStarred
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
                  <li data-action="file_info"><img src="assets/images/common/action/info.svg" alt="info"/>File Information</li>
                  <li data-action="rename"><img src="assets/images/common/action/rename.svg" alt="rename"/>Rename</li>
                  <li data-action="download"><img src="assets/images/common/action/download.svg" alt="download"/>Download</li>
                  <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete</li>
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
  console.log(`Rendered ${window.mydriveFilesData.length} files in list view`);
}

// Function to switch between views
function switchView(viewType) {
  currentView = viewType;

  // Update active button state
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (viewType === "grid") {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    renderGridView();
  } else {
    gridBtn.classList.remove("active");
    listBtn.classList.add("active");
    renderListView();
  }
}

// Initialize view toggle buttons
function initViewToggle() {
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => switchView("grid"));
    listBtn.addEventListener("click", () => switchView("list"));
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing My Drive...");
  initViewToggle();
  renderGridView(); // Default to grid view
});

// Make functions available globally
window.initMyDrive = function () {
  console.log("My Drive page initialized");
  initViewToggle();
  renderGridView();
};
