const { Client, Events, GatewayIntentBits, Collection, ConnectionService } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
require('dotenv').config()

const User = require('./Modules/databaseManager')
const userData = new User()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences] })

client.once(Events.ClientReady, c => {
    console.log(`Starting engines...`)
    console.log(`Bot online! Logged in as ${c.user.tag}!`)
})

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        console.log(`Searching for command ${file}🔎`)

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`Loaded command ${command.data.name} ✅\n`)
        } else {
            console.log(`🛑 [WARNING] The command ${file} at ${filePath} is missing a required "data" or "execute" property. 🛑`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    await userData.checkData(interaction.user.id, interaction.guild.id)
    let leveling = await userData.getLeveling(interaction.user.id, interaction.guild.id)

    if (leveling.messagesSent == 0) {
        await userData.initLeveling(interaction.user.id, interaction.guild.id)
    }
    await userData.addXp(interaction.user.id, interaction.guild.id)


    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on(Events.MessageCreate, async message => {
    await userData.checkData(message.author.id, message.guild.id)
    let leveling = await userData.getLeveling(message.author.id, message.guild.id)
    if (!message.author.bot) {
        if (leveling.messagesSent == 0) {
            await userData.initLeveling(message.author.id, message.guild.id)
        }
        await userData.addXp(message.author.id, message.guild.id)
    }
})

client.login(process.env.TOKEN)