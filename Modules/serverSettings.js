const { QuickDB } = require('quick.db')
console.log("\nLoading Server Database🔄")
let db = new QuickDB({ filePath: 'Database/serverSettings.sqlite' })
console.log("Server Database Loaded!✅\n")

class Server {
    async initServerData(guildID, ownerID) {
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))

        if (!await db.get(`${guildID}`)) {

            const serverData = {
                guildID: guildID,
                ownerID: ownerID,
                logsChannelID: undefined
            }
        }
    }

    async getServerData(guildID) {
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        return await db.get(`${guildID}`)
    }

    async setLogsChannelID(guildID, logsChannelID) {
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        if (!logsChannelID) console.error(new Error('logsChannelID arg was not provided.'))
        return await db.set(`${guildID}.logsChannelID`, logsChannelID)
    }

    async setNewOwnerID(guildID, newOwnerId) {
        if (!guildID) console.error(new Error('GuildID arg was not provided.'))
        if (!newOwnerId) console.error(new Error('newOwnerId arg was not provided.'))
        return await db.set(`${guildID}.ownerID`, newOwnerId)
    }
}

module.exports = Server