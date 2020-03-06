// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const Roulette = require("../js/Roulette");
const Win = require("../js/Win.js");
const TopBar = require("../js/TopBar");
const CountDown = require("../js/CountDown");
const BetManager = require("../js/BetManager");

const {ipcRenderer} = require("electron");

const roulette = new Roulette(".element-wrapper");
const win = new Win();
const topBar = new TopBar();
const countDown = new CountDown();
const betManager = new BetManager();

const username = localStorage.getItem("username");

/* Place bet on red */
betManager.on("place-red", amount => {
    console.log("client bets " + amount + " on red!");
    ipcRenderer.send("place-red", amount);
});

/* Place bet on green */
betManager.on("place-green", amount => {
    console.log("client bets " + amount + " on green!");
    ipcRenderer.send("place-green", amount);
});

/* Place bet on black */
betManager.on("place-black", amount => {
    console.log("client bets " + amount + " on black!");
    ipcRenderer.send("place-black", amount);
});

betManager.on("place-bet", () => {
    win.sound.playSound("placebet");
});

/* Window finished loading */
ipcRenderer.on("set-initial-user-data", (e, user) => {
    console.log("setting funds");
    topBar.setFunds(user.coins);
    win.sound.playSound("welcome");
});

/* We won a bet */
ipcRenderer.on("win", (e, type, amount) => {
    console.log(`Got win from main process, type: ${type}, amount: ${amount}`);
    win.showWin(type, amount);
    win.once("add-to-funds", () => {
        topBar.addFunds(amount);
        win.sound.playSound("addToFunds");
    });
});

/* We lost a bet */
ipcRenderer.on("lose", (e) => {
    console.log(`Got lose from main process`);
});

ipcRenderer.on("insufficient-funds", (e) => {
    alert("You dont have enough funds for this bet.");
});

ipcRenderer.on("place-bet-accepted", (e, amount) => {
    console.log(`Our bet was accepted, updating funds... ${amount}`);
    topBar.subtractFunds(amount);
});

ipcRenderer.on("other-bet-place", (e, color, name, amount) => {
    betManager.addBetToStat(color, name, amount);
});

/* Server roulette spin */
ipcRenderer.on("spin", (e, result) => {
    console.log("Got spin from main process");

    /* Play next round sound */
    win.sound.playSound("newround");
    /* Hide the countdown timer */
    countDown.hide();
    /* Dont allow any new bets */
    betManager.disableBetPlacement();
    /* Spin the roulette ! */
    roulette.spin(result);
});

/* Spin animation finished (hardcoded) */
ipcRenderer.on("spin-over", (e, nextSpinTimeStamp) => {
    console.log("Got spin over from main process");

    const waitOverlay = document.querySelector(".wait");
    if (!waitOverlay.classList.contains("hidden")) {
        document.querySelector(".wait").classList.add("hidden");
        document.querySelector(".roulette").classList.remove("hidden");
        document.querySelector(".top-bar").classList.remove("hidden");
        document.querySelector(".bets").classList.remove("hidden");
    }

    countDown
        .setTimeStamp(nextSpinTimeStamp)
        .start()
        .show();

    betManager.resetAllBetStats();
    betManager.enableBetPlacement();
});




