const { Event } = require("gcommands")
const settings = require("../../config/defaults.json")

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: false,
        })
    }
    async run(client) {
        await client.user.setPresence({ activities: [{ name: settings.bot.status, status: "dnd" }] });
    }
};
