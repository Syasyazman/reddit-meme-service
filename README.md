<_Do note that this is in local environment_>

Tech stack used:
- Node.js
- Express.js
- PostgreSQL

API endpoint: http://localhost:8080/api/reddit/top-memes

Command to use in telegram bot: /topmemes

<h1>Setup</h1>

Since this is local environment, you will need to create your own:
- Telegram bot from @BotFather
- PostgreSQL database

<h3>.env Variables:</h3>

```
DB_DATABASENAME= <YOUR_DATABASE_NAME>
DB_USERNAME= <YOUR_DATABASE_USERNAME>
DB_PASSWORD= <YOUR_DATABASE_PASSWORD>
DB_PORT= <YOUR_DATABASE_PORT>
DB_HOST= localhost

BOT_TOKEN= <YOUR_BOT_TOKEN>

PORT= <YOUR_LOCALHOST_PORT>
```

<h3>Commands to create tables in PostgreSQL:</h3>

```
CREATE TABLE account (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL);

CREATE TABLE meme (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  upvotes INT NOT NULL,
  upvote_ratio DECIMAL NOT NULL,
  num_comments INT NOT NULL,
  url TEXT NOT NULL);

CREATE TABLE
  CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES account(id),
  post_id TEXT NOT NULL REFERENCES meme(id),
  post_date BIGINT NOT NULL,
  crawl_date BIGINT NOT NULL);
```
