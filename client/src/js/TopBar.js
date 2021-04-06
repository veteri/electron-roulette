const countUp = require("countup.js").CountUp;
const Sound = require("./Sound");

class TopBar {
    constructor() {
        this.funds = document.querySelector(".funds .value");
        this.muteEffects = document.querySelector(".mute .muteEffects");
        this.muteMusic = document.querySelector(".mute .muteMusic");

        this.count = new countUp("fundvalue", 0);
        this.sound = new Sound();

        this.bindEvents();
    }

    setFunds(value) {
        this.countUp(value, 2);
    }

    addFunds(value) {
        const old = Number(this.funds.textContent.replace(/,/g, ""));
        console.log(old);
        this.count.update(old + value, 4);
    }

    subtractFunds(value) {
        const old = Number(this.funds.textContent.replace(/,/g, ""));
        console.log(old);
        this.count.update(old - value, 4);
    }

    countUp(value, speed) {
        this.count.update(value, speed);
    }

    bindEvents() {
        this.muteEffects
            .addEventListener("click", () => {
                if (this.sound.isEffectsMuted) {
                    this.sound.unmuteEffects();
                    this.muteEffects.classList.remove("muted");
                } else {
                    this.sound.muteEffects();
                    this.muteEffects.classList.add("muted");
                }

            });

        this.muteMusic
            .addEventListener("click", () => {
                if (this.sound.isMusicMuted) {
                    this.muteMusic.classList.remove("muted");
                    this.sound.unmuteMusic();
                } else {
                    this.sound.muteMusic();
                    this.muteMusic.classList.add("muted");
                }
            });
    }



}

module.exports = TopBar;
