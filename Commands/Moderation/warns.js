const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const User = require('../../Modules/databaseManager')
let userData = new User()

module.exports = {

    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Shows how many warns someone has!')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you want to check')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getUser('target')
        const moderation = await userData.getModeration(target.id, interaction.guild.id)
        const embed = new EmbedBuilder()
            .setColor(0xd10000)
            .setTitle(`Warnings of ${target.username}!`)
            .setDescription(`${target} has ${moderation.warns.numberOfWarns} wanrs!`)
            .addFields(
                {
                    name: `Warn reasons:`, value: `-"${moderation.warns.reasons.reasons.join('"\n-"')}"`
                })
        await interaction.reply({ embeds: [embed] })
    }

}