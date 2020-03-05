const EventEmitter = require("events");

class BetManager extends EventEmitter {
    constructor() {
        super();
        this.elements = {
            placeRed: document.querySelector(".bets .place-bet.red"),
            placeGreen: document.querySelector(".bets .place-bet.green"),
            placeBlack: document.querySelector(".bets .place-bet.black"),

            redBetsEntries: document.querySelector(".bets .column.red .bet-entries"),
            greenBetsEntries: document.querySelector(".bets .column.green .bet-entries"),
            blackBetsEntries: document.querySelector(".bets .column.black .bet-entries"),
            
            redBetsCount: document.querySelector(".bets .column.red .bet-amount .value"),
            greenBetsCount: document.querySelector(".bets .column.green .bet-amount .value"),
            blackBetsCount: document.querySelector(".bets .column.black .bet-amount .value"),

            redBetsSum: document.querySelector(".bets .column.red .bet-sum .value"),
            greenBetsSum: document.querySelector(".bets .column.green .bet-sum .value"),
            blackBetsSum: document.querySelector(".bets .column.black .bet-sum .value"),

            placeBetPrompt: document.querySelector(".bets .place-bet-prompt"),
            placeBetValue: document.querySelector(".bets .place-bet-prompt .value"),
            confirmPlace: document.querySelector(".bets .place-bet-prompt .confirm-place"),

        };

        this.bindEvents();
    }

    incrementBetCount(color) {
        const counterElement = this.elements[`${color}BetsCount`];
        counterElement.innerHTML = Number(counterElement.innerHTML) + 1;
    }

    addToBetSum(color, amount) {
        const sumElement = this.elements[`${color}BetsSum`];
        sumElement.innerHTML = Number(sumElement.innerHTML) + amount;
    }

    addUserBetEntry(color, name, amount) {
        const html = `
            <div class="bet-entry">
                <span class="bet-username">${name}</span>
                <span class="bet-coins">${amount}</span>
            </div>`;

        const entryElement = this.elements[`${color}BetsEntries`];
        entryElement.innerHTML += html;
    }

    addBetToStat(color, name, amount) {
        this.incrementBetCount(color);
        this.addToBetSum(color, amount);
        this.addUserBetEntry(color, name, amount);
    }

    resetAllBetStats() {
        this.elements.redBetsEntries.innerHTML = "";
        this.elements.greenBetsEntries.innerHTML = "";
        this.elements.blackBetsEntries.innerHTML = "";

        this.elements.redBetsCount.innerHTML = 0;
        this.elements.greenBetsCount.innerHTML = 0;
        this.elements.blackBetsCount.innerHTML = 0;

        this.elements.redBetsSum.innerHTML = 0;
        this.elements.greenBetsSum.innerHTML = 0;
        this.elements.blackBetsSum.innerHTML = 0;
    }

    enableBetPlacement() {
        this.elements.placeRed.disabled = false;
        this.elements.placeGreen.disabled = false;
        this.elements.placeBlack.disabled = false;
    }

    disableBetPlacement() {
        this.elements.placeRed.disabled = true;
        this.elements.placeGreen.disabled = true;
        this.elements.placeBlack.disabled = true;
        this.hidePrompt();
    }

    clearPromptValue() {
        this.elements.placeBetValue.value = "";
    }

    setPromptShadow(type) {
        this.elements.placeBetPrompt.classList.add(type);
    }

    clearPromptShadow() {
        ["red", "green", "black"]
            .forEach(color => {
                this.elements.placeBetPrompt.classList.remove(color);
            });
    }

    removePreviousEvent() {
        this.elements.confirmPlace.removeEventListener("click", this.handler);
    }

    showPrompt() {
        this.elements.placeBetPrompt.classList.remove("hidden");
    }

    hidePrompt() {
        this.elements.placeBetPrompt.classList.add("hidden");
    }

    focusPrompt() {
        this.elements.placeBetValue.focus();
    }

    bindEvents() {
        [
            {element: this.elements.placeRed, color: "red"},
            {element: this.elements.placeGreen, color: "green"},
            {element: this.elements.placeBlack, color: "black"}
        ]
        .forEach(({element, color}) => {
            element.addEventListener("click", () => {
                this.removePreviousEvent();
                this.clearPromptShadow();
                this.clearPromptValue();

                this.setPromptShadow(color);
                this.showPrompt();
                this.focusPrompt();

                this.handler = () => {
                    const value = this.elements.placeBetValue.value;
                    const isNumber = /^\d+$/.test(value);
                    
                    if (value === "") {
                        return this.hidePrompt();
                    }

                    if (!isNumber || value < 0) {
                        alert("You can only place whole positive coin values as bets.");
                        return false;
                    }

                    //this.disableBetPlacement();
                    this.elements.confirmPlace.removeEventListener("click", this.handler);
                    console.log("Emitting place-" + color + " from handler()");
                    this.emit(`place-${color}`, Number(value));
                    this.emit(`place-bet`);
                    this.hidePrompt();
                    
                };

                this.elements.confirmPlace.addEventListener("click", this.handler);
            })
        });

        this.elements.placeBetValue.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                console.log("Pressed enter in place bet.");
                this.handler();
            }
        });
            
    }
}

module.exports = BetManager;