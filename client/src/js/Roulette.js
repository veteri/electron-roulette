const RouletteElement = require("./RouletteElement");

class Roulette {
    constructor(wrapperSelector) {
        this.roundDelay = 5000;
        this.sequence = [
            0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
            11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31,
            9, 22, 18, 29, 7, 28, 12, 35, 3, 26
        ];

        this.preElementCount = 20;
        this.postElementCount = 5;

        this.wrapper = document.querySelector(wrapperSelector);
    }

    isEven(number) {
        return number % 2 === 0;
    }

    calculateColor(index) {
        return index == 0 ? "green" :
            this.isEven(index) ? "black"
                : "red"

    }

    predetermineWinner() {
        const winner = Math.random() * 36;
        return {
            winnerIndex: Math.floor(winner),
            exact: winner
        };
    }

    buildCarousel(winner) {
        const elements = this.buildElements(winner);


        elements.forEach(element => {
            this.wrapper.appendChild(element.getHTMLElement());
        });

        return this.wrapper;

    }

    buildElements(winner) {
        const elements = [];
        let i = 1;
        let index = winner;
        /* First build pre elements */
        while (i <= this.preElementCount) {
            if (--index < 0) {
                index = this.sequence.length - 1;
            }

            elements.push(
                new RouletteElement(
                    this.sequence[index],
                    this.calculateColor(index)
                )
            );

            i++;
        }

        elements.reverse();

        elements.push(
            new RouletteElement(
                this.sequence[winner],
                this.calculateColor(winner)
            )
        );

        i = 1
        while (i <= this.postElementCount) {
            let index = (winner + i) % this.sequence.length;

            elements.push(
                new RouletteElement(
                    this.sequence[index],
                    this.calculateColor(index)
                )
            );

            i++;

        }

        return elements;
    }

    calculateWinningOffset(preElements, exact) {
        const eWidth = RouletteElement.width;
        return preElements * eWidth
            + (eWidth * (exact % 1)) - 400;
    }


    async spin(result) {
        console.log("Spin...");
        while (this.wrapper.lastElementChild) {
            this.wrapper.removeChild(
                this.wrapper.lastElementChild
            );
        }


        this.wrapper.classList.remove("transition");
        this.wrapper.style.left = `-50px`;
        await new Promise(r => setTimeout(r, 100));
        this.wrapper.classList.add("transition");

        this.preElementCount = Math.floor(Math.random() * 50) + 80;
        this.postElementCount = Math.floor(Math.random() * 20) + 10;

        const { exact, winnerIndex } = result || this.predetermineWinner();

        this.buildCarousel(winnerIndex);
        console.log("Build carousel...");
        this.wrapper.style.left = `-50px`;
        const offset = this.calculateWinningOffset(
            this.preElementCount,
            exact
        );

        setTimeout(() => {
            this.wrapper.style.left = `-${offset}px`;
            //console.log(this.wrapper.style.left);
            console.log('Winner: ' + this.sequence[winnerIndex]);
        }, 10);




    }


}

module.exports = Roulette;
