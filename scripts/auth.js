document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".toggle-password");

    toggles.forEach((toggle) => {
        toggle.addEventListener("click", function () {
            const passwordInput = this.parentElement.querySelector(".password-field");
            const icon = this.querySelector("img");

            if (!passwordInput || !icon) return;

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.src = "../../assets/images/auth/hide_eye.svg";
                icon.alt = "hide password";
            } else {
                passwordInput.type = "password";
                icon.src = "../../assets/images/auth/show_eye.svg";
                icon.alt = "show password";
            }
        });
    });
});
