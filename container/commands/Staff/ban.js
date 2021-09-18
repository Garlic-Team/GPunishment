const { MessageEmbed } = require("discord.js");
const { Command } = require("gcommands");
const { ArgumentType } = require("gcommands/src");
const settings = require("../../../config/defaults.json")

module.exports = class Ban extends Command {
  constructor(...args) {
    super(...args, {
        name: "ban",
        description: "Ban the selected member.",
        guildOnly: settings.bot.server,
        context: false,
        category: "Staff",
        userRequiredRoles: settings.other.banerRole,
        args: [{
          name: "member",
          description: "Which member will you ban?",
          type: ArgumentType.USER,
          required: true
        }, {
          name: "reason",
          description: "Why would you ban this member?",
          type: ArgumentType.STRING,
          required: true
        }]
    })
  }

  async run({client, interaction, member, message, guild, channel, respond, edit, args}) {
        let target = guild.members.cache.get(args[0])
        if (!target) return respond({ content: "The member you are trying to punish is **not currently** on the server.", ephemeral: true })

        if (member.user.id === target.user.id) return respond({
          content: "You cannot punish **yourself**.",
          ephemeral: true
        })

        if (member.roles.highest.position <= target.roles.highest.position) return respond({
          content: "You cannot punish because the person you are trying to punish has **same** or **high** authority as yours.",
          ephemeral: true
        })

        if (settings.bot.authors.some(x => x == target.user.id)) return respond({
          content: `No power can make me ban one of **my owners**.`
        })
        
        if (target.bannable == false) return respond({
          content: `It is **not possible** to ban the person you are trying to ban.`,
          ephemeral: true
        })

        con.query(`SELECT * FROM TotalPenalties WHERE member_id = '${args[0]}'`, async (err, rows) => {
          if (err) throw err; 
          if (rows.length < 1) {
            con.query(`INSERT INTO TotalPenalties (member_id, ban, total_points) VALUES ('${args[0]}', 1, 200`)
          } else {
            con.query(`UPDATE TotalPenalties SET ban = ${rows[0].ban} + 1 WHERE member_id = '${args[0]}'`)
            con.query(`UPDATE TotalPenalties SET total_points = ${rows[0].total_points} + 200 WHERE member_id = '${args[0]}'`)
          }
        })

        con.query(`INSERT INTO Penalties (member_id, punishment_type, punishment_reason, end_of_punishment, staff_id, is_ended, extras) VALUES ('${args[0]}', 'BAN', '${(args[1])}', '${Date.now()}', '${member.user.id}', 1, 'No extra information.')`)
        target.ban({ reason: args[1] })

        let embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
        .setDescription(`**${target.user.tag}** member was **banned** by **${member.user.tag}** for \`${args[1]}\` reason.`)
        .setColor("DARK_RED")
        .setImage("https://media.giphy.com/media/Ch1zCx8tu6DQY/giphy.gif?cid=ecf05e47mvh4zy387p2i1p7354ip7f1txoskxfy5b20xynl6&rid=giphy.gif&ct=g")

        let log_embed = new MessageEmbed()
        .setAuthor(target.user.tag, target.user.avatarURL({ dynamic: true }))
        .setColor("RED")
        .setDescription(`**${target.user.tag}** member was **banned** by **${member.user.tag}** for \`${args[1]}\` reason.
        
✸ **Banned:** ${target.user.tag} (\`${target.user.id}\`)
✸ **Staff:** ${member.user.tag} (\`${member.user.id}\`)
✸ **Reason:** ${args[1]}
        `)

        let logChannel = client.channels.cache.get(settings.other.penaltyLogChannel)

        respond({ embeds: embed })
        logChannel.send({ embeds: log_embed })
  }
};