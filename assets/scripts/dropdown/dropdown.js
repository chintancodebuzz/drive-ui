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
        });

        threeDots.closest(".file-actions").classList.add("active");
        return;
    }

    document.querySelectorAll(".custom-dropdown, .file-actions").forEach((el) => {
        el.classList.remove("active");
    });
});
