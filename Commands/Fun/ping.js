const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Whether or not the echo should be ephemeral')),
    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral')

        if (ephemeral) await interaction.reply({ content: 'Pong!', ephemeral: true })
        if (!ephemeral) await interaction.reply(`Pong!`)

    },
}