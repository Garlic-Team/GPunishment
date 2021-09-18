const { Command, ArgumentType } = require("gcommands");
const { MessageEmbed } = require("discord.js")
const settings = require("../../../config/defaults.json");
const { punishmentPointConverter, punishmentIsEndedConverter } = require("../../functions");
const dayjs = require("dayjs")

module.exports = class Penalties extends Command {
  constructor(...args) {
    super(...args, {
        name: "penalty",
        description: "Manage penalties for members.",
        userRequiredRoles: settings.other.penaltierRole,
        context: false,
        category: "Staff",
        guildOnly: settings.bot.server,
        args: [{
          name: "check",
          description: "List the members ongoing penalties.",
          type: ArgumentType.SUB_COMMAND,
          options: [{
            name: "member",
            description: "Which member will you choose?",
            type: ArgumentType.USER,
            required: true
          }]
        }, {
          name: "remove",
          description: "Remove member penalties.",
          type: ArgumentType.SUB_COMMAND,
          options: [{
            name: "member",
            description: "Which member will you choose?",
            type: ArgumentType.USER,
            required: true
          }, {
            name: "type",
            description: "What penalty do you want to remove?",
            type: ArgumentType.STRING,
            required: true,
            choices: [{
              name: "MUTE",
              value: "MUTE"
            }, {
              name: "VMUTE",
              value: "VMUTE"
            }]
          }, {
            name: "reason",
            description: "For what reason will you remove the member's penalty?",
            type: ArgumentType.STRING,
            required: true
          }]
        }, {
          name: "registry",
          description: "List any penalties the member has received in the past.",
          type: ArgumentType.SUB_COMMAND,
          options: [{
            name: "member",
            description: "Which member will you choose?",
            type: ArgumentType.USER,
            required: true
          }]
        }, {
          name: "lookup",
          description: "Query by number.",
          type: ArgumentType.SUB_COMMAND,
          options: [{
            name: "registry_number",
            description: "Type a registry number.",
            type: ArgumentType.INTEGER,
            required: true
          }]
        }]
    })
  }

  async run({client, interaction, member, message, guild, channel, respond, edit, args}) {
    let target = guild.members.cache.get(args[1])

    if (args[0] === "check") {
      if (!target) return respond({ content: "The member you are trying to punish is **not currently** on the server.", ephemeral: true })
      let data = await con.promise().query(`SELECT * FROM Penalties WHERE member_id = '${target.user.id}' AND is_ended = 0`)
      let counts = await con.promise().query(`SELECT * FROM TotalPenalties WHERE member_id = '${target.user.id}'`)
      if (data[0].length < 1 || counts[0].length < 1) return respond({
        content: "This member does not currently have an ongoing penalty."
      })

      let mapped = data[0].map((value) => `[\`${value.punishment_type}\`] ${value.punishment_reason} (**<t:${Math.floor(value.end_of_punishment / 1000)}:R>**)`)

      let info_embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL({dynamic: true}))
      .setColor("BLURPLE")
      .setDescription(`**${target.user.tag}** member was punished ${counts[0][0].temp_mute + counts[0][0].temp_vmute + counts[0][0].ban} (\`${counts[0][0].temp_mute}\` mute, \`${counts[0][0].temp_vmute}\` v-mute, \`${counts[0][0].ban}\` ban.) times in total. 
      
✸ **Ongoing Penalties** ✸
${mapped.join("\n\n")}
      `)

      respond({
        embeds: info_embed
      })
    }

    if (args[0] === "remove") {
      if (!target) return respond({ content: "The member you are trying to punish is **not currently** on the server.", ephemeral: true })
     if (args[2] === "MUTE") {
      let data = await con.promise().query(`SELECT * FROM Penalties WHERE member_id = '${target.user.id}' AND punishment_type = 'TEMP-MUTE' AND is_ended = 0`)
      if (data[0].length < 1) return respond({
        content: "There is currently **no penalty** for this member that you can remove."
      })

      if (target.user.id === member.user.id) return respond({
        content: "You **cannot** remove your own punishment.",
        ephemeral: true
      })

      if (member.roles.highest.position <= target.roles.highest.position) return respond({
        content: "You **cannot** perform this action because the member you are trying to remove is **equal** to or **higher** in rank than you.",
        ephemeral: true
      })

      con.query(`UPDATE Penalties SET is_ended = 1 WHERE member_id = '${target.user.id}' AND punishment_type = 'TEMP-MUTE' AND is_ended = 0`)
      target.roles.remove(settings.other.muteRole, `Removed Mute. (By ${member.user.tag}.)`) 

      let logChannel = client.channels.cache.get(settings.other.penaltyLogChannel)

      let embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
      .setDescription(`**${target.user.tag}** member's mute penalty was removed by **${member.user.tag}** due to \`${args[3]}\`.`)
      .setColor("LIGHT_GREY")

      let log_embed = new MessageEmbed()
      .setAuthor(target.user.tag, target.user.avatarURL({ dynamic: true }))
      .setColor("AQUA")
      .setDescription(`**${target.user.tag}** member's mute penalty was removed by **${member.user.tag}** due to \`${args[3]}\`.
      
✸ **Affected:** ${target.user.tag} (\`${target.user.id}\`)
✸ **Affecter:** ${member.user.tag} (\`${member.user.id}\`)
✸ **Reason:** \`${args[3]}\`

*Normally this member mute penalty would expire in <t:${Math.floor(data[0][0].end_of_punishment / 1000)}> (<t:${Math.floor(data[0][0].end_of_punishment / 1000)}:R>).*
      `)

      respond({ embeds: embed })
      logChannel.send({ embeds: log_embed })

     } else if (args[2] === "VMUTE") {
      let data = await con.promise().query(`SELECT * FROM Penalties WHERE member_id = '${target.user.id}' AND punishment_type = 'TEMP-VMUTE' AND is_ended = 0`)
      if (data[0].length < 1) return respond({
        content: "There is currently **no penalty** for this member that you can remove."
      })

      if (target.user.id === member.user.id) return respond({
        content: "You **cannot** remove your own punishment.",
        ephemeral: true
      })

      if (member.roles.highest.position <= target.roles.highest.position) return respond({
        content: "You **cannot** perform this action because the member you are trying to remove is **equal** to or **higher** in rank than you.",
        ephemeral: true
      })

      con.query(`UPDATE Penalties SET is_ended = 1 WHERE member_id = '${target.user.id}' AND punishment_type = 'TEMP-VMUTE' AND is_ended = 0`)
      target.voice.setMute(false, `VMute removed. (By ${member.user.tag}.)`)

      let logChannel = client.channels.cache.get(settings.other.penaltyLogChannel)

      let embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
      .setDescription(`**${target.user.tag}** member's v-mute penalty was removed by **${member.user.tag}** due to \`${args[3]}\`.`)
      .setColor("LIGHT_GREY")

      let log_embed = new MessageEmbed()
      .setAuthor(target.user.tag, target.user.avatarURL({ dynamic: true }))
      .setColor("AQUA")
      .setDescription(`**${target.user.tag}** member's v-mute penalty was removed by **${member.user.tag}** due to \`${args[3]}\`.
      
✸ **Affected:** ${target.user.tag} (\`${target.user.id}\`)
✸ **Affecter:** ${member.user.tag} (\`${member.user.id}\`)
✸ **Reason:** \`${args[3]}\`

*Normally this member mute penalty would expire in <t:${Math.floor(data[0][0].end_of_punishment / 1000)}> (<t:${Math.floor(data[0][0].end_of_punishment / 1000)}:R>).*
      `)

      respond({ embeds: embed })
      logChannel.send({ embeds: log_embed })

     }
    }

    if (args[0] === "registry") {
      let normal_target = guild.members.cache.get(args[1]) 
      let force_target = await client.users.fetch(args[1]) 

      let other_target;
      if (normal_target) other_target = normal_target.user;
      if (!normal_target) other_target = force_target;


      let data = await con.promise().query(`SELECT * FROM Penalties WHERE member_id = '${other_target.id}'`)
      let enough_data = await con.promise().query(`SELECT * FROM Penalties WHERE member_id = '${other_target.id}' ORDER BY pid DESC LIMIT 5`)
      let counts = await con.promise().query(`SELECT * FROM TotalPenalties WHERE member_id = '${other_target.id}'`)

      let enough_mapped = enough_data[0].map((value, index) => `**${index + 1}.** [\`${value.punishment_type}\`] (<@${value.staff_id}>)\n${value.punishment_reason} (**<t:${Math.floor(value.end_of_punishment / 1000)}:R>**)`)
      let normal_mapped = data[0].map((value, index) => `- ${index + 1}. [${value.punishment_type} ${dayjs(value.date_now).format("DD.MM.YY HH:mm:ss")}] ${value.punishment_reason} (#${value.pid})`)
      

      if (data[0].length < 1) return respond({
        content: "Since this member has never been punished before, there is **no record** information."
      })

      let sicil_embed = new MessageEmbed()
      .setAuthor(other_target.tag, other_target.avatarURL({ dynamic: true }))
      .setColor("BLURPLE")
      .setDescription(`**${other_target.tag}** member has been punished a total of **${counts[0][0].temp_mute + counts[0][0].ban + counts[0][0].temp_vmute}** (\`${counts[0][0].temp_mute}\` mute, \`${counts[0][0].temp_vmute}\` v-mute, \`${counts[0][0].ban}\` ban.) times in the past.

✸ **Penalty Score:** ${counts[0][0].total_points} \`《 ${punishmentPointConverter(counts[0][0].total_points)} 》\`
      
✸ **Last Penalties** ✸
${enough_mapped.join("\n\n")}
      `)

      respond({ embeds: sicil_embed, content: `\`\`\`diff\n${normal_mapped.join("\n")}\`\`\`` })
    }

    if (args[0] === "lookup") {
      let data = await con.promise().query(`SELECT * FROM Penalties WHERE pid = '${args[1]}'`)
      if (data[0].length < 1) return respond({
        content: "**No penalties** were found for the number you tried to call.",
        ephemeral: true
      })

      let normal_affected = guild.members.cache.get(data[0][0].member_id) 
      let normal_affecter = guild.members.cache.get(data[0][0].staff_id)

      let force_affected = await client.users.fetch(data[0][0].member_id) 
      let force_affecter = await client.users.fetch(data[0][0].staff_id)

      let affected;
      if (normal_affected) affected = normal_affected.user;
      if (!normal_affected) affected = force_affected;

      let affecter;
      if (normal_affecter) affecter = normal_affecter.user;
      if (!normal_affecter) affecter = force_affecter;

      let info_embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
      .setColor("DARK_BLUE")
      .setDescription(`**${member.user.tag}** staff is examining the registry number \`#${args[1]}\`.

✸ **Affected:** ${affected.username}#${affected.discriminator} (\`${data[0][0].member_id}\`)
✸ **Punishment Type:** [\`${data[0][0].punishment_type}\`]
✸ **Punishment Reason:** ${data[0][0].punishment_reason}

✸ **Date:** ${dayjs(data[0][0].date_now).format("DD.MM.YY HH:mm")}
✸ **End of Punishment:** <t:${Math.floor(data[0][0].end_of_punishment / 1000)}> <t:${Math.floor(data[0][0].end_of_punishment / 1000)}:R>
✸ **Is Ended:** ${punishmentIsEndedConverter(data[0][0].is_ended)}

✸ **Affecter:** ${affecter.username}#${affecter.discriminator} (\`${data[0][0].staff_id}\`)
✸ **Extras:** ${data[0][0].extras}
✸ **Validate Number:** \`${data[0][0].member_id}-${String(args[1]).padStart(4, "0")}\`
      `)

      respond({ embeds: info_embed })
    }
  }
};