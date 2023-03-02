const light_mode = document.querySelector(".light_mode");
const light_mode_svg = document.querySelector(".light_mode img");

// detect language value and change element directions
if (localStorage.getItem("language") === "ar") {
    document.querySelector('footer').dir = "rtl";
} else {
    document.querySelector('footer').dir = "ltr";
}

// switch light/dark button
light_mode.addEventListener("click", () => {
    document.documentElement.style.overflow = "hidden";
    document.body.clientWidth;
    if (document.body.classList.contains("light")) {
        document.body.classList.remove("light");
        light_mode_svg.src = 'icons/brightness-down.svg';
        light_mode.setAttribute("value", "dark");
        document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
        document.body.classList.add("light");
        light_mode_svg.src = 'icons/moon-stars.svg';
        light_mode.setAttribute("value", "light");
        document.documentElement.setAttribute("data-color-scheme", "light");
    }
    document.documentElement.style.overflow = "";
    localStorage.setItem("light_mode", light_mode.getAttribute("value"));
});

// switch light/dark after page load
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem("light_mode")) {
        localStorage.setItem("light_mode", "dark");
    }

    if (localStorage.getItem("light_mode") === "dark") {
        document.body.classList.remove("light");
        light_mode_svg.src = 'icons/brightness-down.svg';
        document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
        document.body.classList.add("light");
        light_mode_svg.src = 'icons/moon-stars.svg';
        document.documentElement.setAttribute("data-color-scheme", "light");
    }
});