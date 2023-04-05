const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the messages in the channel!')
        .addNumberOption(option =>
            option
                .setName('messages')
                .setDescription('Number of messages to delete')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const messages = await interaction.options.getNumber('messages')
        await interaction.channel.bulkDelete(messages)
        const embed = new EmbedBuilder()
            .setColor(0x588eb8)
            .setTitle('Finished clearing messages!')
            .setDescription(`${interaction.user} has cleared ${messages} total messages!`)
        await interaction.reply({ embeds: [embed] })
        setTimeout(() => interaction.deleteReply(), 5000);
    }

}