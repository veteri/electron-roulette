class Sound {
    constructor() {
        this.audioElements = {
            effects: {
                bigwin: document.querySelector(".bigwin"),
                normalwin: document.querySelector(".normalwin"),
                jackpot: document.querySelector(".jackpot"),
                placebet: document.querySelector(".placebet"),
                newround: document.querySelector(".newround"),
                welcome: document.querySelector(".welcome"),
                addToFunds: document.querySelector(".add-to-funds")
                
            },
            music: {
                bg: document.querySelector(".bg")
            }
        };

        this.isEffectsMuted = false;
        this.isMusicMuted = false;
    }

    isEffectsMuted() {
        return this.isEffectsMuted;
    }

    muteEffects() {
        Object.keys(this.audioElements.effects)
            .forEach(key => {
                this.audioElements.effects[key].volume = 0;
            });

        this.isEffectsMuted = true;
    }

    unmuteEffects() {
        Object.keys(this.audioElements.effects)
            .forEach(key => {
                this.audioElements.effects[key].volume = 1;
            });

        this.isEffectsMuted = false;
    }

    muteMusic() {
        Object.keys(this.audioElements.music)
            .forEach(key => {
                this.audioElements.music[key].volume = 0;
            });

        this.isMusicMuted = true;
    }

    unmuteMusic() {
        Object.keys(this.audioElements.music)
            .forEach(key => {
                this.audioElements.music[key].volume = 1;
            });

        this.isMusicMuted = false;
    }


    getType(key) {
        return key in this.audioElements.effects ? "effects" : "music";
    }

    playSound(key) {
        const type = this.getType(key);
        this.audioElements[type][key].play();
    }

    fadeMusic() {
        let vol = 0;
        this.audioElements.music.bg.volume = vol;
        this.audioElements.music.bg.currentTime = Math.floor(Math.random() * 1200);
        this.audioElements.music.bg.play();

        const fadeout = setInterval(() => {
            if (vol < 0.8) {
                vol += 0.001;
                this.audioElements.music.bg.volume = vol;
            }
            else {
                clearInterval(fadeout);
            }
        }, 20);
    }

    stopSound(key) {
        const type = this.getType(key);
        const sound = this.audioElements[type][key];
        sound.pause();
        sound.currentTime = 0;
    }
}

module.exports = Sound;
