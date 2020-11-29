const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core')

client.on('ready', () => {
    console.log('BOT en fonction!')
})

client.on('message', message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return

    let args = message.content.slice(config.prefix.length).trim().split(' ')
    let command = args.shift().toLowerCase()

    if(command === 'ytb') {
        if(!args.length) {
            message.delete()
            return message.reply("Tu n'as pas mis le lien de la vidéo !")
        }
        
        let voiceChannel = message.guild.channels.cache
            .filter(function (channels) { return channels.type === 'voice' })
            .first()
        voiceChannel
            .join()
            .then(function (connection) {
                try {
                    let stream = ytdl(args[0])
                    message.channel.send(":musical_note: Lecture de la vidéo : " + args[0])
                    message.delete()
                    connection
                        .play(stream)
                        .on('finish', function() {
                            setTimeout(function() {
                                connection.disconnect()
                            }, 300000)
                        })
                    } catch (e) {
                        message.delete()
                        message.reply('Une erreur est survenue : ' + e.message)
                        connection.disconnect()
                    }
            })
    }

    if(command === 'delmsg') {
        if(!args.length) {
            return message.reply('Entrez le nombre de messages à supprimer !')
        }
        if(args[0] < 0 || args[0] > 100) {
            return message.reply('La valeur ne doit être négative ou supérieur à 100 !')
        }
        message.channel.bulkDelete(args[0])
    }
})

client.login(config.token)