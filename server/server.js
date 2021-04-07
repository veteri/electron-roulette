const express = require("express");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const User = require("./models/User");


const io = require("socket.io")();
const RouletteManager = require("./RouletteManager");
const rouletteManager = new RouletteManager(io);

const clients = [];


const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(loginRoute);
app.use(registerRoute);

app.get("/bankpepe", async (req, res) => {
    res.render('bank', {
        users: rouletteManager.getUsers()
    });
});

app.listen(28001);


io.on("connection", (socket) => {
    socket.on("login", async (username) => {
        console.log(`[DEBUG] Got login event from ${username}.`);
        const user = await User.findByName(username);
        if (user) {
            console.log(user);
            rouletteManager.once("spin-over", () => {
                console.log(`[DEBUG] Emitting set-initial-user-data for ${user.name}`);
                socket.emit("set-initial-user-data", {
                    name: user.name,
                    coins: user.coins
                });
            });

            user.socket = socket;
            rouletteManager.addUser(user);
            
        } else {
            console.log(`[ERROR] ${username} sent login event, but wasnt found in DB!`);
        }
    });

    socket.on("client-closed-app", () => {
        rouletteManager.removeUser(socket.id);
        socket.removeAllListeners();
        console.log(`[DEBUG] Removed user from rouletteManager and removed all socket listeners.`);
    });

    socket.on("grant-money", async (id) => {

    });
});

io.listen(28000);
