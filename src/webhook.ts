import express from "express";
import { spawn } from "child_process";
import { Telegraf } from "telegraf";
// @ts-ignore
import { JSONFilePreset } from "lowdb/node";

import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 33046;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}/webhook`);
});

// Telegram Bot Notification
const bot = new Telegraf(String(process.env.TELEGRAM_BOT_TOKEN));
type Data = {
  users: number[];
};
JSONFilePreset<Data>("db.json", {
  users: [],
}).then(async (db) => {
  await db.read();
  bot.start(async (ctx) => {
    if (!db.data.users.includes(ctx.message.from.id)) {
      db.data.users.push(ctx.message.from.id);
    }
    ctx.reply("Peace Be Upon You");
    await db.write();
  });

  bot.launch();

  // webhook listener
  app.post("/webhook", (req: any, res: any) => {
    console.log("🚀 - app.post - req.headers:", req.headers);
    // TODO read from env
    if (
      req.headers["x-github-event"] === "push" ||
      req.headers["x-gitlab-event"] === "Push Hook"
    ) {
      const payload = JSON.parse(req?.body.payload);
      console.log("payload", payload);
      const branch = payload?.ref?.split("/")?.pop(); // Extract branch name from ref
      console.log("branch", branch);

      if (typeof branch !== "undefined" && branch === process.env.BRANCH) {
        // TODO: add secret
        // Verify webhook payload authenticity (if using a secret token)

        // Execute deployment script
        res.status(200).send("Deployment process started...");
        db.data.users.forEach((userId) => {
          bot.telegram.sendMessage(userId, "Deployment process started...");
        });
        const cmd = spawn("bash", ["deploy.sh"]);
        cmd.on("exit", () => {
          db.data.users.forEach((userId) => {
            bot.telegram.sendMessage(userId, "Deployment successful.");
          });
          console.log("Deployment successful");
        });
        cmd.on("error", (err) => {
          db.data.users.forEach((userId) => {
            bot.telegram.sendMessage(userId, "Deployment failed: " + err);
          });
          console.error("Deployment failed:", err);
        });
      } else {
        res.status(400).send("Payload is not valid!");
      }
    } else {
      res.status(400).send("Request is not supported!");
    }
  });
});
