const { Event } = require("gcommands")
const settings = require("../../config/defaults.json")

module.exports = class Ping extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageCreate",
            once: false,
            ws: false
        })
    }

    async run(client, message) {
        console.log(`${message.author.tag} -> ${message.content}`)
    }
};