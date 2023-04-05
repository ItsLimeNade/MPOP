const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const canvaCord = require('canvaCord')
const User = require('../../Modules/databaseManager')
const userData = new User()


module.exports = {

    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows you your current level!')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user target.')
                .setRequired(false)),

    async execute(interaction) {

        let slashMember;
        let status;
        try {
            slashMember = interaction.options.getMember('target')
            if (await userData.checkData(slashMember.user.id, interaction.guild.id)) {
                await userData.initLeveling(slashMember.user.id, interaction.guild.id)
            }
            status = slashMember.presence.status
        } catch {
            slashMember = interaction
            if (await userData.checkData(slashMember.user.id, interaction.guild.id)) {
                await userData.initLeveling(slashMember.user.id, interaction.guild.id)
            }
            status = interaction.member.presence.status
        }
        const leveling = await userData.getLeveling(slashMember.user.id, interaction.guild.id)
        const rank = new canvaCord.Rank()
            .setAvatar(slashMember.user.displayAvatarURL({ format: "png" }))
            .setCurrentXP(leveling.xp)
            .setRequiredXP(leveling.neededxp)
            .setStatus(status)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(slashMember.user.username)
            .setDiscriminator(slashMember.user.discriminator)
            .setLevel(leveling.level, 'Level', true)
            .setRank(0, 'Rank', false)

        rank.build()
            .then(async (data) => {
                const attachment = new AttachmentBuilder(data, "RankCard.png");
                await interaction.reply({ content: 'Here is your level card!', files: [attachment], ephemeral: false })
            });
    }

}