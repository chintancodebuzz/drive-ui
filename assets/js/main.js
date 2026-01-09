// Import Feather Icons
import feather from "feather-icons";

// Initialize Feather Icons on page load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  // Setup menu item click handlers
  setupMenuHandlers();

  // Setup ask button functionality
  setupAskButton();
});

// Setup menu item active states
function setupMenuHandlers() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      link.classList.add("active");
    });
  });
}

// Setup ask button functionality
function setupAskButton() {
  const askBtn = document.querySelector(".ask-btn");
  const askInput = document.querySelector(".ask-input");

  if (askBtn && askInput) {
    askBtn.addEventListener("click", () => {
      const query = askInput.value.trim();
      if (query) {
        console.log("Query submitted:", query);
        askInput.value = "";
        // Add your API call or logic here
      }
    });

    askInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        askBtn.click();
      }
    });
  }
}
