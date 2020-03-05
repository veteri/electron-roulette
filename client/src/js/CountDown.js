class CountDown {
    constructor() {
        this.elements = {
            timer: document.querySelector(".countdown .timer"),
            progressBar: document.querySelector(".countdown .progress-bar"),
            seconds: document.querySelector(".countdown .timer .seconds"),
            miliseconds: document.querySelector(".countdown .timer .miliseconds")
        };

        this.timeStamp = 0;

        this.rafId = null;
        this.startTime = 0;
        this.delta = 0;

        this.lastTimeClass = "";
    }

    setTimeStamp(timeStamp) {
        this.timeStamp = timeStamp;
        return this;
    }

    tick() {
        /* Enqueue next tick instantly */
        this.rafId = requestAnimationFrame(() => this.tick());

        const now = Date.now();
        const delta = this.timeStamp - now;

        if (delta <= 0) {
            console.log("Stopping timer...");
            this.stop(0);
        }

        this.updateProgressBar(now)
        this.buildCounter(delta);
    }

    show() {
        this.elements.timer.classList.remove("hidden");
        this.elements.progressBar.classList.remove("hidden");
        return this;
    }

    hide() {
        this.elements.timer.classList.add("hidden");
        this.elements.progressBar.classList.add("hidden");
        
        this.removeAllTimeClasses();
        
        return this;
    }

    start() {
        this.startTime = Date.now();
        this.elements.progressBar.classList.add("t1");
        requestAnimationFrame(() => this.tick());
        return this;
    }

    stop(endTime) {
        cancelAnimationFrame(this.rafId);
        this.buildCounter(endTime);
        return this;
    }

    getTimeClass(percentage) {
        if (0 <= percentage && percentage < 50)
            return "t1";
        
        if (50 <= percentage && percentage <= 80)
            return "t2";

        if (81 <= percentage && percentage <= 100)
            return "t3";
    }

    removeAllTimeClasses() {
        ["t1", "t2", "t3"]
            .forEach(_class => {
                this.elements.progressBar.classList.remove(_class);
            });
    }

    updateProgressBar(now) {
        const percentage = ((now - this.startTime) / (this.timeStamp - this.startTime)) * 100;
        const timeClass = this.getTimeClass(percentage);

        if (timeClass !== this.lastTimeClass) {
            this.elements.progressBar.classList.add(timeClass);
            this.lastTimeClass = timeClass;
        }
        
        this.elements.progressBar.style.left = `${-percentage}%`;
    }

    buildCounter(time) {
        const seconds = parseInt(time / 1000, 10);

        //Truncate ms to 2 places with % 10
        const miliseconds = parseInt((time % 1000) / 10);
        
        this.elements.seconds.innerHTML = (seconds < 10 ? "0" : "") + seconds;
        this.elements.miliseconds.innerHTML = (miliseconds < 10 ? "0" : "") + miliseconds;
    }
}

module.exports = CountDown;