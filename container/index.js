const { GCommandsClient } = require("gcommands");
const { Intents } = require("discord.js");
const settings = require("../config/defaults.json");
const mysql = require("mysql2");
const dayjs = require("dayjs");
const chalk = require("chalk");
const { join } = require("path");

const client = new GCommandsClient({
  cmdDir: join(__dirname, 'commands'),
  eventDir: join(__dirname, 'events'),
  intents: Object.keys(Intents.FLAGS),
  caseSensitiveCommands: false, 
  caseSensitivePrefixes: false, 
  unkownCommandMessage: false, 
  language: "english", 
  commands: {
    slash: "both", 
    prefix: settings.bot.prefix,
  },
  defaultCooldown: "3s",
  database: `mysql://${settings.mysqlDefs.user}:${settings.mysqlDefs.password}@${settings.mysqlDefs.host}:3306/${settings.mysqlDefs.dbName}`,
});

client.on("debug", console.log); 
client.on("log", console.log);

const con = (global.con = mysql.createConnection({
  host: settings.mysqlDefs.host,
  user: settings.mysqlDefs.user,
  password: settings.mysqlDefs.password,
  database: settings.mysqlDefs.dbName,
}));

con.connect((err) => {
  if (err) throw err;
  console.log(
    chalk.bgWhite.black(
      `[${dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}]`
    ) + chalk.greenBright(` Connected to MySQL database.`)
  );
});

client
  .login(settings.bot.token)
  .then(() => {
    console.log(
      chalk.bgWhite.black(
        `[${dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}]`
      ) + chalk.greenBright(` Successfully connected to the token.`)
    );
  })
  .catch((err) => {
    console.log(
      chalk.bgWhite.black(
        `[${dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}]`
      ) + chalk.redBright(` Couldn't connect to token! ${err}`)
    );
  });

  async function _muteLoop() {
    let cezalar = (await con.promise().query(`SELECT * FROM Penalties WHERE is_ended = 0 AND punishment_type = 'TEMP-MUTE'`)) || [[]]
    for (let i = 0; i < cezalar[0].length; i++) {
      const ceza = cezalar[i][0];
      let user = client.guilds.cache.get(settings.bot.server).members.cache.get(ceza.member_id)
      if (Date.now() >= ceza.end_of_punishment) {
        if (user) {
          if (user.roles.cache.has(settings.other.muteRole)) {
            user.roles.remove(settings.other.muteRole, "Mute is ended. (Automatic.)") 
          }
        }
        con.query(`UPDATE Penalties SET is_ended = 1 WHERE member_id = '${ceza.member_id}' AND punishment_type = 'TEMP-MUTE' AND is_ended = 0`)
      }
    }
    setTimeout(() => { _muteLoop(); }, 10000);
  }

  async function _vmuteLoop() {
    let cezalar = (await con.promise().query(`SELECT * FROM Penalties WHERE is_ended = 0 AND punishment_type = 'TEMP-VMUTE'`)) || [[]]
    for (let i = 0; i < cezalar[0].length; i++) {
      const ceza = cezalar[i][0];
      let user = client.guilds.cache.get(settings.bot.server).members.cache.get(ceza.member_id)
      if (Date.now() >= ceza.end_of_punishment) {
        if (user) {
          if (user.voice.channelId) {
            user.voice.setMute(false, "VMute is ended. (Otomatik eylem.)")
          } else {
            con.query(`SELECT * FROM PenaltiesList WHERE member_id = '${user.user.id}'`, async (err, rows) => {
              if (err) throw err;
              if (rows.length < 1) {
                con.query(`INSERT INTO PenaltiesList (member_id, punishment_type) VALUES ('${user.user.id}', 'TEMP-VMUTE')`)
              }
            })
          }
        }
        con.query(`UPDATE Penalties SET is_ended = 1 WHERE member_id = '${ceza.member_id}' AND punishment_type = 'TEMP-VMUTE' AND is_ended = 0`)
      }
    }
    setTimeout(() => { _vmuteLoop(); }, 20000);
  }

  client.on("ready", async () => {
    _muteLoop();
    _vmuteLoop();
  })
