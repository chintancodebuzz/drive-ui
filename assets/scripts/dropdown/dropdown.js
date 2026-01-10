document.addEventListener("click", function (e) {
    const dropdownBtn = e.target.closest(".dropdown-btn");
    const dropdown = e.target.closest(".custom-dropdown");

    // Close all if clicked outside
    if (!dropdownBtn) {
        document
            .querySelectorAll(".custom-dropdown")
            .forEach((d) => d.classList.remove("active"));
        return;
    }

    // Toggle current dropdown
    document
        .querySelectorAll(".custom-dropdown")
        .forEach((d) => {
            if (d !== dropdown) d.classList.remove("active");
        });

    dropdown.classList.toggle("active");
});

// Handle item click
document.addEventListener("click", function (e) {
    const item = e.target.closest(".dropdown-menu li");
    if (!item) return;

    const dropdown = item.closest(".custom-dropdown");
    const label = dropdown.querySelector(".dropdown-btn span");

    label.textContent = item.textContent;
    dropdown.classList.remove("active");

    // Optional callback
    const value = item.dataset.value;
    const type = dropdown.dataset.type;

    console.log("Dropdown changed:", type, value);
});
