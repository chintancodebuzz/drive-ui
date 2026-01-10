// ../assets/scripts/render-files.js
console.log("render-files.js LOADED");

// Function to render files in the grid
function renderFilesGrid() {
  console.log("renderFilesGrid called"); // Debug log
  console.log("filesData available?", typeof window.filesData !== "undefined"); // Debug log
  console.log("filesData:", window.filesData); // Debug log

  const filesGrid = document.getElementById("filesGrid");

  if (!filesGrid) {
    console.error("Files grid element not found!");
    return;
  }

  // Check if filesData exists
  if (
    !window.filesData ||
    !Array.isArray(window.filesData) ||
    window.filesData.length === 0
  ) {
    console.error("filesData is not defined or empty!");
    filesGrid.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  // Clear existing content
  filesGrid.innerHTML = "";

  // Create file cards using map
  const fileCards = window.filesData.map((file) => {
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
                <img src="assets/images/common/three_dot.svg" class="three-dots" />

                
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  // Join the array into HTML string
  filesGrid.innerHTML = fileCards.join("");

  console.log(`Rendered ${window.filesData.length} files`); // Debug log

  // Add event listeners to file cards
  document.querySelectorAll(".file-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Ignore clicks that originate from file-actions or three-dots so they can be handled separately
      if (e.target.closest('.file-actions') || e.target.closest('.three-dots')) return;
      const fileId = this.getAttribute("data-file-id");
      const file = window.filesData.find((f) => f.id == fileId);
      if (file) {
        console.log("File clicked:", file.name);
        // You can add your file opening logic here
        alert(
          `Opening file: ${file.name}\nType: ${file.type}\nSize: ${file.size}`
        );
      }
    });
  });
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing files grid...");
  renderFilesGrid();
});

window.initHomePage = function () {
  console.log("Home page initialized");
  renderFilesGrid();
};

// Also run on window load as a fallback
window.addEventListener("load", function () {
  console.log("Window loaded, checking files grid...");
  // If files grid is still empty, render again
  const filesGrid = document.getElementById("filesGrid");
  if (filesGrid && filesGrid.innerHTML.trim() === "") {
    renderFilesGrid();
  }
});
