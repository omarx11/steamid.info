const light_mode = document.querySelector(".light_mode");
const light_mode_svg = document.querySelector(".light_mode img");

// detect language value and change element directions
if (localStorage.getItem("language") === "ar") {
    document.querySelector('.header').dir = "rtl";
    document.querySelector('.steam_players').dir = "rtl";
    document.querySelector('.list_title').dir = "rtl";
    document.querySelector('footer').dir = "rtl";
} else {
    document.querySelector('.header').dir = "ltr";
    document.querySelector('.steam_players').dir = "ltr";
    document.querySelector('.list_title').dir = "ltr";
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

async function getSteamUsers() {
    const response = await fetch('./api/steam/getSteamUsers');
    const data = await response.json();
    return data;
}

async function getTopGames() {
    const response = await fetch('./api/steam/getTopGames');
    const data = await response.json();
    return data;
}

async function getRecords() {
    const response = await fetch('./api/steam/getRecords');
    const data = await response.json();
    return data;
}

function addClickEvent() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            let URL = `https://store.steampowered.com/app/${e.target.attributes['value'].value}/`;
            window.open(URL, "_blank");
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await getSteamUsers();

    const online_el = document.querySelector('.online_num');
    online_el.innerHTML = data.onlineUsers;

    const playing_el = document.querySelector('.playing_num');
    playing_el.innerHTML = data.playingNow;
});

document.addEventListener('DOMContentLoaded', async () => {
    const data = await getTopGames();

    const games_output_el = document.querySelector('.games_list');
    games_output_el.innerHTML = '';

    function setTopGamesToHTML(data) {
        let count = 1;
        data.forEach(Object => {
            let html = `<div class="card" value="${Object.id}">
            <div class="card_left">
                <div class="rank">${count}</div>
                <div class="icon"><img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${Object.id}/header.jpg"></div>
                <div class="name">${Object.name}</div>
            </div>
            <div class="card_right">
                <div class="players">${Object.current}</div>
                <div class="players_peak">${Object.peak}</div>
            </div>
        </div>`;
            games_output_el.innerHTML += html;
            count += 1;
        });
    }
    setTopGamesToHTML(data);
    addClickEvent();

    // dropdown select menu
    const dropdown = document.querySelector(".title_dropdown select");
    dropdown.addEventListener("change", async (e) => {
        games_output_el.innerHTML = '<span class="loader"></span>';
        let value = e.target.value;
        
        const title1 = document.querySelector('.list_title .title_left p:first-child');
        const title2 = document.querySelector('.list_title .title_left p:last-child');

        const table_title2 = document.querySelector('.games_title .title_right p:nth-child(1)');
        const table_title3 = document.querySelector('.games_title .title_right p:last-child');

        if (value === "most") {
            title1.innerHTML = 'MOST PLAYED<img src="../icons/trending-up.svg">';
            title2.textContent = 'Top played games by player count';
            title1.setAttribute('data-lang', 'most_played');
            title2.setAttribute('data-lang', 'most_p_desc');

            table_title2.textContent = 'PLAYING NOW';
            table_title3.textContent = 'PEAK TODAY';
            table_title2.setAttribute('data-lang', 'g_t_playing_1');
            table_title3.setAttribute('data-lang', 'g_t_peak_1');

            const data = await getTopGames();
            games_output_el.innerHTML = '';
            setTopGamesToHTML(data);
            addClickEvent();
        } else {
            title1.textContent = 'RECORDS 🔥';
            title2.textContent = 'Highest player counts to be reached';
            title1.setAttribute('data-lang', 'records');
            title2.setAttribute('data-lang', 'records_desc');

            table_title2.textContent = 'PEAK PLAYERS';
            table_title3.textContent = 'DATA REACHED';
            table_title2.setAttribute('data-lang', 'g_t_playing_2');
            table_title3.setAttribute('data-lang', 'g_t_peak_2');
            
            const data = await getRecords();
            games_output_el.innerHTML = '';

            let count = 1;
            data.forEach(Object => {
                let html = `<div class="card" value="${Object.id}">
                <div class="card_left">
                    <div class="rank">${count}</div>
                    <div class="icon"><img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${Object.id}/header.jpg"></div>
                    <div class="name">${Object.data[0]}</div>
                </div>
                <div class="card_right">
                    <div class="players">${Object.data[1]}</div>
                    <div class="players_peak">${Object.data[2]}</div>
                </div>
            </div>`;
                games_output_el.innerHTML += html;
                count += 1;
            });
            addClickEvent();
        }
        setLanguage(localStorage.getItem('language'));
    });
});