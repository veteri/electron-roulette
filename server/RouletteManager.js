const {getWinner} = require("./utils/helpers");
const EventEmitter = require("events");

class RouletteManager extends EventEmitter {
    constructor(io) {
        super();
        this.io = io;
        this.ROULETTE_SPIN_INTERVAL = 30000;
        this.ROULETTE_SPIN_OVER_DELAY = 8500;

        this.users = [];
        this.bets = {
            red: [],
            green: [],
            black: [],
        };

        this.nextSpinTimeOffset = this.ROULETTE_SPIN_INTERVAL - this.ROULETTE_SPIN_OVER_DELAY;

        setInterval(() => {
            const winner = getWinner();
            const exactPercent = parseInt((winner.exact % 1) * 100);
        
            console.log(`[DEBUG] Broadcasting: 'spin' (winner: ${winner.winnerIndex} -> ${exactPercent}%)`);
        
            this.io.emit("spin", winner);
            // broadcast("spin", winner);
        
            setTimeout(() => {
                //console.log(`[DEBUG] Spin finished! Next spin -> timeStamp: ${this.nextSpinTimeOffset}, time: ${nextDate.getHours()}:${nextDate.getMinutes()}:${nextDate.getSeconds()}`);

                this.io.emit("spin-over", this.nextSpinTimeOffset);
                this.emit("spin-over");
                this.updateAllUserCoins(winner);
                this.clearAllBets();

            }, this.ROULETTE_SPIN_OVER_DELAY);
        
        
        }, this.ROULETTE_SPIN_INTERVAL);
    }

    isEven(number) {
        return number % 2 === 0;
    }

    calculateColor(index) {
        return index == 0 ? "green" :
            this.isEven(index) ? "black"
                : "red"

    }

    getWinType(color, amount) {
        const types = {
            red: "normalwin",
            green: "jackpot",
            black: "normalwin"
        };

        let winType = types[color];

        if (color !== "green" && amount >= 10000) {
            winType = "bigwin";
        }

        return winType;
    }

    getWinAmount(amount, color) {
        const scalings = {
            "red": 2,
            "green": 36,
            "black": 2,
        };

        return amount * scalings[color];
    }

    clearAllBets() {
        this.bets = {
            red: [],
            green: [],
            black: [],
        };
    }

    getBetsForUser(user) {
        const bets = [];
        ["red", "green", "black"]
            .forEach(color => {
                this.bets[color].forEach(bet => {
                    if (bet.user.name === user.name) {
                        bets.push({
                            amount: bet.amount,
                            color
                        });
                    }
                });
            });

        return bets;
    }

    updateAllUserCoins(winObj) {

        console.log(`[DEBUG] Updating all user coins!`)
        
        if (this.users.length === 0) {
            console.log(`[DEBUG] No online users... Nothing to update.`);
        }

        const winningColor = this.calculateColor(winObj.winnerIndex);

        /* Calculate win/lose for each user */
        this.users.forEach(async (user) => {

            const userBets = this.getBetsForUser(user);
            let winType;
            let currentCoins = await user.getCoins();
            let coinsWon = 0;
            console.log(`[DEBUG] ${user.name} made ${userBets.length} bets.`);

            for (const bet of userBets) {
                if (winningColor === bet.color) {
                    /* On win, the bet is scaled by the color scaling */
                    const winAmount = this.getWinAmount(bet.amount, bet.color);
                    console.log(`[DEBUG] (${user.name}) winAmount: ${winAmount}, currentCoins: ${currentCoins}, sum: ${winAmount + currentCoins}`);
                    currentCoins += winAmount;
                    coinsWon += winAmount;
                    await user.saveCoins(currentCoins);
                    
                    winType = this.getWinType(bet.color, bet.amount);
                } 
            }

            if (coinsWon > 0) {
                console.log(winType);
                user.socket.emit("win", winType, coinsWon);
                console.log(`[DEBUG] ${user.name} won ${coinsWon} coins!`);
            } else if (coinsWon === 0 && userBets.length > 0) {
                console.log(`[DEBUG] ${user.name} lost all bets!`);
                user.socket.emit("lose");
            }

        });

    }

    addUser(user) {
        this.bindUserSocketEvents(user);
        this.users.push(user);
        console.log(`[DEBUG] Registered ${user.name} to rouletteManager instance.`);
    }

    removeUser(socketId) {
        this.users = this.users.filter(user => user.socket.id !== socketId);
        console.log(`[DEBUG] New users: `);
        console.log(this.users);
    }

    bindUserSocketEvents(user) {
        ["red", "green", "black"]
            .forEach(color => {
                console.log(`[DEBUG] Bound place-${color} on ${user.name}!`);

                user.socket.on(`place-${color}`, async amount => {

                    const coins = await user.getCoins();
                    console.log(`[DEBUG] Verifying bet for ${user.name}; Invest: ${amount}, Funds: ${coins}`);
                    
                    /* Check if the user has that much coins */
                    if (amount > coins) {
                        console.log(`[DEBUG] No funds: ${user.name} tried placing ${amount} coins on ${color}, total coins: ${coins}`);
                        user.socket.emit("insufficient-funds");
                        return;
                    }

                    /* Instantly save in DB so when user make new bets,
                       it knows if user has enough funds */
                    await user.saveCoins(coins - amount);

                    console.log(`[DEBUG] ${user.name} places ${amount} coins on ${color}, total coins: ${coins}`);

                    /* Save the user bet */
                    this.bets[color].push({
                        amount,
                        user
                    });

                    /* Notify user so that topBar funds display correct amount of coins left */
                    user.socket.emit("place-bet-accepted", amount);

                    /* Notify everyone else of the bet */
                    this.io.emit("other-bet-place", color, user.name, amount);
                });
            });
    }
}

module.exports = RouletteManager;