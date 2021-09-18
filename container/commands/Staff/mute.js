const { Command, ArgumentType } = require("gcommands")
const { MessageEmbed } = require("discord.js")
const settings = require("../../../config/defaults.json");
const ms = require("ms")
const { mutePunishReasonConverter, mutePunishEpochConverter, generalPunishPointConverter } = require("../../functions");

module.exports = class Mute extends Command {
  constructor(...args) {
    super(...args, {
        name: "mute",
        description: "Penalize any member in text channels.",
        userRequiredRoles: settings.other.muterRole,
        category: "Staff",
        guildOnly: settings.bot.server,
        slash: "slash",
        context: false,
        args: [{
          name: "member",
          description: "Select the member you will punish.",
          type: ArgumentType.USER,
          required: true
        }, {
          name: "type",
          description: "Why are you punishing this member?",
          type: ArgumentType.STRING,
          required: true,
          choices: [{
            name: "Swearing or insulting. (15 mins.)",
            value: "0001"
          }, {
            name: "Religious, national or family swear/insult. (1 hour.)",
            value: "0002"
          }, {
            name: "Disturbing people. (10 mins.)",
            value: "0003"
          }, {
            name: "Flood, spam, or exaggerated capitalization. (5 mins.)",
            value: "0004"
          }, {
            name: "Misuse of channels. (10 mins.)",
            value: "0005"
          }, {
            name: "Other. (15 mins.)",
            value: "0006"
          }]
        }, {
          name: "evidence",
          description: "What is your proof?",
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

        let check = await con.promise().query(`SELECT * FROM Penalties WHERE member_id = '${args[0]}' AND punishment_type = 'TEMP-MUTE' AND is_ended = 0`)
        if (check[0].length >= 1) return respond({
          content: "The person you are trying to punish is already under the influence of the **mute penalty**.",
          ephemeral: true
        })

        let epoch_flake = Date.now() + ms(mutePunishEpochConverter(args[1], "mini"))
        con.query(`INSERT INTO Penalties (member_id, punishment_type, punishment_reason, end_of_punishment, staff_id, extras) VALUES ('${args[0]}', 'TEMP-MUTE', '${mutePunishReasonConverter(args[1])}', '${epoch_flake}', '${member.user.id}', '${args[2]}')`)
        target.roles.add(settings.other.muteRole, `Muted! (By ${member.user.tag} staff.)`)

        con.query(`SELECT * FROM TotalPenalties WHERE member_id = '${args[0]}'`, async (err, rows) => {
          if (err) throw err; 
          if (rows.length < 1) {
            con.query(`INSERT INTO TotalPenalties (member_id, temp_mute, total_points) VALUES ('${args[0]}', 1, ${generalPunishPointConverter(args[1])})`)
          } else {
            con.query(`UPDATE TotalPenalties SET temp_mute = ${rows[0].temp_mute} + 1 WHERE member_id = '${args[0]}'`)
            con.query(`UPDATE TotalPenalties SET total_points = ${rows[0].total_points} + ${generalPunishPointConverter(args[1])} WHERE member_id = '${args[0]}'`)
          }
        })

        let punishment_number = await con.promise().query(`SELECT * FROM Penalties`)
        let logChannel = client.channels.cache.get(settings.other.penaltyLogChannel)

        let embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL({dynamic: true}))
        .setDescription(`**${target.user.tag}** member was **muted** by **${member.user.tag}** due to \`${mutePunishReasonConverter(args[1])}\` (\`#${punishment_number[0].length}\`)`)
        .setColor("GREYPLE")
  
        let log_embed = new MessageEmbed()
        .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true}))
        .setColor("DARK_AQUA")
        .setDescription(`**${target.user.tag}** member was **muted** by **${member.user.tag}** due to \`${mutePunishReasonConverter(args[1])}\`
        
✸ **Muted:** ${target.user.tag} (\`${target.user.id}\`)
✸ **Staff:** ${member.user.tag} (\`${member.user.id}\`)
✸ **Reason:** ${mutePunishReasonConverter(args[1])}

✸ **Extras:** \`${args[2]}\` 

*This penalty will expire after <t:${Math.floor(epoch_flake / 1000)}> (<t:${Math.floor(epoch_flake / 1000)}:R>).*
        `)

        respond({ embeds: embed })
        logChannel.send({ embeds: log_embed })
  }
};