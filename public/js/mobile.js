const nav_toggle = document.querySelector(".nav_toggle");
const menu_container = document.querySelector(".menu_container");
const g_header = document.querySelector(".g_header");

// navbar for mobile devices
nav_toggle.addEventListener("click", (e) => {
  if (!nav_toggle.classList.contains("open")) {
    nav_toggle.classList.add("open");
    menu_container.classList.add("open");
    if (g_header) g_header.classList.remove("sticky");
  } else {
    nav_toggle.classList.remove("open");
    menu_container.classList.remove("open");
    if (g_header) g_header.classList.remove("sticky");
  }
});

menu_container.addEventListener("click", (e) => {
  if (e.target.matches(".menu_list, p, ul, li, select, .nav_footer")) {
    e.stopPropagation();
  } else {
    menu_container.classList.remove("open");
    nav_toggle.classList.remove("open");
    if (g_header) g_header.classList.add("sticky");
  }
});
