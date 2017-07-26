const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class ClanmatesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clanmates',
            aliases: ['members'],
            group: 'clan',
            memberName: 'clanmates',
            description: 'Get a clans member list as tracked by Scapers',
            examples: ['clanmates maximized'],
        });
    }

    async run(message, args) {
        const clan = args;
        util.request.remoteApi(`${process.env.SCAPERS}/api/clans/${clan}/members`).then(result => {
            message.embed(this.createEmbed(clan, result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(clan, result) {
        let embed = new RichEmbed()
            .setAuthor(clan.toTitleCase(), ``)
            .setTimestamp()
            .setThumbnail(`http://services.runescape.com/m=avatar-rs/${clan}/clanmotif.png`)
        let members = '';
        result.sortBy('display');
        result.forEach((member) => {
            members += `${member.clanRank} ${member.display.toTitleCase().mdbold()}\n`
        });
        embed.setDescription( members);
        return embed;
    }
};