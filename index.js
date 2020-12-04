const Discord = require('discord.js')
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }})

client.commands = new Discord.Collection()

const config = require('./config.json')

const fs = require("fs")

function loadCommands(directory = "./commands/") {
    fs.readdir(directory, (err, data) => {
        if (err) console.log("Erro no handler: " + err);
        data.forEach(file => {
            if (fs.statSync(`${directory}/${file}`).isDirectory()) {
                loadCommands(`${directory}/${file}`)
            } else {            	
                const command = require(`${directory}/${file}`)
                client.commands.set(command.help.name, command)
            }
        })
    })
}

loadCommands()

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err)
    files.forEach(file => {
        const event = require(`./events/${file}`)
        let eventName = file.split(".")[0]
        client.on(eventName, event.bind(null, client, config))
    })
})

client.on("ready", () => {
  let activities = [
      `Rio de janeiro roleplay ®`,
      `Faça a sua whitelist`,
      `Leia as regras`,
      `Developed by xXGhøstXD#3924`
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "STREAMING"
      }), 1000 * 60);  // WATCHING, LISTENING, PLAYING, STREAMING

  client.user
      .setStatus("dnd") // idle, dnd, online, invisible
      .catch(console.error);
console.log("Estou Online!")
});

client.login(config.token)