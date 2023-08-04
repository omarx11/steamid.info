const light_mode = document.querySelector(".light_mode");
const light_mode_svg = document.querySelector(".light_mode img");

// detect language value and change element directions
if (localStorage.getItem("language") === "ar") {
  document.querySelector("footer").dir = "rtl";
} else {
  document.querySelector("footer").dir = "ltr";
}

// switch light/dark button
light_mode.addEventListener("click", () => {
  document.documentElement.style.overflow = "hidden";
  document.body.clientWidth;
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    light_mode_svg.src = "../icons/brightness-down.svg";
    light_mode.setAttribute("value", "dark");
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.body.classList.add("light");
    light_mode_svg.src = "../icons/moon-stars.svg";
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
    light_mode_svg.src = "../icons/brightness-down.svg";
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.body.classList.add("light");
    light_mode_svg.src = "../icons/moon-stars.svg";
    document.documentElement.setAttribute("data-color-scheme", "light");
  }
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
        const amount = Math.floor(seconds / secondsPer);
        return `قبل ${amount} ${name}`;
      }
    }
    return "للتـوْ";
  } else {
    for (let [secondsPer, name] of relativeTimePeriods_en) {
      if (seconds >= secondsPer) {
        const amount = Math.floor(seconds / secondsPer);
        return `${amount} ${name}${amount > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  }
}

async function get_user_status() {
  var user_url = window.location.pathname;
  var user_id = user_url.substring(user_url.lastIndexOf("/") + 1);
  const response = await fetch("../userStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ steamid: user_id }),
  });
  const user = await response.json();
  return user;
}

const loader = document.querySelector(".loader");

document.addEventListener("DOMContentLoaded", async () => {
  const response = await get_user_status();
  const data = response.summary;
  const badges = response.badges;
  loader.style.display = "none";

  // set user description info
  const user_desc_el = document.querySelector(".u_description");
  user_desc_el.textContent = data.realName;

  // set user profile creation date
  var fullDate;
  const user_created = new Date(data.created * 1000);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (localStorage.getItem("language") === "ar") {
    fullDate = user_created.toLocaleString("ar-GB", dateOptions);
  } else {
    fullDate = user_created.toLocaleString("en-GB", dateOptions);
  }
  const user_date_el = document.querySelector(".u_created");
  user_date_el.textContent = fullDate;

  // set user steamID
  const user_steamid_el = document.querySelector(".u_steamid");
  user_steamid_el.textContent = data.steamID;

  // set user profile visibility
  const user_vis_el = document.querySelector(".u_visibility");
  if (data.visibilityState == "3") {
    user_vis_el.textContent = "Public";
  } else if (data.visibilityState == "2") {
    user_vis_el.textContent = "FriendsOnly";
  } else {
    user_vis_el.textContent = "Private";
  }

  // set user last logOff
  const user_lastLogOff_el = document.querySelector(".u_lastLogOff");
  if (data.lastLogOff) {
    let lastlog = relativeTime(data.lastLogOff);
    user_lastLogOff_el.textContent = lastlog;
  } else {
    user_lastLogOff_el.textContent = "unknown";
  }

  // set user online/offline state
  const user_state_el = document.querySelector(".u_state");
  const userState = data.personaState === 0 ? "Offline" : "Online";
  const userStateColor = data.personaState === 0 ? "red" : "green";
  user_state_el.textContent = userState;
  user_state_el.style.color = userStateColor;

  // set user profile level
  const user_level_el = document.querySelector(".u_level");
  if (badges.playerLevel) {
    user_level_el.textContent = badges.playerLevel;
  } else {
    user_level_el.textContent = badges;
  }

  // set user profile flag
  const user_flag_el = document.querySelector(".u_flag");
  if (data.countryCode) {
    let u_flag = data.countryCode.toLowerCase();
    user_flag_el.innerHTML = `${data.countryCode} <img src="../country-flags/${u_flag}.svg">`;
  } else {
    user_flag_el.textContent = "unknown";
  }

  // set user steam profile link
  const user_s_p_el = document.querySelector(".u_s_profile");
  user_s_p_el.href = data.url;
});

const share_button = document.querySelector(".u_share");

// function for web share api
function webShareAPI(header, description, link) {
  navigator.share({
    title: header,
    text: description,
    url: link,
  });
}

if (navigator.share) {
  // Show button if it supports webShareAPI
  share_button.style.display = "block";
  share_button.addEventListener("click", () => {
    var user_url = window.location.pathname;
    var user_id = user_url.substring(user_url.lastIndexOf("/") + 1);
    webShareAPI("share your profile", "description", user_id);
  });
} else {
  // Hide button if it supports webShareAPI
  share_button.style.display = "none";
  console.error("Your Browser doesn't support Web Share API");
}
