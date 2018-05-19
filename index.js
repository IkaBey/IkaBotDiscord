const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot allumé, avec ${client.guilds.size} serveurs.`);
  client.user.setGame(`Manger du Miel | bzz/help`);
});

client.on("guildCreate", guild => {
  console.log(`Nouveau serveur rejoin: ${guild.name} (id: ${guild.id}). Ce serveur a ${guild.memberCount} membres!`);
  client.user.setGame(`vec les abeilles | bzz/help`);
});

client.on("guildDelete", guild => {
  console.log(`J'ai été enlevé de: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`Manger beaucoup de Miel | bzz/help`);
});


client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms. La latence de l'API est de ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
  }
  
  if(message.content === "/help"){
  const embed = new Discord.RichEmbed()
.setTitle("Page d'aide")
.setDescription("Les Crochets tels que **<>** et **[]**, Il ne faut pas les mettre.")
.addField("bzz/help", "Permet d'afficher la page d'aide")
.addField("bzz@help", "Permet d'afficher la page d'aide (Modération)")
.setColor("0x80FF00")
        message.channel.send(embed);
}

  if(message.content === "@help"){
  const embed = new Discord.RichEmbed()
.setTitle("Page d'aide (Modération)")
.setDescription("Les Crochets tels que **<>** et **[]**, Il ne faut pas les mettre.")
.addField("bzz@kick", "Permet d'afficher la page d'aide")
.addField("bzz@ban", "Permet d'afficher la page d'aide (Modération)")
.addField("bzz@clearchat", "Permet d'afficher la page d'aide (Modération)")
.setColor("0x80FF00")
        message.channel.send(embed);
}

  if(command === "@kick") {
    if(!message.member.roles.some(r=>["IkAdmin", "Modo"].includes(r.name)) )
      return message.reply("Désolé, tu n'as pas la permission de faire sa ! Pour avoir la permission, il faut un des rôles que je vais citer : IkAdmin, Modo");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Mentionne un membre valide sur ce serveur");
    if(!member.kickable)
      return message.reply("Je ne peux pas kick cette personne! Il as peut-être un rôle plus haut que le mien ? Je n'ai peut-être pas la permission de kick ?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Indique la raison du kick !");

    await member.kick(reason)
      .catch(error => message.reply(`Désolé ${message.author} Je ne peux pas kick cette personne. Raison : ${error}`));
    message.reply(`${member.user.tag} a été kick par ${message.author.tag} raison : ${reason}`);

  }

  if(command === "@ban") {
    if(!message.member.roles.some(r=>["IkAdmin", "Modo", "Membre de la MPG"].includes(r.name)) )
      return message.reply("Désolé, tu n'as pas la permission de faire sa ! Pour avoir la permission, il faut un des rôles que je vais citer : IkAdmin, Modo");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Mentionne un membre valide sur ce serveur");
    if(!member.bannable)
      return message.reply("Je ne peux pas kick cette personne! Il as peut-être un rôle plus haut que le mien ? Je n'ai peut-être pas la permission de kick ?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Indique la raison du ban !");

    await member.ban(reason)
      .catch(error => message.reply(`Désolé ${message.author} Je ne peux pas ban cette personne, raison: ${error}`));
    message.reply(`${member.user.tag} à était banni par ${message.author.tag} raison: ${reason}`);
  }

  if(command === "@clearchat") {
    if(!message.member.roles.some(r=>["IkAdmin", "Modo", "Membre de la MPG"].includes(r.name)) )
      return message.reply("Désolé, tu n'as pas la permission de faire sa ! Pour avoir la permission, il faut un des rôles que je vais citer : IkAdmin, Modo");

    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Met un chiffre entre 2 et 100 pour enlevé les message (Exemple: +clearchat 2)");

    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  
});

client.login(config.token);
