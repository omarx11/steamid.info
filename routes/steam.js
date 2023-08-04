const router = require("express").Router();
// const puppeteer = require('puppeteer');
require("dotenv").config();

const SteamUsers = require("../models/SteamUsers");
const SteamTop = require("../models/SteamTop");

router.get("/api/steam/getSteamUsers", async (req, res) => {
  const steamDB = await SteamUsers.findOne();
  res.json(steamDB);
});

router.get("/api/steam/getTopGames", async (req, res) => {
  const steamDB = await SteamTop.findOne();
  res.json(steamDB.topGames);
});

router.get("/api/steam/getRecords", async (req, res) => {
  const steamDB = await SteamTop.findOne();
  res.json(steamDB.records);
});

// scrapping steam online users numbers and save it to database
// async function onlineUsers() {
//     console.log('onlineUsers')
//     try {
//         // for localhost testing
//         // const browser = await puppeteer.launch()
//         // uncomment this after upload to server
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox'],
//             executablePath: '/usr/bin/chromium-browser'
//         })
//         const page = await browser.newPage()
//         await page.goto('https://store.steampowered.com/about/')

//         let playerCount = await page.$eval('.online_stats', (el) => el.innerText);
//         await browser.close()

//         // save to database
//         const steamDB = await SteamUsers.findOne()
//         if (steamDB == null) {
//             await SteamUsers.create({
//                 onlineUsers: playerCount?.split('\n')[1],
//                 playingNow: playerCount?.split('\n')[3]
//             })
//         } else {
//             steamDB.onlineUsers = playerCount?.split('\n')[1];
//             steamDB.playingNow = playerCount?.split('\n')[3];
//             await steamDB.save()
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }

// // scrapping the Top Games and save to database
// async function topGames() {
//     console.log('topGames')
//     try {
//         // const browser = await puppeteer.launch()
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox'],
//             executablePath: '/usr/bin/chromium-browser'
//         })
//         const page = await browser.newPage()
//         await page.goto('https://steamcharts.com/')

//         const gameIds = await page.$$eval('#top-games > tbody > tr > td.game-name.left > a', el => el.map((td) => { return td.getAttribute("href").split("/")[2] }))
//         const gameNames = await page.$$eval('#top-games > tbody > tr > td.game-name.left > a', el => el.map((td) => { return td.innerText }))
//         const currentPlayers = await page.$$eval('#top-games > tbody > tr > td:nth-child(3)', el => el.map((td) => { return td.innerText }))
//         const peakPlayers = await page.$$eval('#top-games > tbody > tr > td.num.period-col.peak-concurrent', el => el.map((td) => { return td.innerText }))

//         let gameData = []

//         for (let i in gameIds) {
//             let game = {
//                 name: gameNames[i],
//                 id: gameIds[i],
//                 current: currentPlayers[i],
//                 peak: peakPlayers[i]
//             }
//             gameData.push(game)
//         }
//         await browser.close()

//         // save to database
//         const steamDB = await SteamTop.findOne()
//         if (steamDB == null) {
//             await SteamTop.create({ topGames: gameData })
//         } else {
//             steamDB.topGames = gameData;
//             await steamDB.save()
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }

// // scrapping the games Records and save to database
// async function records() {
//     console.log('records')
//     try {
//         // const browser = await puppeteer.launch()
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox'],
//             executablePath: '/usr/bin/chromium-browser'
//         })
//         const page = await browser.newPage()
//         await page.goto('https://steamcharts.com/')

//         const game = await page.$$eval("#toppeaks > tbody > tr", e => e.map((td) => { return td.innerText.split("\t") }))
//         const appids = await page.$$eval("#toppeaks > tbody > tr> td.game-name.left > a", e => e.map((td) => { return td.getAttribute("href").replace(/\D/g,''); }))

//         let records = []

//         for (let i in appids) {
//             let record = {id: appids[i], data: game[i]}
//             records.push(record)
//         }
//         await browser.close()

//         // save to database
//         const steamDB = await SteamTop.findOne()
//         if (steamDB == null) {
//             await SteamTop.create({ records: records })
//         } else {
//             steamDB.records = records;
//             await steamDB.save()
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }

// saving records to the database
// run one time when server starts
// setTimeout(() => onlineUsers(), 1000 * 15);
// setTimeout(() => topGames(), 1000 * 60 * 1);
// setTimeout(() => records(), 1000 * 60 * 2);

// // run every 1 hour
// setInterval(() => onlineUsers(), 1000 * 60 * 60);
// setInterval(() => topGames(), 1000 * 60 * 61);
// setInterval(() => records(), 1000 * 60 * 62);

module.exports = router;
