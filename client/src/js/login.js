const dotenv = require("dotenv");
dotenv.config();

const IS_DEV = process.env.IS_DEV === "true";
const {ipcRenderer} = require("electron");
console.log(`IS_DEV: ${IS_DEV}`);

const login = {
    PATHS: {
       login: "/login",
       register: "/register",
    },

    DOM: {
        loginContainer: document.querySelector(".login"),
        loginName: document.querySelector(".login .username"),
        loginPassword: document.querySelector(".password"),
        loginBtn: document.querySelector(".loginBtn"),
        loginErrors: document.querySelector(".login .errors"),

        registerContainer: document.querySelector(".register"),
        switchRegister: document.querySelector(".switchRegister"),
        switchLogin: document.querySelector(".switchLogin"),
        registerName: document.querySelector(".register .username"),
        registerPassword: document.querySelector(".register .password"),
        registerBtn: document.querySelector(".registerBtn"),
        registerErrors: document.querySelector(".register .errors"),
    },

    async login() {
        const username = this.DOM.loginName.value;
        const password = this.DOM.loginPassword.value;

        if (!username || !password)
            return;

        this.DOM.loginErrors.innerHTML = "";

        const response = await fetch(this.PATHS.login, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                password
            })
        });

        console.log(`sent login with u:${username} p: ${password}`);

        const responseData = await response.json();

        if (responseData.success) {
            ipcRenderer.send("login-success", true, username);
            localStorage.setItem("username", username);
            //ipcRenderer tell main process to switch page
        } else {
            this.DOM.loginErrors.innerHTML += `
                <div class="error">${responseData.reason}</div>
            `;
        }
    },

    async register() {
        const username = this.DOM.registerName.value;
        const password = this.DOM.registerPassword.value;

        if (!username || !password)
            return;

        this.DOM.registerErrors.innerHTML = "";

        const response = await fetch(this.PATHS.register, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                password
            })
        });

        console.log(`sent register with u:${username} p: ${password}`);

        const responseData = await response.json();

        if (responseData.success) {
            alert("Success. You can login now.");
            this.switchTo("login");
        } else {
            this.DOM.registerErrors.innerHTML += `
                <div class="error">${responseData.reason}</div>
            `;
        }
    },

    switchTo(tab) {
        if (tab === "login") {
            this.DOM.loginContainer.classList.remove("hidden");
            this.DOM.registerContainer.classList.add("hidden");
        } else {
            this.DOM.loginContainer.classList.add("hidden");
            this.DOM.registerContainer.classList.remove("hidden");
        }
    },

    bindEvents() {
        this.DOM.loginBtn.addEventListener("click", () => this.login());
        this.DOM.registerBtn.addEventListener("click", () => this.register());
        this.DOM.switchRegister.addEventListener("click", () => this.switchTo("register"));
        this.DOM.switchLogin.addEventListener("click", () => this.switchTo("login"));
        console.log(`Bound click events`);
    },

    init() {
        const PATH_PREFIX = IS_DEV ? "http://192.168.0.131:28001"
            : "http://sandbox.icu";

        this.PATHS.login = `${PATH_PREFIX}${this.PATHS.login}`;
        this.PATHS.register = `${PATH_PREFIX}${this.PATHS.register}`;
        this.bindEvents();

        console.log("Init done");
    }
};

login.init();
