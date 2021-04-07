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
                cashNormal: document.querySelector(".cash-normal-win"),
                cashBig: document.querySelector(".cash-big-win"),
                cashJackpot: document.querySelector(".cash-jackpot")
            },
            music: {
                bg: document.querySelector(".bg"),
                ambient: document.querySelector(".bgambient")
            }
        };

        this.isEffectsMuted = false;
        this.isMusicMuted = false;
        this.isAmbientMuted = false;
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
        this.audioElements.music.bg.volume = 0;
        this.isMusicMuted = true;
    }

    unmuteMusic() {
        this.audioElements.music.bg.volume = 0.8;
        this.isMusicMuted = false;
    }

    muteAmbient() {
        this.audioElements.music.ambient.volume = 0;
        this.isAmbientMuted = true;
    }

    unmuteAmbient() {
        this.audioElements.music.ambient.volume = 1;
        this.isAmbientMuted = false;
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
        this.audioElements.music.ambient.volume = vol;

        this.audioElements.music.bg.currentTime = Math.floor(Math.random() * 1200);
        this.audioElements.music.ambient.currentTime = Math.floor(Math.random() * 1200);

        this.audioElements.music.bg.play();
        this.audioElements.music.ambient.play();

        const fadeout = setInterval(() => {

            if (vol < 0.4) {
                this.audioElements.music.ambient.volume = vol;
            }

            if (vol < 0.8) {
                vol += 0.001;
                this.audioElements.music.bg.volume = vol;
                
            }
            else {
                clearInterval(fadeout);
            }
        }, 20);


        this.audioElements.music.bg.addEventListener('ended',() => {
            this.audioElements.music.bg.currentTime = Math.floor(Math.random() * 1200);
            this.audioElements.music.bg.play();
        }, false);

        this.audioElements.music.ambient.addEventListener('ended',() => {
            this.audioElements.music.ambient.currentTime = Math.floor(Math.random() * 1200);
            this.audioElements.music.ambient.play();
        }, false);
    }

    stopSound(key) {
        const type = this.getType(key);
        const sound = this.audioElements[type][key];
        sound.pause();
        sound.currentTime = 0;
    }
}

module.exports = Sound;
