const config = require("./config.json");
const Discord = require("discord.js");
const mysql = require('mysql');
const request = require('request');

const bot = new Discord.Client({disableEveryone: true});
var tech = false
var players = "0";
let a = 0

const channelid = "580558867499581451"; // ID kanału na którym będzie aktualizować się status.
const adminstatus = "590096431428141066"; // ID Kanału z statusem dla administracji.
const juniorchannelid = "587420910701772810"; // ID kanału na którym będzie aktualizować się status dla serwera junior.
const adminjuniorstatus =""; // ID Kanału z statusem dla administracji junior.

// Funkcja odpowiedzialna za aktywnosc bota.
bot.on('ready', async () => {
    console.log("Zalogowano jako " + bot.user.tag)
    setInterval(async () => {
        //console.log("[DEBUG] Pobieram dane na temat serwera")
        await request(`http://164.132.206.31:30120/info.json`, async (error) => {
        if (tech == true) {
            bot.user.setActivity(`Przerwa techniczna`, {
                type: 'WATCHING',
            });
        }else if (error) {
            bot.user.setActivity(`Serwer Offline`, {
                type: 'WATCHING',
            });
        } else {
                await request(`http://164.132.206.31:30120/players.json`, async (error, response, playerss) => {
                    players = JSON.parse(playerss);
                    //console.log("[DEBUG] Pobieram ilość graczy z serwera: "+players.length)
                    bot.user.setActivity(`${players.length}/128 online`, {
                        type: 'PLAYING',
                    });
                    const channel = bot.channels.find('id', channelid);
                    if (channel) {
                        if (a === 0) {
                            const online = new Discord.RichEmbed()
                            .setAuthor("StrefaRP.pl / BETA 128 slotów / Najlepszy serwer RolePlay w Polsce") //https://cdn.discordapp.com/avatars/554051836114501663/8319f779ba899e3c3c6a7751736330b9.png?size=2048
                            .setThumbnail("https://cdn.discordapp.com/attachments/589801887121801227/589818953195454464/icons8-ok-64.png")
                            .addField("Status", "Online")
                            .addField("Adres", "``164.132.206.31:30120``", true)
                            .addField("Gracze", `${players.length}/128`, true)
                            .setTimestamp()
                            .setColor("#35b471")
                            .setFooter("StrefaRP.pl • Odświeżono")
                            channel.send(online)
                            //console.log("[DEBUG] Wysyłam pierwszą wiadomość z statusem")
                            a = 1
                        }
                    } else {
                        console.log(`Nie znaleziono kanału ${channelid}`);
                    }
                });
            }
        });
    }, 10 * 1000);
});


// Funkcja odpowiedzialna za komende !tech
bot.on("message", async message => {
    //if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "tech") {
        if(!message.member.roles.some(r=>["@admin"].includes(r.name)) )
        return message.reply("Błąd! Nie posiadasz uprawnień do tej komnendy!");
        tech = !tech
        if (tech) {
            message.reply("Przerwa techniczna została uruchomiona!")
        } else if (tech == false){
            message.reply("Przerwa techniczna została wyłączona!")
        }
    }
})

// Funkcja odpowiedzialna za aktualizowanie wiadomosci
bot.on("message", async message => {
    setInterval(async () => {
        if(message.channel.id === '580558867499581451') {
            await request(`http://164.132.206.31:30120/info.json`, async (error) => {
                if(message.author.bot === true) {
                    if (tech === true ) {
                        var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/')+' '+[d.getHours(),d.getMinutes(),d.getSeconds()].join(':');
                        const maintenance = new Discord.RichEmbed()
                        .setAuthor("StrefaRP.pl / BETA 128 slotów / Najlepszy serwer RolePlay w Polsce") // https://cdn.discordapp.com/avatars/554051836114501663/8319f779ba899e3c3c6a7751736330b9.png?size=2048
                        .setThumbnail("https://cdn.discordapp.com/attachments/589801887121801227/589820504504926238/icons8-printer-maintenance-64.png")
                        .addField("Status", "Przerwa techniczna")
                        .addField("Adres", "``164.132.206.31:30120``", true)
                        .addField("Gracze", `0/128`, true)
                        .setTimestamp(d)
                        .setColor("#fdbb4d")
                        .setFooter("StrefaRP.pl • Odświeżono")
                        //console.log("[DEBUG] Edytuje wiadmość na status Techniczny")
                        message.edit(maintenance)
                    } else if (error){
                        var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/')+' '+[d.getHours(),d.getMinutes(),d.getSeconds()].join(':');
                        const offline = new Discord.RichEmbed()
                        .setAuthor("StrefaRP.pl / BETA 128 slotów / Najlepszy serwer RolePlay w Polsce") // https://cdn.discordapp.com/avatars/554051836114501663/8319f779ba899e3c3c6a7751736330b9.png?size=2048
                        .setThumbnail("https://cdn.discordapp.com/attachments/589801887121801227/589819032799281214/icons8-cancel-64.png")
                        .addField("Status", "Offline")
                        .addField("Adres", "``164.132.206.31:30120``", true)
                        .addField("Gracze", `0/128`, true)
                        .setTimestamp(d)
                        .setColor("#ff634f")
                        .setFooter("StrefaRP.pl • Odświeżono")
                        //console.log("[DEBUG]  Edytuje wiadmość na status Offline")
                        message.edit(offline)
                    } else {
                        await request(`http://164.132.206.31:30120/players.json`, async (error, response, playersembed) => {
                            playerse = JSON.parse(playersembed);
                            var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/')+' '+[d.getHours(),d.getMinutes(),d.getSeconds()].join(':');
                            const online = new Discord.RichEmbed()
                            .setAuthor("StrefaRP.pl / BETA 128 slotów / Najlepszy serwer RolePlay w Polsce") // https://cdn.discordapp.com/avatars/554051836114501663/8319f779ba899e3c3c6a7751736330b9.png?size=2048
                            .setThumbnail("https://cdn.discordapp.com/attachments/589801887121801227/589818953195454464/icons8-ok-64.png")
                            .addField("Status", "Online")
                            .addField("Adres", "``164.132.206.31:30120``", true)
                            .addField("Gracze", `${playerse.length}/128`, true)
                            .setTimestamp(d)
                            .setColor("#35b471")
                            .setFooter("StrefaRP.pl • Odświeżono")
                            //console.log("[DEBUG]  Edytuje wiadmość na status Online graczy online: "+playerse.length)
                            message.edit(online)
                        });
                    }
                }
            });
        }
    }, 10 * 1000);
})

// Logowanie bota
bot.login(config.token);