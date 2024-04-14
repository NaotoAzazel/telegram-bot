### Course project / telegram-bot
# About what

It's a simple telegram bot to search for a movie based on various parameters. Built on basic OOP principles and design patterns, such as dependency injection and singleton.
Stack: Typescript, MongoDB, Telegraf

# Getting started with codebase

1. Create a new file called `.env` and pase in the following:
```bash
BOT_TOKEN =
MONGO_URL = 
TMDB_ACCESS_TOKEN = 
```
2. First, create a telegram bot in [BotFather](https://t.me/BotFather). Make sure to enable inline query by writing the command setinline and then specify placeholder, in our case it is "search...". Paste bot token to `BOT_TOKEN=` in `.env` file

3. Set up a [MondogDB](https://www.mongodb.com/) database. Copy the URI that is given on the MongoDB website and paste it next to `MONGO_URL=` in `.env` file

4. Set up a [TMDB](https://www.themoviedb.org/) account. Go to the [API references](https://developer.themoviedb.org/reference/intro/getting-started) and copy your Authenticate code. Paste it next to `TMDB_ACCESS_TOKEN=` in `.env` file

5. Run the following command to install every package needed for this codebase to run properly
```BASH
npm install
```
# Usage

```bash
npm run build # to compile current version of bot
npm start
```
