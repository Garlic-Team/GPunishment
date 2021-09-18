const { Command } = require("gcommands")
const settings = require("../../config/defaults.json")

module.exports = class Ping extends Command {
  constructor(...args) {
    super(...args, {
        name: "",
        description: "",
        guildOnly: settings.bot.server
    })
  }

  async run({client, interaction, member, message, guild, channel, respond, edit, args}) {
        respond("pog");
  }
};