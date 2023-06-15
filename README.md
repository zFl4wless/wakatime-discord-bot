# WakaTime Discord Bot

A Discord bot that interacts with the WakaTime api for showing coding stats to users in a discord server.
Feel free to contribute to this project.

## ⚙ Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Create `.env` file from `.env.example` and fill in the values (see [Configuration](#environment-configuration))
4. Run the bot with `npm run start` or check `package.json` for other scripts

### Environment Configuration

| Key               | Description                                                                                  |
|-------------------|----------------------------------------------------------------------------------------------|
| `BOT_TOKEN`       | Your Discord bot token.                                                                      |
| `GUILD_ID`        | The Id of the guild where the bot should run. If it runs on multiple guilds remove this key. |
| `DATABASE_URL`    | The url to your postgres database.                                                           |
| `API_URL`         | The url to your personal API. It is needed for the authorization process.                    |
| `API_PORT`        | The port on which your personal API should run                                               |
| `CLIENT_ID`       | The client id of your WakaTime app.                                                          |
| `CLIENT_SECRET`   | The client secret of your WakaTime app.                                                      |
| `CRYPTO_PASSWORD` | The password for hashing the JWTs of authorized users. (Choose a secure one!)                |

## 📝 License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.

## 🐞 Bugs Found?

If you find a bug, please open an issue on
the [GitHub repository](https://github.com/zFl4wless/discord.js-typescript-template/issues).
