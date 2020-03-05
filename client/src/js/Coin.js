class Coin {
    constructor(container) {
        this.img = document.createElement("img");
        this.img.src = `../assets/coin.png`;
        this.img.classList.add("coin");
        this.img.style.animationDuration = `${Math.random() * 800 + 800}ms`;

        this.x = 20;
        this.vx = Math.random() * 2 + 2;
        this.arcFn = this.buildArcFn();
        this.direction = Math.random() > 0.5 ? "-" : "+";

        this.container = container;

        this.container.appendChild(this.img);
    }

    buildArcFn() {
        const coefficient = -(Math.random() * 0.01 + 0.0007);
        return x => coefficient * x * x;
    }

    isVisibleOnPage() {
        const rect = this.img.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        // Only completely visible elements return true:
        const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        // Partially visible elements return true:
        //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    }

    update() {
        this.x += this.vx;
        this.y = this.arcFn(this.x);

        if (!this.isVisibleOnPage()) {
            this.container.removeChild(this.img);
            this.dead = true;
        }

        this.img.style.top = `calc(-20px - ${this.y}px)`;
        this.img.style.left = `calc(50% ${this.direction} ${this.x}px)`;
    }
}

module.exports = Coin;
