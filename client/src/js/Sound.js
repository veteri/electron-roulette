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
                addToFunds: document.querySelector(".add-to-funds"),
            },
            music: {

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


    getType(key) {
        return key in this.audioElements.effects ? "effects" : "music";
    }

    playSound(key) {
        const type = this.getType(key);
        this.audioElements[type][key].play();
    }

    stopSound(key) {
        const type = this.getType(key);
        const sound = this.audioElements[type][key];
        sound.pause();
        sound.currentTime = 0;
    }
}

module.exports = Sound;
