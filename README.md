<h1 align="center">GPunishment</h1>

> ***GPunishment** gives you a chance to punish with **Slash commands**. With **GPunishment** you can control members with `mute`, `v-mute` and `ban` commands. Everything is recorded under database using **MySQL**. It's easy to find out which member got suspended and when, how long the punishment will last, the reason for the punishment and more. I would like to thank `Armagan#4869` for helping me with this project. So let's get started!* 

## Preparation of MySQL
> MySQL is a very good database for such bots. If you didn't download it (`MySQL Community Server`) at first, you should download it from Google. I'll leave some links below.

- https://dev.mysql.com/downloads/mysql/

**TIP:** Do not forget to choose the version and version that suits you! 
**TIP 2:** After installation, you can download `MySQL Workbench` for **stronger control** if you want.

You should **create** the queries given below in **MySQL**. (*Database and tables.*) If you do not have an **average knowledge** of MySQL, it is recommended that you **do not** modify the following tables.

```
CREATE  DATABASE GPunishment;

USE GPunishment;

CREATE  TABLE Penalties (
pid INT  PRIMARY  KEY AUTO_INCREMENT NOT  NULL,
member_id CHAR(18) NOT  NULL,
punishment_type ENUM ('WARN','TEMP-MUTE','TEMP-VMUTE','TEMP-JAIL','BAN') NOT  NULL,
punishment_reason VARCHAR(255) NOT  NULL,
end_of_punishment CHAR(13) NOT  NULL,
staff_id CHAR(18) NOT  NULL,
is_ended BOOLEAN  DEFAULT false,
extras VARCHAR(500) CHARACTER  SET utf8 NOT  NULL,
date_now DATETIME  DEFAULT (CURRENT_TIME) NOT  NULL
);

CREATE  TABLE TotalPenalties (
pid INT  UNIQUE AUTO_INCREMENT NOT  NULL,
member_id CHAR(18) PRIMARY  KEY  NOT  NULL,
warn INT  DEFAULT  0,
temp_mute INT  DEFAULT  0,
temp_vmute INT  DEFAULT  0,
temp_jail INT  DEFAULT  0,
ban INT  DEFAULT  0,
total_points INT  DEFAULT  0
);

CREATE  TABLE PenaltiesList (
pid INT  UNIQUE AUTO_INCREMENT NOT  NULL,
member_id CHAR(18) PRIMARY  KEY  NOT  NULL,
punishment_type VARCHAR(255) NOT  NULL
);
```
After successfully installing the tables, we can proceed to the installation of the bot!

## Creating Bot
> We will also need the `Discord Developer Portal`, which we use to create each bot, here. You can open it from [this](https://discord.com/developers/applications) link.

After installing the bot and inviting it to your own server, you need to activate the OAuth Scopes permissions below. Click on the two boxes indicated, then invite them back to your server from the link that appears below.

![SCOPES](https://sudis.my-ey.es/5P9u5XX.png?_raw=true)
### Editing the Settings File (`defaults.json`)
> Editing the settings file is easy! An example file is given below.
> 
```
{
"bot":  {
"name":  "BOT_NAME",
"token":  "BOT_TOKEN",
"prefix":  "BOT_PREFIX",
"authors":  ["BOT_AUTHORS"],
"testers":  ["BOT_TESTERS"],
"server":  "BOT_SERVER",
"status":  "BOT_STATUS"
 },

"colors":  [
"f6b10f",
"EC6969",
"27d976",
"c61069"
 ],

"mysqlDefs":  {
"host":  "MYSQL_HOST",
"user":  "MYSQL_USER",
"dbName":  "MYSQL_DBNAME",
"password":  "MYSQL_PASS"
 },

"other":  {
"penaltyLogChannel":  "SERVER_LOG_CHANNEL",
"muteRole":  "SERVER_MUTE_ROLE",
"muterRole":  "SERVER_MUTE_STAFF_ROLE",
"vmuterRole":  "SERVER_VMUTE_STAFF_ROLE",
"banerRole":  "SERVER_BAN_STAFF_ROLE",
"penaltierRole":  "SERVER_PENALTY_STAFF_ROLE"
 }
}
```
After performing these operations, our bot is ready to be **launched**! You can start the bot by installing the packages.

As the **package manager**, we recommend `yarn`. Enter `yarn install` command in command prompt. After all packages are installed, start the bot by typing `nodemon main`.

## Why GPunishment?
> Because **GPunishment** is innovative and stable! **GPunishment** is fair and free! It's simple to setup and uses **MySQL**!

### Powerful Database
> *Who would find managing data so much fun?*
![MySQL](https://cdn.discordapp.com/attachments/882148968883183616/888753586513801216/Ekran_Resmi_2021-09-18_13.49.13.png)

### Don't Confuse!
> *All commands in the bot are Slash commands. Therefore, the explanation and way of everything is predetermined.*
![Slashs](https://cdn.discordapp.com/attachments/882148968883183616/888754324283473921/Ekran_Resmi_2021-09-18_13.52.14.png)

### Be informed about everything!
> *Every action taken is shown in the Log channel.*
![Inform](https://cdn.discordapp.com/attachments/882148968883183616/888753996205023282/Ekran_Resmi_2021-09-18_13.50.49.png)

### Take the wind at your back!
> *Punishing criminals has never been this fun!*
![Banned](https://cdn.discordapp.com/attachments/882148968883183616/888755081716047892/Ekran_Resmi_2021-09-18_13.55.13.png)

### You are in control of everything!
> *Remove the penalties if you want, or learn!*![Removing](https://cdn.discordapp.com/attachments/882148968883183616/888755678989139968/Ekran_Resmi_2021-09-18_13.57.37.png)
> 
### Advanced registry features!
> Did I mention that everything is recorded? Maybe you forgot, I thought I'd say it again!

![REGISTERY](https://cdn.discordapp.com/attachments/882148968883183616/888756242632282134/Ekran_Resmi_2021-09-18_13.59.51.png)
![REGISTERY](https://cdn.discordapp.com/attachments/882148968883183616/888756654395498516/Ekran_Resmi_2021-09-18_14.01.29.png)

Don't forget to install for the features in these photos and more! **It is possible to achieve wonders with GCommands!**

# LINKS
- **GCommands Discord:** https://discord.gg/wDgRk7TC24
- **GCommands Guide:** https://gcommands.js.org/guide
- **Install GCommands:** `yarn add gcommands`
