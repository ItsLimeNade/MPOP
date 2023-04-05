const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const User = require('../../Modules/databaseManager')
const userData = new User()

module.exports = {

    data: new SlashCommandBuilder()
        .setName('messages_sent')
        .setDescription('Sends you the number of messages you sent in total in this server!'),

    async execute(interaction) {
        let leveling = await userData.getLeveling(interaction.member.id, interaction.guild.id)

        try {
            leveling = leveling.messagesSent
        } catch {
            leveling = 0
        }
        const embed = new EmbedBuilder()
            .setColor(0x588eb8)
            .setTitle('Your number of total messages sent!')
            .setDescription(`You have ${leveling} total messages sent!`)
        await interaction.reply({ embeds: [embed] })
    }

}