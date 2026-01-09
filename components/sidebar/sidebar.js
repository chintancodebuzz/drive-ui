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
    this.sidebar = document.getElementById('sidebar');
    this.mainContent = document.getElementById('mainContent');
    this.toggleBtn = document.getElementById('toggleBtn');
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (this.toggleBtn && this.toggleBtn.querySelector('i')) {
      this.toggleIcon = this.toggleBtn.querySelector('i');
    }
    
    if (this.mobileMenuToggle && this.mobileMenuToggle.querySelector('i')) {
      this.mobileToggleIcon = this.mobileMenuToggle.querySelector('i');
    }

    // Setup event listeners
    this.setupEventListeners();
    this.handleResize();
    this.updateToggleIcon();
    
    // Listen for page changes to update active state
    document.addEventListener('pagechange', (e) => {
      this.updateActiveNavItem(e.detail.page);
    });

    this.initialized = true;
  }

  async loadSidebar() {
    try {
      const response = await fetch('./sidebar.html');
      const sidebarHTML = await response.text();
      document.getElementById('sidebar-container').innerHTML = sidebarHTML;
    } catch (error) {
      console.error('Error loading sidebar:', error);
      document.getElementById('sidebar-container').innerHTML = '<p>Error loading sidebar</p>';
    }
  }

  setupEventListeners() {
    // Toggle sidebar
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleSidebar());
    }

    // Navigation links
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav-link');
      if (navLink) {
        e.preventDefault();
        const page = navLink.dataset.page;
        this.navigateTo(page);
      }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (this.isMobile() && 
          this.sidebar && 
          !this.sidebar.contains(e.target) && 
          this.mobileMenuToggle && 
          !this.mobileMenuToggle.contains(e.target) && 
          this.sidebar.classList.contains('mobile-open')) {
        this.closeMobileSidebar();
      }
    });

    // Window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  updateToggleIcon() {
    if (!this.toggleIcon) return;
    
    if (this.sidebar.classList.contains('collapsed')) {
      this.toggleIcon.setAttribute('data-feather', 'chevrons-right');
    } else {
      this.toggleIcon.setAttribute('data-feather', 'chevrons-left');
    }
    feather.replace();
  }

  toggleSidebar() {
    if (this.isMobile()) {
      this.sidebar.classList.toggle('mobile-open');
      if (this.mobileToggleIcon) {
        this.mobileToggleIcon.setAttribute(
          'data-feather',
          this.sidebar.classList.contains('mobile-open') ? 'x' : 'menu'
        );
        feather.replace();
      }
    } else {
      this.sidebar.classList.toggle('collapsed');
      this.mainContent.classList.toggle('collapsed');
      this.updateToggleIcon();
    }
  }

  closeMobileSidebar() {
    this.sidebar.classList.remove('mobile-open');
    if (this.mobileToggleIcon) {
      this.mobileToggleIcon.setAttribute('data-feather', 'menu');
      feather.replace();
    }
  }

  handleResize() {
    if (this.isMobile()) {
      this.sidebar.classList.add('collapsed');
      this.sidebar.classList.remove('mobile-open');
      this.mainContent.classList.add('collapsed');
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.style.display = 'flex';
      }
      if (this.mobileToggleIcon) {
        this.mobileToggleIcon.setAttribute('data-feather', 'menu');
      }
    } else {
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.style.display = 'none';
      }
      this.sidebar.classList.remove('mobile-open');
    }
    feather.replace();
  }

  navigateTo(page) {
    // Dispatch custom event for page change
    const event = new CustomEvent('pagechange', { 
      detail: { page: page } 
    });
    document.dispatchEvent(event);

    // Close sidebar on mobile after navigation
    if (this.isMobile()) {
      this.closeMobileSidebar();
    }
  }

  updateActiveNavItem(page) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current page
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sidebar = new Sidebar();
  window.sidebar.init();
});