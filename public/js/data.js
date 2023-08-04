const steam_id_input = document.querySelector(".steam_id_input");
const games_container = document.querySelector(".g_container");
const games_length = document.querySelector(".games_length");

// detect language value and change element directions
if (localStorage.getItem("language") === "ar") {
  document.querySelector(".header").dir = "rtl";
  document.querySelector(".container_1").dir = "rtl";
  document.querySelector("footer").dir = "rtl";
  steam_id_input.placeholder = "أكتب steamID الخاص بك";
} else {
  document.querySelector(".header").dir = "ltr";
  document.querySelector(".container_1").dir = "ltr";
  document.querySelector("footer").dir = "ltr";
  steam_id_input.placeholder = "Enter your steamID";
}

const light_mode = document.querySelector(".light_mode");
const light_mode_svg = document.querySelector(".light_mode img");

// switch light/dark button
light_mode.addEventListener("click", () => {
  document.documentElement.style.overflow = "hidden";
  document.body.clientWidth;
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    light_mode_svg.src = "icons/brightness-down.svg";
    light_mode.setAttribute("value", "dark");
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.body.classList.add("light");
    light_mode_svg.src = "icons/moon-stars.svg";
    light_mode.setAttribute("value", "light");
    document.documentElement.setAttribute("data-color-scheme", "light");
  }
  document.documentElement.style.overflow = "";
  localStorage.setItem("light_mode", light_mode.getAttribute("value"));
});

// switch light/dark after page load
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("light_mode")) {
    localStorage.setItem("light_mode", "dark");
  }

  if (localStorage.getItem("light_mode") === "dark") {
    document.body.classList.remove("light");
    light_mode_svg.src = "icons/brightness-down.svg";
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.body.classList.add("light");
    light_mode_svg.src = "icons/moon-stars.svg";
    document.documentElement.setAttribute("data-color-scheme", "light");
  }
});

// pagination and data stats
const state = {
  gamesData: [],
  page: 1,
  rows: 25,
  window: 5,
  searchValue: null,
  sortLast2weak: null,
  friendsList: [],
  searchUsers: [],
};

function pagination(gamesData, page, rows) {
  let trimStart = (page - 1) * rows;
  let trimEnd = trimStart + rows;
  let trimmedData = gamesData.slice(trimStart, trimEnd);
  let pages = Math.ceil(gamesData.length / rows);
  return {
    gamesData: trimmedData,
    pages: pages,
    trimStart: trimStart,
  };
}

function paginate_buttons(pages) {
  const pagination_nav = document.querySelector(".pagination");
  pagination_nav.innerHTML = "";

  let maxLeft = state.page - Math.floor(state.window / 2);
  let maxRight = state.page + Math.floor(state.window / 2);

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = state.window;
  }

  if (maxRight > pages) {
    maxLeft = pages - (state.window - 1);

    if (maxLeft < 1) maxLeft = 1;
    maxRight = pages;
  }

  for (var page = maxLeft; page <= maxRight; page++) {
    if (state.page === page) {
      pagination_nav.innerHTML += `<a value="${page}" class="paginate_button active">${page}</a>`;
    } else {
      pagination_nav.innerHTML += `<a value="${page}" class="paginate_button">${page}</a>`;
    }
  }

  if (state.page != 1) {
    pagination_nav.innerHTML =
      `<a value="${
        state.page - 1
      }" class="paginate_button" data-lang="paginate_1">Previous</a>` +
      pagination_nav.innerHTML;
  } else {
    pagination_nav.innerHTML =
      `<a value="${
        state.page - 1
      }" style="color:#aaa;pointer-events:none;border:0;" class="paginate_button" data-lang="paginate_1">Previous</a>` +
      pagination_nav.innerHTML;
  }

  if (state.page != pages) {
    pagination_nav.innerHTML += `<a value="${
      state.page + 1
    }" class="paginate_button" data-lang="paginate_2">Next</a>`;
  } else {
    pagination_nav.innerHTML += `<a value="${
      state.page + 1
    }" style="color:#aaa;pointer-events:none;border:0;" class="paginate_button" data-lang="paginate_2">Next</a>`;
  }

  const paginate_button = document.querySelectorAll(".paginate_button");
  paginate_button.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      state.page = JSON.parse(event.target.attributes["value"].value);
      build_html_data();
    });
  });
  setLanguage(localStorage.getItem("language"));
}

// when hovering over a game icon show the game name
function icons_hover() {
  const d_img_wrapper = document.querySelectorAll(".d .d_img_wrapper");
  d_img_wrapper.forEach((icon) => {
    icon.addEventListener("mouseenter", (event) => {
      event.target.parentElement.classList.add("active");
    });
  });
  d_img_wrapper.forEach((icon) => {
    icon.addEventListener("mouseleave", (event) => {
      event.target.parentElement.classList.remove("active");
    });
  });
}

// load searched img src only on client screen
function gamesImgLazyLoading() {
  const imgs = document.querySelectorAll(".g_container .d img");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0,
    }
  );

  imgs.forEach((img) => {
    observer.observe(img);
  });
}

// dropdown select apps length
const apps_length = document.querySelector(".apps_length");
apps_length.addEventListener("change", (e) => {
  if (state.gamesData.length) {
    let value = JSON.parse(e.target.value);
    state.page = 1;
    if (value !== -1) {
      state.rows = value;
    } else {
      state.rows = state.gamesData.length;
    }
    build_html_data();
  }
});

// get data and create the html
function build_html_data() {
  games_container.innerHTML = "";
  const pagination_entries = document.querySelector(".g_entries p");

  var data = [];
  try {
    // if data sorted by Last 2 weaks
    if (state.searchValue && !state.sortLast2weak) {
      data = pagination(state.searchValue, state.page, state.rows);
      for (let i = data.trimStart; i < state.searchValue.length; i++) {
        state.searchValue[i].rank = i + 1;
      }
      // if data sorted by Last 2 weaks
    } else if (state.sortLast2weak && !state.searchValue) {
      data = pagination(state.sortLast2weak, state.page, state.rows);
      for (let i = data.trimStart; i < state.sortLast2weak.length; i++) {
        state.sortLast2weak[i].rank = i + 1;
      }
    } else {
      data = pagination(state.gamesData, state.page, state.rows);
      for (let i = data.trimStart; i < state.gamesData.length; i++) {
        state.gamesData[i].rank = i + 1;
      }
    }

    // display pagination stats
    pagination_entries.innerHTML = `<span data-lang="entries_1">Showing</span> ${
      data.trimStart + 1
    } <span data-lang="entries_2">to</span> ${
      data.gamesData[data.gamesData.length - 1].rank
    } <span data-lang="entries_3">of</span> ${state.gamesData.length}`;
  } finally {
    data.gamesData.forEach((value) => {
      let set_icon = `https://cdn.cloudflare.steamstatic.com/steam/apps/${value.appid}/header.jpg`;
      let time_ago = relativeTime(value.rtime_last_played);
      let last_2weeks = (value.playtime_2weeks / 60).toFixed(1);
      if (last_2weeks === "NaN") last_2weeks = "0";
      let time = (value.playtime_forever / 60).toFixed(1);
      let set_values = `<div class="d">
            <div class="d_img_wrapper">
                <p id="rank">${value.rank}</p>
                <img class="d_icon" data-src="${set_icon}">
                <p class="d_link1_p2">${value.name}</p>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td id="store">
                            <a href="https://store.steampowered.com/app/${value.appid}" target="_blank">
                                <p data-lang="games_d_2"> Store</p>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td data-lang="games_d_3">played time</td>
                        <td>
                            <p>${time} <span data-lang="games_d_hrs">hr's</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td data-lang="games_d_4">last 2 weeks</td>
                        <td>
                            <p>${last_2weeks} <span data-lang="games_d_hrs">hr's</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td data-lang="games_d_5">last played</td>
                        <td>
                            <p>${time_ago}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>`;
      games_container.innerHTML += set_values;
    });
    icons_hover();

    // run the lazy loading
    gamesImgLazyLoading();

    // send how many pages
    paginate_buttons(data.pages);
  }
}

async function get_games_data(userInput) {
  try {
    const response = await fetch("./api/steam/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steamid: userInput }),
    });
    const user = await response.json();
    return user;
  } catch (error) {
    console.log(error);
  }
}

// save seached id to server database
async function saveSearchValue(userInput) {
  try {
    const response = await fetch("./getSearchedId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steamid: userInput }),
    });
    const user = await response.json();
    return user;
  } catch (error) {
    console.log(error);
  }
}

const steamid_form = document.querySelector(".steamid_form");
const games_user_el = document.querySelector(".games_user");
const user_id_img = document.querySelector(".user_id_img");
const games_l_title_el = document.querySelector(".games_length_title");

// send id to server and return data with fetch
async function after_submit_id() {
  const id_status_el = document.querySelector(".id_status");
  id_status_el.classList.remove("active");

  const s_h_display_el = document.querySelector(".s_h_display");
  s_h_display_el.classList.remove("active");

  games_user_el.textContent = "";
  games_l_title_el.textContent = "";
  user_id_img.src = "";
  games_length.textContent = "";

  // get user input
  const FD = new FormData(steamid_form);

  // remove spaces from input
  const steamId = Object.fromEntries(FD).steamId.split(" ").join("");

  if (!steamId || steamId === "") return;
  document.querySelector(".loader.s_1").style.display = "inline-block";

  // GET data from server API
  const data = await get_games_data(steamId);

  if (data) {
    document.querySelector(".loader.s_1").style.display = "none";
    steam_id_input.value = "";
    search_clear();
  }

  // check if steamid profile is private or not found
  if (data.success === false && data.error_code === 1) {
    games_l_title_el.style.color = "orange";
    games_l_title_el.textContent =
      localStorage.getItem("language") === "ar"
        ? "لم يتم العثور على حساب الملف الشخصي"
        : data.message;
  } else if (data.success === false && data.error_code === 2) {
    games_l_title_el.style.color = "red";
    games_l_title_el.textContent =
      localStorage.getItem("language") === "ar"
        ? "حساب الملف الشخصي خاص"
        : data.message;
  } else if (data.success === false && data.error_code === 3) {
    games_l_title_el.style.color = "red";
    games_l_title_el.textContent =
      localStorage.getItem("language") === "ar"
        ? "خطأ في إدخال البيانات"
        : data.message;
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else if (data.success === true) {
    games_l_title_el.style.color = "";

    // save id to localStorage
    localStorage.setItem("userSearchId", steamId);

    // set user name
    games_user_el.textContent = data.summary.nickname;

    // set user image and profile link
    const user_id_img_el = document.querySelector(".user_id_img");
    user_id_img_el.src = data.summary.avatar.medium;
    user_id_img_el.parentElement.href = `/user/${data.summary.steamID}`;

    // set games length number
    games_length.textContent = data.game_count;
    games_l_title_el.textContent =
      localStorage.getItem("language") === "ar"
        ? "لعبة تم العثور عليها"
        : "Game found";

    state.gamesData = data.games;
    state.page = 1;

    // sort by most played games
    state.gamesData.sort((a, b) => b.playtime_forever - a.playtime_forever);
    state.sortLast2weak = null;

    // display response data
    build_html_data();

    // save input to user storage history
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", "[]");
    }
    const history = JSON.parse(localStorage.getItem("history"));
    history.push(steamId.toLowerCase());
    localStorage.setItem("history", JSON.stringify(history));

    // calculate total play time
    let totalPlayTime = 0;
    for (let i = 1; i < data.games.length; i++) {
      totalPlayTime += data.games[i].playtime_forever / 60;
    }
    const all_time = document.querySelector(".all_time");
    all_time.innerHTML = `${totalPlayTime.toFixed(
      2
    )} <span data-lang="hours">/ hours</span>`;

    // display save as buttons if there is data
    const save_as_buttons = document.querySelectorAll(".save_as button");
    if (data.game_count > 0) {
      save_as_buttons.forEach((button) => {
        button.classList.remove("active");
      });
    } else {
      save_as_buttons.forEach((button) => {
        button.classList.add("active");
      });
    }

    // save id to database
    saveSearchValue(steamId);

    // set the languages
    setLanguage(localStorage.getItem("language"));
  }
}

steamid_form.addEventListener("submit", (event) => {
  // stop browser from refreshing after form submit
  event.preventDefault();

  after_submit_id();
});

const search_clear_button = document.querySelector(".clear_input");

// clear search box button
function search_clear() {
  if (steam_id_input.value !== "") {
    search_clear_button.classList.add("active");
  } else {
    search_clear_button.classList.remove("active");
  }
}

steam_id_input.addEventListener("input", search_clear);

search_clear_button.addEventListener("click", () => {
  steam_id_input.value = "";
  search_clear_button.classList.remove("active");
});

const relativeTimePeriods_en = [
  [31536000, "year"],
  [2419200, "month"],
  [604800, "week"],
  [86400, "day"],
  [3600, "hour"],
  [60, "minute"],
  [1, "second"],
];
const relativeTimePeriods_ar = [
  [31536000, "سنة"],
  [2419200, "شهر"],
  [604800, "اسبوع"],
  [86400, "يوم"],
  [3600, "ساعة"],
  [60, "دقيقة"],
  [1, "ثانية"],
];

// configure timestemp to relative time
function relativeTime(date, isUtc = true) {
  if (!(date instanceof Date)) date = new Date(date * 1000);
  const seconds = (new Date() - date) / 1000;
  if (localStorage.getItem("language") === "ar") {
    for (let [secondsPer, name] of relativeTimePeriods_ar) {
      if (seconds >= secondsPer) {
        let amount = Math.floor(seconds / secondsPer);
        if (amount === 53) {
          return "لا يوجد";
        } else {
          return `قبل ${amount} ${name}`;
        }
      }
    }
    return "للتـوْ";
  } else {
    for (let [secondsPer, name] of relativeTimePeriods_en) {
      if (seconds >= secondsPer) {
        const amount = Math.floor(seconds / secondsPer);
        if (amount === 53) {
          return "nothing";
        } else {
          return `${amount} ${name}${amount > 1 ? "s" : ""} ago`;
        }
      }
    }
    return "Just now";
  }
}

const clear_button = document.querySelector(".clear_button");

// clear list button
clear_button.addEventListener("click", () => {
  const apps_search = document.querySelector(".apps_search");
  if (!document.querySelector(".skeleton")) {
    games_container.innerHTML =
      '<div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div><div class="d skeleton"></div>';
  }
  // if (steam_id_input.value || games_l_title_el.textContent || state.gamesData.length || apps_search.value) {
  steam_id_input.value = "";
  state.gamesData = [];
  games_user_el.textContent = "";
  games_l_title_el.textContent = "";
  user_id_img.src = "";
  games_length.textContent = "";
  const s_h_display_el = document.querySelector(".s_h_display");
  s_h_display_el.classList.remove("active");
  apps_search.value = "";
  state.searchValue = null;
  state.sortLast2weak = null;
  const pagination_nav = document.querySelector(".pagination");
  pagination_nav.innerHTML = "";
  const pagination_entries = document.querySelector(".g_entries p");
  pagination_entries.innerHTML = "";
  const save_as_buttons = document.querySelectorAll(".save_as button");
  save_as_buttons.forEach((button) => {
    button.classList.add("active");
  });
  const all_time = document.querySelector(".all_time");
  all_time.textContent = "0.00";
  localStorage.removeItem("userSearchId");
});

const games_element = document.querySelector(".games");

// Search for games that match the search criteria
const apps_search = document.querySelector(".apps_search");
apps_search.addEventListener("input", (event) => {
  let input = event.target.value.toLowerCase();
  state.sortLast2weak = null;
  state.page = 1;
  if (input !== "" && state.gamesData.length) {
    const dataFiltered = state.gamesData.filter((v) => {
      return (
        v.name.toLowerCase().includes(input) ||
        JSON.stringify(v.appid).includes(input)
      );
    });
    if (dataFiltered.length > 0) {
      games_element.classList.remove("active");
      state.searchValue = dataFiltered;
      build_html_data();
    } else {
      games_container.innerHTML = "## nothing to search ##";
      games_element.classList.add("active");
    }
  } else {
    games_element.classList.remove("active");
    if (state.gamesData.length) {
      state.searchValue = null;
      build_html_data();
    }
  }
});

// filter games by app
const sort_options = document.querySelector(".apps_filter");
sort_options.addEventListener("change", (e) => {
  if (state.gamesData.length) {
    let value = e.target.value;
    games_element.classList.remove("active");
    apps_search.value = "";
    state.searchValue = null;
    state.page = 1;
    if (value === "1") {
      // sort by most played games
      state.gamesData.sort((a, b) => b.playtime_forever - a.playtime_forever);
      state.sortLast2weak = null;
      build_html_data();
    } else if (value === "2") {
      // sort by last played games
      state.gamesData.sort((a, b) => b.rtime_last_played - a.rtime_last_played);
      state.sortLast2weak = null;
      build_html_data();
    } else if (value === "3") {
      // sort by last 2 weaks played games
      const sortLast2weak = state.gamesData
        .sort((a, b) => {
          return b.playtime_2weeks - a.playtime_2weeks;
        })
        .filter((a) => a.playtime_2weeks != null);
      if (sortLast2weak.length) {
        state.sortLast2weak = sortLast2weak;
        build_html_data();
      } else {
        games_container.innerHTML = "## No played games past two weeks ##";
        games_element.classList.add("active");
      }
    }
  }
});

// GET saved games data from localStorage
function ls_get_gamesData(userId) {
  steam_id_input.value = userId;
  after_submit_id();

  // calculate total play time
  let totalPlayTime = 0;
  for (let i = 1; i < state.gamesData.length; i++) {
    totalPlayTime += state.gamesData[i].playtime_forever / 60;
  }
  const all_time = document.querySelector(".all_time");
  all_time.textContent = `${totalPlayTime.toFixed(2)} / hours`;
}
document.addEventListener("DOMContentLoaded", () => {
  // if (!localStorage.getItem("userSearchId")) return;
  if (!localStorage.getItem("userSearchId"))
    localStorage.setItem("userSearchId", "76561198965877925");
  ls_get_gamesData(localStorage.getItem("userSearchId"));
});

// show user search history
const search_history = document.querySelector(".search_history");
search_history.addEventListener("click", (e) => {
  e.preventDefault();

  const id_status_el = document.querySelector(".id_status");
  id_status_el.classList.toggle("active");

  const s_h_display_el = document.querySelector(".s_h_display");
  s_h_display_el.classList.toggle("active");

  const history = JSON.parse(localStorage.getItem("history"));

  if (!history) {
    if (localStorage.getItem("language") === "ar") {
      s_h_display_el.textContent = "لا يوجد سجل بحث بعد";
    } else {
      s_h_display_el.textContent = "No search history found";
    }
  } else {
    s_h_display_el.innerHTML = "";

    // get last 10 search results from history
    const h = history.slice(Math.max(history.length - 10, 0));
    for (let i = 0; i < h.length; i++) {
      s_h_display_el.innerHTML += `<a class="s_h_link">${h[i]}</a>`;
    }

    // search for user after clicked
    const s_h_link = document.querySelectorAll(".s_h_link");
    s_h_link.forEach((link) => {
      link.addEventListener("click", (e) => {
        steam_id_input.value = e.target.textContent;
        after_submit_id();
      });
    });
  }
});

// save list as CSV, JSON and EXCEL
document.addEventListener("DOMContentLoaded", () => {
  const save_as_buttons = document.querySelectorAll(".save_as button");
  if (state.gamesData.length > 0) {
    save_as_buttons.forEach((button) => {
      button.classList.remove("active");
    });
  } else {
    save_as_buttons.forEach((button) => {
      button.classList.add("active");
    });
  }

  // export data as the file type
  function exportData(file) {
    const filename = `yourdata.${file}`;
    const data = state.gamesData;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Games");
    XLSX.writeFile(wb, filename);
  }

  save_as_buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let value = e.target.value;
      if (value === "excel") {
        exportData("xlsx");
      } else if (value === "csv") {
        exportData("csv");
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
          new Blob([JSON.stringify(state.gamesData, null, 2)], {
            type: "text/plain",
          })
        );
        a.setAttribute("download", "data.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  });
});

async function get_user_friends() {
  const response = await fetch("./friendsList");
  const user = await response.json();
  return user;
}

function usersLazyLoading() {
  const imgs = document.querySelectorAll(".user_list .users_options img");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0,
    }
  );

  imgs.forEach((img) => {
    observer.observe(img);
  });
}

// ================= Friends list saction =================

const user_list = document.querySelector(".user_list");
const user_list_btn = document.querySelector(".user_list_btn");
const friends_search = document.querySelector(".friends_search input");
const users_options = document.querySelector(".users_options");

async function add_user(selectedUser) {
  users_options.innerHTML = "";
  state.friendsList.forEach((user) => {
    let isSelected = user.personaname == selectedUser ? "selected" : "";

    // set profile visibility status
    let visibility =
      user.communityvisibilitystate == "3"
        ? '<p style="color:lightgreen">public</p>'
        : '<p style="color:orangered">private</p>';

    let li = `<li value="${user.steamid}" onclick="updateName(this)" class="${isSelected}"><div class="user_info"><a href="/user/${user.steamid}" title="Profile"><img data-src="${user.avatar}"></a>${user.personaname}</div>${visibility}</li>`;
    users_options.insertAdjacentHTML("beforeend", li);
  });
  usersLazyLoading();
}

function updateName(selected) {
  var scrollTo = document.getElementById("games-grabber");
  scrollTo.scrollIntoView();
  friends_search.value = "";
  let valueId = selected.attributes["value"].value;
  steam_id_input.value = valueId;
  after_submit_id();
  add_user(selected.children[0].textContent);
  user_list.classList.remove("active");
  // user_list_btn.firstElementChild.textContent = selected.children[0].textContent;
}

function startAddingFriends() {
  user_list_btn.addEventListener("click", () =>
    user_list.classList.toggle("active")
  );
  add_user();

  friends_search.addEventListener("keyup", () => {
    let arr = [];
    let searchWord = friends_search.value.toLowerCase();
    arr = state.friendsList
      .filter((data) => {
        return data.personaname.toLowerCase().startsWith(searchWord);
      })
      .map((data) => {
        let isSelected =
          data == user_list_btn.firstElementChild.innerText ? "selected" : "";
        let visibility =
          data.communityvisibilitystate == "3"
            ? '<p style="color:lightgreen">public</p>'
            : '<p style="color:orangered">private</p>';
        return `<li value="${data.steamid}" onclick="updateName(this)" class="${isSelected}"><div class="user_info"><img data-src="${data.avatar}">${data.personaname}</div>${visibility}</li>`;
      })
      .join("");
    users_options.innerHTML = arr
      ? arr
      : `<p style="margin-top: 10px; color: #ccc">Oops! user not found</p>`;
    usersLazyLoading();
  });
}

// ================= Online users search saction =================

const user_list2 = document.querySelectorAll(".user_list")[1];
const user_list_btn2 = document.querySelectorAll(".user_list_btn")[1];
const users_options2 = document.querySelectorAll(".users_options")[1];

function add_user2(selectedUser) {
  users_options2.innerHTML = "";
  state.searchUsers.forEach((user) => {
    let isSelected = user.steamID == selectedUser ? "selected" : "";

    // convert time to time ago
    let time = new Date(user.searchedAt).getTime();
    let searchTime = relativeTime(new Date(time));

    let li = `<li value="${user.steamID}" onclick="updateName2(this)" class="${isSelected}"><p>${user.steamID}</p><p>${searchTime}</p></li>`;
    users_options2.insertAdjacentHTML("beforeend", li);
  });
}

function updateName2(selected) {
  var scrollTo = document.getElementById("games-grabber");
  scrollTo.scrollIntoView();
  let valueId = selected.attributes["value"].value;
  steam_id_input.value = valueId;
  after_submit_id();
  add_user2(selected.attributes["value"].value);
  user_list2.classList.remove("active");
  // user_list_btn2.firstElementChild.textContent = selected.textContent;
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await get_user_friends();
  if (!data) return;

  state.friendsList = await data.players;
  startAddingFriends();
});

document.addEventListener("DOMContentLoaded", async () => {
  const data = await saveSearchValue();
  if (!data) return;

  state.searchUsers = data;

  user_list_btn2.addEventListener("click", () =>
    user_list2.classList.toggle("active")
  );
  add_user2();
});
