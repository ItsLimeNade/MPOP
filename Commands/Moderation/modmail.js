const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('modmail')
        .setDescription('Sends a message directly to mods!'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('modMail')
            .setTitle('Mod Mail');

        const mailHeader = new TextInputBuilder()
            .setCustomId('header')
            .setLabel('The title of your request.')
            .setStyle(TextInputStyle.Short)

        const mailBody = new TextInputBuilder()
            .setCustomId('body')
            .setLabel('The body of your request.')
            .setStyle(TextInputStyle.Paragraph)

        const firstActionRow = new ActionRowBuilder().addComponents(mailHeader)
        const secondActionRow = new ActionRowBuilder().addComponents(mailBody)

        modal.addComponents(firstActionRow, secondActionRow)

        await interaction.showModal(modal)
    }

}