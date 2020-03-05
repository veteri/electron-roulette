class RouletteElement {
    constructor(number, color) {
        this.number = number;
        this.color = color;
        this.element = this.createElement(number, color);
    }

    createElement(number, color) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div class="roulette-element ${color}">
                <span class="number">${number}</span>
            </div>
        `;
        return wrapper;
    }

    getHTMLElement() {
        return this.element;
    }

}

RouletteElement.width = 100;

module.exports = RouletteElement;
