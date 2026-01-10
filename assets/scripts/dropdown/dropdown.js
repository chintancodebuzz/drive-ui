document.addEventListener("click", function (e) {
  const dropdownBtn = e.target.closest(".dropdown-btn");
  const dropdownItem = e.target.closest(".dropdown-menu li");
  const threeDots = e.target.closest(".three-dots");

  if (dropdownBtn) {
    e.stopPropagation();

    document.querySelectorAll(".custom-dropdown").forEach((el) => {
      el.classList.remove("active");
    });

    dropdownBtn.closest(".custom-dropdown").classList.add("active");
    return;
  }

  if (dropdownItem && dropdownItem.closest(".custom-dropdown")) {
    e.stopPropagation();

    const dropdown = dropdownItem.closest(".custom-dropdown");
    const label = dropdown.querySelector(".dropdown-btn span");

    label.textContent = dropdownItem.textContent;
    dropdown.classList.remove("active");

    handleFilterChange(dropdown.dataset.filter, dropdownItem.dataset.value);
    return;
  }

  if (threeDots) {
    e.stopPropagation();

    document.querySelectorAll(".file-actions").forEach((el) => {
      el.classList.remove("active");
      const m = el.querySelector(".file-menu");
      if (m) m.classList.remove("open-left");
    });

    const container = threeDots.closest(".file-actions");
    container.classList.add("active");

    // Flip menu to left if it would overflow the viewport on the right
    const menu = container.querySelector(".file-menu");
    if (menu) {
      requestAnimationFrame(() => {
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth - 8) {
          menu.classList.add("open-left");
        } else {
          menu.classList.remove("open-left");
        }
      });
    }

    return;
  }

  document.querySelectorAll(".custom-dropdown, .file-actions").forEach((el) => {
    el.classList.remove("active");
  });
});
