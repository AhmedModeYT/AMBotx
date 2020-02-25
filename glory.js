const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const config = require('./glory-config.json');
const dns = require('dns')
var glory_snipe_content = "";
var glory_snipe_author = "";
var glory_snipe_guild = "";
var glory_afk_message = config.afkresponse;
var glory_user_afk = false;
var glory_logger_display = config.displaylogs;
var alreadymessaged = new Set();
setTerminalTitle("Glory Selfbot - Idle")
setTerminalTitle("Glory Selfbot - Authorizing")
// ------------------------------------ Ready Event ------------------------------------
client.on('ready', () => {
    console.log(("#"), "Authroization Successful");
    console.log(("#"), `UID: ${client.user.id}  `, ("|"), `  Discrim #${client.user.discriminator}`)
    setTerminalTitle(`Glory Selfbot - Authorized as ${client.user.tag}`)
});
// ------------------------------------ Main Command Block ------------------------------------
client.on('message', message => {
    const params = message.content.split(" ").slice(1);
    if (message.author !== client.user) { return; }
    if (message.content.startsWith(config.prefix + "help")) {
        message.delete();
        if(config.silentoutput) {
            console.log(("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            console.log(("General Commands") + ":");
            console.log(("#"), "help " + ("-") + " Shows this");
            console.log(("#"), "stream " + ("-") + " Set streaming status");
            console.log(("#"), "snipe " + ("-") + " Snipe latest deleted message");
            console.log(("#"), "afk " + ("-") + " Set yourself AFK & Autorespond with message in config");
            console.log(("Administrative Commands") + ":");
            console.log(("#"), "ban [@user] " + ("-") + " Ban member (Requires Permissions)");
            console.log(("#"), "kick [@user] " + ("-") + " Kick member (Requires Permissions)");
            console.log(("Grief Commands") + ":");
            console.log(("#"), "massb " + ("-") + " Massban in guild (Requires Permissions)");
            console.log(("#"), "massk " + ("-") + " MassKick in guild (Requires Permissions)");
            console.log(("#"), "nuke " + ("-") + " Nuke Server (Delete Channels, Ban Members, etc) (Requires Permissions)");
            console.log(("#"), "dmall [string] " + ("-") + " Direct message all users in server");
            console.log(("Misc Commands") + ":");
            console.log(("#"), "stop " + ("-") + " Shutdown");
            console.log(("#"), "clear " + ("-") + " Clear Console");
            console.log(("#"), "roll [max] " + ("-") + " Roll the dice");
            console.log(("#"), "cum [@user/string] " + ("-") + " Cum on anything bro!");
            console.log(("#"), "surf " + "-") + (" Rapidly join all vcs in server (why not lol)");
            console.log(("Non-prefixed Commands") + ":");
            console.log(("#"), "cl " + ("-") + " Clear messages");
            console.log(("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        }
        else {
            const helpMsg = new Discord.RichEmbed()
            .setTitle(`Ahmed Mode`)
            .setColor(0x0408ff)
            .addField(`General Commands`, `${config.prefix}help: Show this menu\n${config.prefix}stream: Stream the string you have in your config\n${config.prefix}snipe: Snipe latest deleted message\n${config.prefix}afk: Set yourself as AFK (Autoresponse)\n${config.prefix}ping: Show response time`)
            .addField(`Administrative Commands`, `${config.prefix}ban [@user]: ban the user mentioned\n${config.prefix}kick [@user]: kick the user mentioned`)
            .addField(`Grief Commands`, `${config.prefix}massb: Mass ban everyone in server\n${config.prefix}massk: Mass kick everyone in server\n${config.prefix}nuke: Nuke whole server\n${config.prefix}nickall [string]: Change all nicknames\n${config.prefix}resetall: Reset all nicknames\n${config.prefix}dmall [string]: Direct message all users`)
            .addField(`Misc Commands`, `${config.prefix}stop: Stop the bot\n${config.prefix}clear: Clear the console\n${config.prefix}roll [max]: Roll the dice\n${config.prefix}cum [@user/string]: Cum on anything!\n${config.prefix}surf: Rapidly join all vcs in server (why not lol)`)
            .addField(`Non-prefixed Commands`, `cl: Clear messages`)
            .setFooter(`AMBot Selfbot by Ahmed Mode`)
            message.channel.send(helpMsg)
        }
    }
    if (message.content.startsWith("cl")) {
        if(params[0] == "" || params[0] == null) {
            message.delete();
            console.log(("#"), `Please add an amount of messages to clear`);
        }
        else if (params[0] > 100) {
            message.channel.fetchMessages({ limit: 100 }).then(messages => {
            let array = messages.array();
            array = array.filter(m => m.author.id === client.user.id);
            array.length = 99 + 1;
            array.map(m => m.delete().catch(console.error))
            console.log(("#"), `Deleted `, ("99"), " messages");
            })
        }
        else {
            message.channel.fetchMessages({ limit: params }).then(messages => {
            let array = messages.array();
            array = array.filter(m => m.author.id === client.user.id);
            array.length = params + 1;
            array.map(m => m.delete().catch(console.error))
            console.log(("#"), `Deleted `, (params), " messages");
        })
       }
    }
    if (message.content.startsWith(config.prefix + "snipe")) {
        message.delete();
        const embed1 = new Discord.RichEmbed()
        if(glory_snipe_content == "" || glory_snipe_author == "") {
            embed1.setTitle("Ahmed Mode - Sniper")
            embed1.setDescription(`No deleted messages have been logged, try later`)
            embed1.setColor(0x0408ff)
            embed1.setFooter(`AM Selfbot by AhmedMode`)
        }
        else {
            embed1.setTitle("Ahmed Mode - Sniper")
            embed1.setDescription(`Deleted message logged\nContent: ${glory_snipe_content}\nAuthor: ${glory_snipe_author}\nSent in: ${glory_snipe_guild}`)
            embed1.setColor(0x0408ff)
            embed1.setFooter(`AM Selfbot by AhmedMode`)
        }
        message.channel.send(embed1);
    }
    if (message.content.startsWith(config.prefix + "stop")) {
        message.delete();
        console.log(("#"), "AM is shutting down, Goodbye.");
        process.exit(0);
    }
    if (message.content.startsWith(config.prefix + "stream")) {
        message.delete();
            client.user.setActivity(config.stream, { type: "STREAMING", url: config.streamurl})
            console.log(("#"), `Stream status updated ${params}`);
    }
    if (message.content.startsWith(config.prefix + "afk")) {
        message.delete();
        if(glory_user_afk == true) {
            glory_user_afk = false;
            console.log(("#"), `You are no longer set as AFK`);
        }
        else if (glory_user_afk == false) {
                glory_user_afk = true;
                console.log(("#"), `I have set you as AFK!`);
        }
    }
    if (message.content.startsWith(config.prefix + "ban")) {
        message.delete();
        if(message.mentions.members.size < 1) {
            console.log(("#"), `You must mention a user, ${config.prefix}ban @testdummy#0001`);
        }
        else {
            if(message.guild == null) {
                console.log(("#"), `You must execute this in a server`);
            }
            else {
                let guild = message.guild
                let member = message.mentions.members.first()
                if(member.bannable) {
                    guild.ban(member, { days: 7 });
                    console.log(("#"), `You have banned ${member.user.tag}`);
                }
                else {
                    console.log(("#"), `Cancelled banning process of ${member.user.tag}, they are not bannable!`);
                }
            }
        }
    }
    if (message.content.startsWith(config.prefix + "kick")) {
        message.delete();
        if(message.mentions.members.size < 1) {
            console.log(("#"), `You must mention a user, ${config.prefix}kick @testdummy#0001`);
        }
        else {
            if(message.guild == null) {
                console.log(("#"), `You must execute this in a server`);
            }
            else {
                let member = message.mentions.members.first()
                if(member.kickable) {
                    member.kick();
                    console.log(("#"), `You have kicked ${member.user.tag}`);
                }
                else {
                    console.log(("#"), `Cancelled kicking process of ${member.user.tag}, they are not kickable!`);
                }
            }
        }
    }
    if (message.content.startsWith(config.prefix + "clear")) 
    if(message.content.startsWith(config.prefix + "roll")) {
        message.delete()
        if(params[0] == "" || params[0] == null) {
            console.log(("#"), `You must add a max number`);
        }
        else {
            message.channel.send(`Rolled: ${Math.floor(Math.random() * Math.floor(params[0]))}`)
        }
    }
    if(message.content.startsWith(config.prefix + "massb")) {
        message.delete();
        if(message.guild == null || message.guild == "") {
            console.log(("#"), `You are not in a server, cancelling execution`);
        }
        else {
            let guild = message.guild
            guild.members.forEach(member => {
                if(member.bannable) {
                    guild.ban(member).catch(error => { console.log(("#"), `Error ${error}`) })
                    console.log(("#"), `Banned ${member.user.tag}`);
                }
            })
        }
    }
    if(message.content.startsWith(config.prefix + "massk")) {
        message.delete();
        if(message.guild == null || message.guild == "") {
            console.log(("#"), `You are not in a server, cancelling execution`);
        }
        else {
            let guild = message.guild
            guild.members.forEach(member => {
                if(member.kickable) {
                    member.kick().catch(error => { console.log(("#"), `Error ${error}`) })
                    console.log(("#"), `Kicked ${member.user.tag}`);
                }
            })
        }
    }
    if(message.content.startsWith(config.prefix + "nuke")) {
        message.delete();
        if(message.guild == null || message.guild == "") {
            console.log(("#"), `You are not in a server, cancelling execution`);
        }
        else {
            let guild = message.guild
            guild.members.forEach(member => {
                if(member.bannable) {
                    guild.ban(member).catch(error => { console.log(("#"), `Error ${error}`) })
                    console.log(("#"), `Banned ${member.user.tag}`);
                }
            })
            guild.channels.forEach(channel => {
                if(channel.deletable) {
                    channel.delete();
                    console.log(("#"), `Deleted Channel ${channel.name}`);
                }
            })
            guild.emojis.forEach(emoji => {
                if(emoji.deletable) {
                    emoji.delete();
                    console.log(("#"), `Deleted Emoji ${emoji.name}`);
                }
            })
            guild.roles.forEach(role => {
                if(role.deletable) {
                    role.delete();
                    console.log(("#"), `Deleted Role ${role.name}`);
              
                }
            })
            console.log(("#"), `Nuker Done!`);
        }
    }
    if(message.content.startsWith(config.prefix + "cum")) {
        if(params[0] == null || params[0] == "") {
            console.log(("#"), `Please mention someone, something to cum on (lol)`);
        }
        else {
            message.edit(`:ok_hand:            :smile:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8=:punch:=D \n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :smile:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8=:punch:=D \n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :smiley:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8==:punch:D \n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :grimacing:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8=:punch:=D \n             :trumpet:      :eggplant:                \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :persevere:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8==:punch:D \n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}     `)
            message.edit(`:ok_hand:            :confounded:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8=:punch:=D \n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :tired_face:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8==:punch:D \n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :weary:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8=:punch:= D:sweat_drops:\n             :trumpet:      :eggplant:                 \n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :dizzy_face:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8==:punch:D :sweat_drops:\n             :trumpet:      :eggplant:                 :sweat_drops:\n                                                  ${params[0]}      `)
            message.edit(`:ok_hand:            :drooling_face:\n   :eggplant: :zzz: :necktie: :eggplant: \n                   :oil:     :nose:\n                 :zap: 8==:punch:D :sweat_drops:\n             :trumpet:      :eggplant:                 :sweat_drops:\n                                                  ${params[0]}      `)
            message.delete();
        }
    }
    if(message.content.startsWith(config.prefix + "nickall")) {
        if(params[0] == "" || params[0] == null) {
            console.log(("#"), `Please add a nickname`);
        }
        else if (message.guild == null || message.guild == "") {
            console.log(("#"), `You must do this in a guild`);
        }
        else {
            let guild = message.guild
            guild.members.forEach(member => {
                member.setNickname(params[0]).catch(error => { console.log(("#"), `Error ${error}`) })
                console.log(("#"), `Set nickname of ${member.user.tag} to ${params[0]}`);
            })
        }
    }
    if(message.content.startsWith(config.prefix + "resetall")) {
        if (message.guild == null || message.guild == "") {
            console.log(("#"), `You must do this in a guild`);
        }
        else {
            let guild = message.guild
            guild.members.forEach(member => {
                member.setNickname("").catch(error => { console.log(("#"), `Error ${error}`) })
                console.log(("#"), `Set nickname of ${member.user.tag} to default`);
            })
        }
    }
    if(message.content.startsWith(config.prefix + "ping")) {
        message.edit(`Pong! ${Math.round(client.ping)}ms`)
    }
    if(message.content.startsWith(config.prefix + "dmall")) {
        message.delete();
        if (params == "" || params == null) {
            console.log(("#"), `You must add something to spam`);
        } 
        else if (message.guild == null || message.guild == "") {
            console.log(("#"), `You must execute this in a server`);
        }
        else {
            let guild = message.guild;
            guild.members.forEach(member => {
                console.log(("#"), `Messaging ${member.user.tag}`);
                member.send(params).catch(error => { console.log(("#"), `Failed to message ${member.user.tag}`) });
                console.log(("#"), `Done with ${member.user.tag}`);
            })
        }
    }
    if(message.content.startsWith(config.prefix + "surf")) {
        if (message.guild == null) {
            console.log(("#"), `You must execute this in a server`);
        }
        else {
            let guild = message.guild
            setInterval(bigMeme, 4*1000, guild)
        }
    }
    if(message.content.startsWith(config.prefix + "resolve")) {
        if(params[0] == "" || params[0] == null) {
            console.log(("#"), `You must add a hostname`);
        }
        else {
            const resolveEmebed = new Discord.RichEmbed();
            dns.resolve(params[0] + ".discord.gg", function(err, result) {
                resolveEmebed.setTitle(`Glory - IP Resolved`);
                resolveEmebed.addField(`Resolved To`, result + ` | Hostname: ${params[0]}.discord.gg`);
                resolveEmebed.setColor(0x0408ff);
                message.channel.send(resolveEmebed);
            })
        }
    }
});
// ------------------------------------ AFK Handler ------------------------------------
client.on('message', message => {
    if(glory_user_afk == true) {
        if(message.channel.type === "dm") {
            let user = message.author
            if (user == client.user) {
                return;
            }
            if(!alreadymessaged.has(user.id)) {
                message.channel.send(glory_afk_message)
                alreadymessaged.add(user.id);
            }
            console.log(("#"), `${user.tag} has tried to DM you while you were away, they said ${message.content}.`);
        }
    }
});
// ------------------------------------ Events ------------------------------------
client.on('messageDelete', message => {
    if(message.author == client.user) { return; }
    if(message.author.bot) { return; }
    glory_snipe_content = message.content;
    glory_snipe_author = message.author.tag;
    if(message.guild == null || message.guild == "" || message.guild == "undefined") {
        glory_snipe_guild = "direct messages";
        if(glory_logger_display) {
            console.log(("#"), `DM Deletion: ${glory_snipe_content}, Sent by ${glory_snipe_author}, Sent in ${glory_snipe_guild}`);
        }
    }
    else {
        glory_snipe_guild = message.guild.name;
        if(glory_logger_display) {
            console.log(("#"), `Server Message Deletion: ${glory_snipe_content}, Sent by ${glory_snipe_author}, Sent in ${glory_snipe_guild}`);
        }
    }
});
client.on('guildCreate', guild => {
    console.log(("#"), `Added to guild ${guild.name}, with a member count of ${guild.members.size}`);
});
client.on('guildDelete', guild => {
    console.log(("#"), `Removed from guild ${guild.name}, with a member count of ${guild.members.size}`);
});
client.on('error', error => {
    console.log(("#"), `Captured Error ${error}`);
});

client.login(config.token);

function bigMeme(guild) {
    guild.channels.forEach(channel => {
        if(channel.type == "voice") {
            channel.join();
            console.log(("#"), `Joined ${channel.name}`);
        }
    })
}

function setTerminalTitle(title)
{
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}!`);
console.log("Streamstatus by AhmedMode")

client.user.setActivity(`💜 YouTube.com/AhmedMode 💜`, {
type: "STREAMING",
url: "https://www.twitch.tv/ahmedmodeyt"})
    .then(presence => console.log(`Your Status has been set to  ${presence.game ? presence.game.none : 'none'}`))
    .catch(console.error);
});

const express = require('express')
const app = express();
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});
app.listen(3000);
setInterval(() => require('http').get(`http://${process.env.PROJET_DOMAIN}.glitch.me`), 280000);