const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // ضروري جداً لقراءة الأعضاء الجدد
    ],
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}! Bot is active on multiple servers.`);
});

client.on('guildMemberAdd', async (member) => {
    try {
        // 1. البحث عن قناة باسم "welcome" في السيرفر الذي دخل إليه العضو
        let welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome' && ch.isTextBased());

        // 2. إن لم يجدها، يبحث عن قناة "general"
        if (!welcomeChannel) {
            welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'general' && ch.isTextBased());
        }

        // 3. إن لم يجد الاثنتين، يأخذ أول قناة نصية يملك البوت صلاحية الكتابة فيها
        if (!welcomeChannel) {
            welcomeChannel = member.guild.channels.cache.find(ch => ch.isTextBased() && ch.permissionsFor(member.guild.members.me)?.has('SendMessages'));
        }

        // إذا لمط تتوفر أي قناة مناسبة، يتوقف الكود
        if (!welcomeChannel) return;

        // إرسال رسالة الترحيب مع عدد الأعضاء الخاص بهذا السيرفر فقط
        await welcomeChannel.send(`أهلاً بك في السيرفر، ${member}! نحن سعداء بانضمامك 🎉\nأنت العضو رقم **${member.guild.memberCount}** هنا.`);
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);
