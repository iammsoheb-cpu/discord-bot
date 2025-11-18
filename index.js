const { Client, GatewayIntentBits, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
});

const commands = [
  {
    name: "submit",
    description: "Submit a link",
    options: [
      {
        name: "link",
        type: 3,
        description: "The link you want to submit",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Slash command /submit is ready!");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "submit") {
    const link = interaction.options.getString("link");

    const channel = interaction.guild.channels.cache.find(
      (c) => c.name === "submissions"
    );

    if (!channel)
      return interaction.reply("Channel **#submissions** not found!");

    channel.send(`📌 **New Link Submitted:** ${link}`);
    interaction.reply("Your link has been submitted 😊");
  }
});

client.login(process.env.TOKEN);

