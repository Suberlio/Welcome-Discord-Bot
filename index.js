const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
    // 1. البحث عن قناة ترحيب باسم "welcome" في السيرفر الذي انضم إليه العضو
    let welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome' && ch.isTextBased());

    // 2. إذا لم يجد قناة باسم "welcome"، يبحث عن قناة عامة باسم "general"
    if (!welcomeChannel) {
        welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'general' && ch.isTextBased());
    }

    // 3. إذا لم يجد الاثنتين، يأخذ أول قناة نصية متاحة في السيرفر
    if (!welcomeChannel) {
        welcomeChannel = member.guild.channels.cache.find(ch => ch.isTextBased());
    }

    // إذا لم توجد أي قناة نصية، يتوقف الكود
    if (!welcomeChannel) return;

    // إرسال رسالة الترحيب مع عدد الأعضاء في هذا السيرفر بالذات
    await welcomeChannel.send(`أهلاً بك في السيرفر، ${member}! نحن سعداء بانضمامك 🎉\nأنت العضو رقم **${member.guild.memberCount}** هنا.`);
});

client.login(process.env.DISCORD_TOKEN);