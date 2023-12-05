const keepAlive = require('./server');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const PREFIX = '-'

// الماب حق الكول داون
const cooldowns = new Map();

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('Logic', { type: 'STREAMING', url: 'https://www.twitch.tv/md_logic' });
});

//رومات في اراي لست
const CHANNEL_IDS = [
'1022984813843595304',
'1037442518394081380',
'1037442390044200970',
'1103670756266754178',
'1037442267847344138',
'1103670788197990410',
'1111214880108851221',
'1103670604898508831',
'1111214917433954334',
'1111214937688252456',
  '1110213528608059482'
];

client.on('messageCreate', async (message) => {
  if (message.author.id !== '1012702370972573737') return;
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'عذب') {
    // يتحقق اذا فيه كول داون
    const userId = message.author.id;
    if (cooldowns.has(userId)) {
      const cooldownTimestamp = cooldowns.get(userId);
      const timeRemaining = (cooldownTimestamp + 3600000) - Date.now();
      if (timeRemaining > 0) {
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
        message.reply(`الوقت المتبقي لإستخدام الأمر التالي : ${minutes} min and ${seconds} sec `);
        return;
      }
    }

    const target = message.mentions.members.first();
    if (!target) {
      message.reply('تأكد من منشن الشخص');
      return;
    }

    try {
      const channels = CHANNEL_IDS
        .flatMap((id) => message.guild.channels.cache.get(id))
        .filter((channel) => channel.type === 'GUILD_VOICE' && channel.permissionsFor(target).has('CONNECT'));

      if (channels.length === 0) {
        message.reply(`${target.user.tag} is not allowed to connect to any of the specified voice channels.`);
        return;
      }

      for (let i = 0; i < 2; i++) {
        for (const channel of channels) {
          await target.voice.setChannel(channel);
          console.log(`Moved ${target.user.tag} to ${channel.name}`);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      await target.voice.setChannel(target.voice.channel);
      console.log(`Returned ${target.user.tag} to ${target.voice.channel.name}`);

      message.reply(`تم تعذيب: <@${target.user.id}>, وعدد رومات التعذيب: ${channels.length} , وتم استرجاعه الى رومه الأساسي: <#${target.voice.channel.id}>.`);

      // الوقت المتبقي
      cooldowns.set(userId, Date.now());
      setTimeout(() => cooldowns.delete(userId), 3600000); // ساعة
    } catch (error) {
      console.error(error);
    }
  }
});

keepAlive();
//client.login(process.env.TOKEN);