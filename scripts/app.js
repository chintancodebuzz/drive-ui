class PageLoader {
  constructor() {
    this.currentPage = "home";
    this.pages = {
      home: "pages/home.html",
      mydrive: "pages/mydrive.html",
      starred: "pages/starred.html",
      bin: "pages/bin.html",
      storage: "pages/storage.html",
      plan: "pages/plan.html",
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
      const page =
        window.location.hash.replace("#", "") || "home";
      await this.loadPage(page);
    });
  }

  async loadPage(pageName) {
    if (!this.pages[pageName]) return;

    try {
      document.getElementById("page-content").innerHTML = `
        <div class="main-card">
          <div style="display:flex;justify-content:center;align-items:center;height:200px;">
            <p>Loading...</p>
          </div>
        </div>
      `;

      const response = await fetch(this.pages[pageName]);
      const html = await response.text();
      window.location.hash = pageName;
      document.getElementById("page-content").innerHTML = html;
      this.currentPage = pageName;
      this.initPageScripts(pageName);
      if (window.feather) {
        feather.replace();
      }
    } catch (error) {
      console.error(`Error loading page ${pageName}:`, error);
      document.getElementById("page-content").innerHTML = `
        <div class="main-card">
          <div style="text-align:center;padding:40px;">
            <h3>Error loading page</h3>
            <p>Please try again later.</p>
          </div>
        </div>
      `;
    }
  }

  initPageScripts(pageName) {
    switch (pageName) {
      case "home":
        if (window.initHomePage) {
          window.initHomePage();
        }
        break;

      case "mydrive":
        if (window.initMyDrivePage) {
          window.initMyDrivePage();
        }
        break;

      case "starred":
        if (window.initStarredPage) {
          window.initStarredPage();
        }
        break;

      case "bin":
        if (window.initBinPage) {
          window.initBinPage();
        }
        break;

      case "storage":
        if (window.initStoragePage) {
          window.initStoragePage();
        }
        break;

      default:
        break;
    }
  }
}

// Initialize PageLoader
document.addEventListener("DOMContentLoaded", () => {
  window.pageLoader = new PageLoader();
});
