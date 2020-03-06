// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, ipcMain} = require('electron')
const path = require('path')
const io = require("socket.io-client");
const {isDev} = require("./src/js/env");
console.log(`isDev: ${isDev}`);

let socket = io.connect(isDev ? "http://192.168.0.131:28000" : "http://sandbox.icu", {transports: ["websocket"]});
let rouletteWindow, loginWindow;

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 400,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: "#0f0e11",
        show: true
    });

    loginWindow.setMenu(null);
    loginWindow.loadFile("./src/html/login.html");
    loginWindow.setResizable(false);
    loginWindow.webContents.openDevTools();
}

function createRouletteWindow(username) {

    // Create the browser window.
    rouletteWindow = new BrowserWindow({
        useContentSize: true,
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: "#0f0e11",
        show: true,
        icon: path.join(__dirname, "/src/assets/app_icon.ico")
    });

    rouletteWindow.setMenu(null);
    rouletteWindow.loadFile('./src/html/index.html');
    rouletteWindow.webContents.on("did-finish-load", e => {

        socket.on("set-initial-user-data", (user) => {
            console.log("Got set-intial-user-data from Server");
            rouletteWindow.webContents.send("set-initial-user-data", user);
        })

        socket.on("connect", () => {
            console.log("Connected to bankend.");
        });

        socket.on("disconnect", () => {
            console.log("Lost connection.");
        });


        socket.on("spin", async result => {
            console.log("Got spin from server.");
            console.log(result);
            try {
                if (rouletteWindow.isVisible()) {
                    await rouletteWindow.webContents.send("spin", result);
                }
                
            } catch (e) {
                console.log(e);
            }
        });

        socket.on("spin-over", async (nextSpinTimeOffset) => {
            console.log("got Spin is over! from server, nextSpinOffset: ", nextSpinTimeOffset);

            try {
                if (rouletteWindow.isVisible()) {
                    await rouletteWindow.webContents.send("spin-over", nextSpinTimeOffset);
                }
            } catch (e) {
                console.log(e);
            }
        });

        socket.on("win", async (type, amount) => {
            console.log(`win: ${type}, amount: ${amount}`);
            try {
                await rouletteWindow.webContents.send("win", type, amount);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on("lose", async (amount) => {
            console.log(`lost`);
            try {
                await rouletteWindow.webContents.send("lose", amount);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on("insufficient-funds", async () => {
            try {
                await rouletteWindow.webContents.send("insufficient-funds");
            } catch (e) {
                console.log(e);
            } 
        });

        socket.on("place-bet-accepted", async (amount) => {
            try {
                await rouletteWindow.webContents.send("place-bet-accepted", amount);
            } catch (e) {
                console.log(e);
            } 
        });

        socket.on("other-bet-place", async (color, name, amount) => {
            try {
                await rouletteWindow.webContents.send("other-bet-place", color, name, amount);
            } catch (e) {
                console.log(e);
            } 
        });

        socket.emit("login", username);

        console.log("mainWindow did-finish-load executed");
    });

    // Open the DevTools.
    rouletteWindow.webContents.openDevTools()

}

ipcMain.once("login-success", (e, success, username) => {
    if (success) {
        createRouletteWindow(username);
        loginWindow.close();
    }
});

ipcMain.on("place-red", (e, amount) => {
    socket.emit("place-red", amount);
});

ipcMain.on("place-green", (e, amount) => {
    socket.emit("place-green", amount);
});

ipcMain.on("place-black", (e, amount) => {
    socket.emit("place-black", amount);
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createLoginWindow();
});

app.on("will-quit", (event) => {
    event.preventDefault();
    socket.emit("client-closed-app");
    socket.removeAllListeners();
    console.log("before quit, removing socket listeners");
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    console.log("window all closed, Removing all socket listeners");
    socket.removeAllListeners();
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
