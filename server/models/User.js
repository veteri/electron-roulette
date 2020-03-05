const db = require("../utils/database");

class User {
    constructor(name, pwHash, coins) {
        this.name = name;
        this.pwHash = pwHash;
        this.coins = coins;
    }

    async save() {
        const [result, _] = await db.execute(`
            INSERT INTO 
                roulette.users (name, pw_hash, coins) 
            VALUES    (   ?,       ?,     ?)
        `,
            [this.name, this.pwHash, this.coins]
        );

        if (!result.insertId) {
            throw new Error(`Couldnt save user ${this.name}`);
        }
    }

    async getCoins() {
        const [result, _] = await db.execute(`
            SELECT coins from roulette.users WHERE name = ?
        `, [this.name]);

        return Number(result[0].coins);
    }

    async saveCoins(coins) {
        const [result, _] = await db.execute(`
            UPDATE roulette.users SET coins = ? WHERE name = ?
        `, [coins, this.name]);

        if (result.affectedRows !== 1) {
            throw new Error(`IMPORTANT!!!: Couldnt save coins for user ${this.name}.`);
        }
    }

    static async isUsernameFree(name) {
        const [result, _] = await db.execute(`
            SELECT * from roulette.users WHERE name = ?    
        `,
            [name]);

        return result.length === 0;
    }

    static isValidName(name) {
        return 3 <= name.length && name.length < 20;
    }

    static async findByName(name) {
        const [result, _] = await db.execute(`
            SELECT * FROM roulette.users WHERE name = ?
        `, [name]);

        if (result.length === 0)
            return null;

        const {id, name: username, pw_hash: pwHash, coins} = result[0];
        return new User(username, pwHash, coins);
    }
}

module.exports = User;
