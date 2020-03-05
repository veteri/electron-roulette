const countUp = require("countup.js").CountUp;
const Coin = require("./Coin");
const Sound = require("./Sound");
const EventEmitter = require("events");

class Win extends EventEmitter {
    constructor() {
        super();
        this.sound = new Sound();

        this.coinDelayId = null;
        this.coinUpdateId = null;
        this.coinSpawnId = null;
        this.clearId = null;
        this.countUpId = null;

        this.previousType = null;
    }

    buildWinLabel(type) {
        return {
            bigwin: "BIG WIN!",
            normalwin: "WIN!",
            jackpot: "JACKPOT!!!"
        }[type];
    }

    startBankWiggle() {
        document.querySelector(".bank").classList.add("wiggle");
    }


    stopBankWiggle() {
        document.querySelector(".bank").classList.remove("wiggle");
    }

    removeOldWin() {
        const win = document.querySelector(".win");
        if (win) {
            clearTimeout(this.coinDelayId);
            clearInterval(this.coinUpdateId);
            clearInterval(this.coinSpawnId);
            clearTimeout(this.countUpId);
            clearTimeout(this.clearId);

            document.body.removeChild(win);

            this.sound.stopSound(this.previousType);
        }
    }

    /**
     * Show win dialogue, make coin animation
     * and count up the won coins.
     * @param type {string} One of "jackpot", "normalwin", "bigwin"
     */
    showWin(type, amount) {
        const container = document.createElement("div");

        container.innerHTML = `
            <img class="clover left" src="../assets/cloverangle.png" alt="">
            <img class="clover right" src="../assets/cloverangle.png" alt="">
            <img class="pig" src="../assets/pig.png" alt="">
            <img class="bunny" src="../assets/bunny.png" alt="">
            <img class="bank" src="../assets/money.png" alt="">

            <div class="label">${this.buildWinLabel(type)}</div>
            <div class="amount" id="amount"></div>
            <button class="confirm">Add to funds</button>
        `;
        container.classList.add("win");
        container.classList.add(type);

        /* Bind close event to confirm button */
        container
            .querySelector(".confirm")
            .addEventListener("click", () => {
                this.emit("add-to-funds");
                this.removeOldWin();
            })

        /* Remove old win display, if there is one */
        this.removeOldWin();

        /* Save this type for next win */
        this.previousType = type;

        /* Show win dialogue */
        document.body.appendChild(container);
        /* Play the win sound */
        this.sound.playSound(type);

        let coins = [];
        const config = this.getWinConfig(type);
        /* Wait until coins should start falling */
        this.coinDelayId = setTimeout(() => {

            /* Update each coin every 10ms */
            this.coinUpdateId = setInterval(() => {
                coins.forEach(coin => coin.update());
                coins = coins.filter(coin => !coin.isDead);
            }, 10);

            /* Spawn n new coins every m ms (depending on win) */
            this.coinSpawnId = setInterval(() => {
                coins = coins.concat(Array.from({length: config.coinSpawn}, (e, i) => new Coin(container)));
            }, 250);

            this.startBankWiggle();

            this.countUpId = setTimeout(() => {
                const count = new countUp("amount", amount, {duration: config.coinDuration / 1000});

                if (!count.error) {
                    count.start();
                } else {
                    alert(count.error);
                }

            }, 250);


            /* Stop after n ms */
            this.clearId = setTimeout(() => {
                console.log("Stop spawning coins.");
                /* Stop spawning coins */
                clearInterval(this.coinSpawnId);


                this.stopBankWiggle();

                /* But let all other coins fall out of view */
                setTimeout(() => {
                    console.log("Stop updating");
                    clearInterval(this.coinUpdateId);
                }, 5000);

                /*setTimeout(() => {
                    document.body.removeChild(container);
                }, 2000);*/

            }, config.coinDuration);

        }, config.coinDelay);

    }

    getWinConfig(type) {
        return {
            normalwin: {
                coinSpawn: 4,
                coinDuration: 4000,
                coinDelay: 1000,
            },

            bigwin: {
                coinSpawn: 5,
                coinDuration: 3000,
                coinDelay: 2000,
            },

            jackpot: {
                coinSpawn: 7,
                coinDuration: 11800,
                coinDelay: 0,
            }

        }[type];
    }
}

module.exports = Win;
