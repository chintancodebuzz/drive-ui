class PageLoader {
  constructor() {
    this.currentPage = "home";
    this.pages = {
      home: "pages/home.html",
      mydrive: "pages/mydrive.html",
      starred: "pages/starred.html",
      bin: "pages/bin.html",
      storage: "pages/storage.html",
    };

    this.init();
  }

  async init() {
    // Listen for page change events from sidebar
    document.addEventListener("pagechange", async (e) => {
      await this.loadPage(e.detail.page);
    });

    // Load initial page from URL hash
    const initialPage = window.location.hash.replace("#", "") || "home";
    await this.loadPage(initialPage);

    // Handle browser back/forward
    window.addEventListener("hashchange", async () => {
      const page = window.location.hash.replace("#", "") || "home";
      await this.loadPage(page);
    });
  }

  async loadPage(pageName) {
    if (this.pages[pageName]) {
      try {
        // Show loading state
        document.getElementById("page-content").innerHTML = `
          <div class="main-card">
            <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
              <p>Loading...</p>
            </div>
          </div>
        `;

        // Fetch page content
        const response = await fetch(this.pages[pageName]);
        const html = await response.text();

        // Update URL hash
        window.location.hash = pageName;

        // Update page content
        document.getElementById("page-content").innerHTML = html;

        // Update current page
        this.currentPage = pageName;

        // Initialize Feather icons for the new content
        feather.replace();
      } catch (error) {
        console.error(`Error loading page ${pageName}:`, error);
        document.getElementById("page-content").innerHTML = `
          <div class="main-card">
            <div style="text-align: center; padding: 40px;">
              <h3>Error loading page</h3>
              <p>Please try again later.</p>
            </div>
          </div>
        `;
      }
    }
  }
}

// Initialize page loader when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.pageLoader = new PageLoader();
});
