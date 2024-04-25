const express = require("express");
const { exec } = require("child_process");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 33046;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/webhook", (req, res) => {
  console.log("🚀 - app.post - req.headers:", req.headers);
  if (req.headers["x-github-event"] === "push") {
    const payload = JSON.parse(req?.body.payload);
    console.log("payload", payload);
    const branch = payload?.ref?.split("/")?.pop(); // Extract branch name from ref
    console.log("branch", branch);

    if (typeof branch !== "undefined" && branch === "dev") {
      // TODO: add secret
      // Verify webhook payload authenticity (if using a secret token)

      // Execute deployment script
      res.status(200).send("Deployment process started!");
      exec("bash deploy.sh", (err, stdout, stderr) => {
        if (err) {
          console.error("Deployment failed:", err);
        } else {
          console.log("Deployment successful");
        }
      });
    } else {
      res.status(400).send("Payload is not valid!");
    }
  } else {
    res.status(400).send("Request is not supported!");
  }
});

app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});
