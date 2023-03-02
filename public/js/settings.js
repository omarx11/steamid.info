const form = document.querySelector('form');

// detect language value and change element directions
if (localStorage.getItem("language") === "ar") {
    document.querySelector('footer').dir = "rtl";
} else {
    document.querySelector('footer').dir = "ltr";
}

// don't submit form if no file chosen
form.addEventListener('submit', (event) => {
    if (event.target[0].files.length != 1) {
        event.preventDefault();
    }
});

// store user games data
const infos = {
    gameData: []
}

// grab games data by user id
async function get_games_data(userId) {
    try {
        const response = await fetch('./api/steam/games', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ steamid: userId })
        });
        const user = await response.json();
        return user;
    } catch (error) {
        console.log(error);
    }
}

async function saveSelectedPrimaryGame(gameId, gameName, gameImg) {
    try {
        const response = await fetch('../savePrimaryGame', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: gameId,
                gameName: gameName,
                gameImg: gameImg
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function saveSelectedSecondaryGame(gameId, gameName, gameImg) {
    try {
        const response = await fetch('../saveSecondaryGame', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: gameId,
                gameName: gameName,
                gameImg: gameImg
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

/* ============ User games dropdown 1 ============ */

const game_list = document.querySelector('.user_games_list');
const game_list_btn = document.querySelector('.game_list_btn');
const games_search = document.querySelector('.games_search input');
const games_options = document.querySelector('.games_options');

function add_game(selectedGame) {
    games_options.innerHTML = '';
    infos.gameData.forEach(game => {
        let isSelected = game == selectedGame ? "selected" : "";
        let li = `<li value="${game.appid}" onclick="updateGame(this)" class="${isSelected}">${game.name}</li>`;
        games_options.insertAdjacentHTML('beforeend', li);
    });
}

async function updateGame(selected) {
    games_search.value = '';

    // save selected game to database
    let selectedGameId = selected.attributes['value'].value;
    let selectedGameName = selected.textContent;
    let selectedGameImg = `https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedGameId}/library_600x900.jpg`;
    const save = await saveSelectedPrimaryGame(selectedGameId, selectedGameName, selectedGameImg);

    // if server returns true then data successfully updated
    if (save === true) window.location.reload();

    game_list.classList.remove('active');
    game_list_btn.firstElementChild.textContent = selected.textContent;
}

function startAddingGame1() {
    game_list_btn.addEventListener('click', () => game_list.classList.toggle('active'));
    add_game();

    games_search.addEventListener('keyup', () => {
        let arr = [];
        let searchWord = games_search.value.toLowerCase();
        arr = infos.gameData.filter(data => {
            return data.name.toLowerCase().startsWith(searchWord);
        }).map(data => {
            let isSelected = data == game_list_btn.firstElementChild.innerText ? "selected" : "";
            return `<li value="${data.appid}" onclick="updateGame(this)" class="${isSelected}">${data.name}</li>`;
        }).join('');
        games_options.innerHTML = arr ? arr : `<p style="margin-top: 10px; color: #ccc; text-align: left">Oops! game not found</p>`;
    });
}

/* ============ User games dropdown 2 ============ */

const game_list2 = document.querySelectorAll('.user_games_list')[1];
const game_list_btn2 = document.querySelectorAll('.game_list_btn')[1];
const games_search2 = document.querySelectorAll('.games_search input')[1];
const games_options2 = document.querySelectorAll('.games_options')[1];

function add_game2(selectedGame) {
    games_options2.innerHTML = '';
    infos.gameData.forEach(game => {
        let isSelected = game == selectedGame ? "selected" : "";
        let li = `<li value="${game.appid}" onclick="updateGame2(this)" class="${isSelected}">${game.name}</li>`;
        games_options2.insertAdjacentHTML('beforeend', li);
    });
}

async function updateGame2(selected) {
    games_search2.value = '';

    // save selected game to database
    let selectedGameId = selected.attributes['value'].value;
    let selectedGameName = selected.textContent;
    let selectedGameImg = `https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedGameId}/library_600x900.jpg`;
    const save = await saveSelectedSecondaryGame(selectedGameId, selectedGameName, selectedGameImg);

    // if server returns true then data successfully updated
    if (save === true) window.location.reload();

    game_list2.classList.remove('active');
    game_list_btn2.firstElementChild.textContent = selected.textContent;
}

function startAddingGame2() {
    game_list_btn2.addEventListener('click', () => game_list2.classList.toggle('active'));
    add_game2();

    games_search2.addEventListener('keyup', () => {
        let arr = [];
        let searchWord = games_search2.value.toLowerCase();
        arr = infos.gameData.filter(data => {
            return data.name.toLowerCase().startsWith(searchWord);
        }).map(data => {
            let isSelected = data == game_list_btn2.firstElementChild.innerText ? "selected" : "";
            return `<li value="${data.appid}" onclick="updateGame2(this)" class="${isSelected}">${data.name}</li>`;
        }).join('');
        games_options2.innerHTML = arr ? arr : `<p style="margin-top: 10px; color: #ccc; text-align: left">Oops! game not found</p>`;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const userId = document.querySelector('.user_id');

    const data = await get_games_data(userId.attributes['value'].value);
    if (!data) return;

    infos.gameData = await data.games;
    startAddingGame1();
    startAddingGame2();
});