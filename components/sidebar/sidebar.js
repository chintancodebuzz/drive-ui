class Sidebar {
  constructor() {
    this.sidebar = null;
    this.mainContent = null;
    this.toggleBtn = null;
    this.mobileMenuToggle = null;
    this.toggleIcon = null;
    this.mobileToggleIcon = null;
    this.initialized = false;
  }

  async init() {
    // Load sidebar HTML
    await this.loadSidebar();

    // Initialize references
    this.sidebar = document.getElementById("sidebar");
    this.mainContent = document.getElementById("mainContent");
    this.toggleBtn = document.getElementById("toggleBtn");
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");

    if (this.toggleBtn && this.toggleBtn.querySelector("i")) {
      this.toggleIcon = this.toggleBtn.querySelector("i");
    }

    if (this.mobileMenuToggle && this.mobileMenuToggle.querySelector("i")) {
      this.mobileToggleIcon = this.mobileMenuToggle.querySelector("i");
    }

    // Setup event listeners
    this.setupEventListeners();
    this.handleResize();
    this.updateToggleIcon();

    // Listen for page changes to update active state
    document.addEventListener("pagechange", (e) => {
      this.updateActiveNavItem(e.detail.page);
    });

    // Set initial active item from URL hash
    const initialPage = (window.location.hash || "").replace("#", "") || "home";
    this.updateActiveNavItem(initialPage);

    this.initialized = true;
  }

  async loadSidebar() {
    try {
      // Use the correct relative path
      const response = await fetch("components/sidebar/sidebar.html");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sidebarHTML = await response.text();
      document.getElementById("sidebar-container").innerHTML = sidebarHTML;

      // Re-initialize references after loading HTML
      this.sidebar = document.getElementById("sidebar");
      this.toggleBtn = document.getElementById("toggleBtn");
    } catch (error) {
      console.error("Error loading sidebar:", error);

      // Fallback: Create sidebar directly if fetch fails
      this.createSidebarFallback();
    }
  }

  createSidebarFallback() {
    const fallbackHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="logo-container">
          <div class="logo-wrapper">
            <img
              src="assets/images/logos/logo_without_bg.svg"
              alt="M'Clime Logo"
              class="logo-img"
            />
            <span class="logo-text">M'Clime</span>
          </div>

          <button class="toggle-btn" id="toggleBtn">
            <img
              src="assets/images/sidebar/collpsed.svg"
              alt="Toggle Sidebar"
              class="toggle-icon"
            />
          </button>

          <div class="tooltip">M'Clime</div>
        </div>

        <button class="btn-add-new">
          <img src="assets/images/sidebar/plus.svg" alt="Add New" />
          <span>Add New</span>
          <div class="tooltip">Add New</div>
        </button>

        <nav>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#home" class="nav-link" data-page="home">
                <span class="icon-bg"><img src="assets/images/sidebar/home.svg" alt="Home" /></span>
                <span class="nav-text">Home</span>
                <div class="tooltip">Home</div>
              </a>
            </li>
            <li class="nav-item">
              <a href="#mydrive" class="nav-link" data-page="mydrive">
                <span class="icon-bg"><img src="assets/images/sidebar/drive.svg" alt="My Drive" /></span>
                <span class="nav-text">My Drive</span>
                <div class="tooltip">My Drive</div>
              </a>
            </li>
            <li class="nav-item">
              <a href="#starred" class="nav-link" data-page="starred">
                <span class="icon-bg"><img src="assets/images/sidebar/starred.svg" alt="Starred" /></span>
                <span class="nav-text">Starred</span>
                <div class="tooltip">Starred</div>
              </a>
            </li>
            <li class="nav-item">
              <a href="#bin" class="nav-link" data-page="bin">
                <span class="icon-bg"><img src="assets/images/sidebar/bin.svg" alt="Bin" /></span>
                <span class="nav-text">Bin</span>
                <div class="tooltip">Bin</div>
              </a>
            </li>
            <li class="nav-item">
              <a href="#storage" class="nav-link" data-page="storage">
                <span class="icon-bg"><img src="assets/images/sidebar/storages.svg" alt="Storage" /></span>
                <span class="nav-text">Storage</span>
                <div class="tooltip">Storage</div>
              </a>
            </li>
          </ul>
        </nav>

        <div class="sidebar-upgrade">
          <div class="upgrade-card">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="#e0e7ff"
                stroke="#818cf8"
                stroke-width="1.5"
              />
              <path
                d="M16 10V22M12 18L16 22L20 18"
                stroke="#5b21b6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div>Upgrade Plan</div>
            <div class="storage-info">5000 / 10008</div>
          </div>
          <div class="tooltip">Upgrade Plan</div>
        </div>
      </aside>
    `;

    document.getElementById("sidebar-container").innerHTML = fallbackHTML;
  }

  setupEventListeners() {
    // We'll attach event listeners after a small delay to ensure DOM is ready
    setTimeout(() => {
      // Toggle sidebar
      this.toggleBtn = document.getElementById("toggleBtn");
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener("click", () => this.toggleSidebar());
      }

      // Mobile menu toggle
      this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.addEventListener("click", () =>
          this.toggleSidebar()
        );
      }

      // Navigation links
      document.addEventListener("click", (e) => {
        const navLink = e.target.closest(".nav-link");
        if (navLink) {
          e.preventDefault();
          const page = navLink.dataset.page;
          this.navigateTo(page);
        }
      });

      const upgradePlanBtn = document.getElementById("upgradePlanBtn");
      if (upgradePlanBtn) {
        upgradePlanBtn.addEventListener("click", () => this.navigateTo("plan"));
      }

      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (e) => {
        if (
          this.isMobile() &&
          this.sidebar &&
          !this.sidebar.contains(e.target) &&
          this.mobileMenuToggle &&
          !this.mobileMenuToggle.contains(e.target) &&
          this.sidebar.classList.contains("mobile-open")
        ) {
          this.closeMobileSidebar();
        }
      });
    }, 100);
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  updateToggleIcon() {
    if (!this.toggleIcon) {
      // Try to get toggle icon again
      this.toggleIcon = document.querySelector("#toggleBtn i");
    }

    if (this.toggleIcon && this.sidebar) {
      if (this.sidebar.classList.contains("collapsed")) {
        this.toggleIcon.setAttribute("data-feather", "chevrons-right");
      } else {
        this.toggleIcon.setAttribute("data-feather", "chevrons-left");
      }
      feather.replace();
    }
  }

  toggleSidebar() {
    if (!this.sidebar) {
      this.sidebar = document.getElementById("sidebar");
      this.mainContent = document.getElementById("mainContent");
    }

    if (this.isMobile()) {
      this.sidebar.classList.toggle("mobile-open");
      if (!this.mobileToggleIcon) {
        this.mobileToggleIcon = document.querySelector("#mobileMenuToggle i");
      }
      if (this.mobileToggleIcon) {
        this.mobileToggleIcon.setAttribute(
          "data-feather",
          this.sidebar.classList.contains("mobile-open") ? "x" : "menu"
        );
        feather.replace();
      }
    } else {
      this.sidebar.classList.toggle("collapsed");
      this.mainContent.classList.toggle("collapsed");
      this.updateToggleIcon();
    }
  }

  closeMobileSidebar() {
    this.sidebar.classList.remove("mobile-open");
    if (this.mobileToggleIcon) {
      this.mobileToggleIcon.setAttribute("data-feather", "menu");
      feather.replace();
    }
  }

  handleResize() {
    if (!this.sidebar) {
      this.sidebar = document.getElementById("sidebar");
      this.mainContent = document.getElementById("mainContent");
    }

    if (this.isMobile()) {
      this.sidebar.classList.add("collapsed");
      this.sidebar.classList.remove("mobile-open");
      this.mainContent.classList.add("collapsed");
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.style.display = "flex";
      }
      if (!this.mobileToggleIcon) {
        this.mobileToggleIcon = document.querySelector("#mobileMenuToggle i");
      }
      if (this.mobileToggleIcon) {
        this.mobileToggleIcon.setAttribute("data-feather", "menu");
      }
    } else {
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.style.display = "none";
      }
      this.sidebar.classList.remove("mobile-open");
    }
    feather.replace();
  }

  navigateTo(page) {
    // Dispatch custom event for page change
    const event = new CustomEvent("pagechange", {
      detail: { page: page },
    });
    document.dispatchEvent(event);

    // Update URL hash
    window.location.hash = page;

    // Close sidebar on mobile after navigation
    if (this.isMobile()) {
      this.closeMobileSidebar();
    }
  }

  updateActiveNavItem(page) {
    // Remove active class from all nav items
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to current page
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
}

// Initialize sidebar when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.sidebar = new Sidebar();
  window.sidebar.init().catch((error) => {
    console.error("Failed to initialize sidebar:", error);
  });
});
