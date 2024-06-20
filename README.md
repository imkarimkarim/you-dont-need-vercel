# Deploy Nextjs using webhook

this will listens for a git webhook on specefic conditions and runs a shell script.

1. create a [webhook](https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks). ([see example](webhook_example.png))

2. login to your server.

3. clone your nextjs app to the directory you want to serve from.

4. install nodejs and git on the server. (if it's not installed...)

5. clone this repo somewhere outside your nextjs app(and make sure the user running the webhook proccess has rwx access to it (chown, chmod, git credentials --save)).

6. rename deploy.sh.example to deploy.sh and change deploy.sh to your needs and make sure it does the work it supposed to by running it manually.

7. rename .env.example to .env and update .env file to your needs.

8. finally, run:

```sh
npm i
npm start
```

you're good to go! 🎉  

now when ever you make the hook event that you specified(push for example) in the first step. it will make a call to the webhook which is listening on your server and it will get the latest changes and rebuild you're app on the server.

## Warning ⚠️

this is not a good practice for production environment. im only using it for staging(test) server.

## Debugging 🐞

in order to see what webhook process is doing use:

```sh
npx pm2 list
```

or

```sh
npx pm2 logs
```

## Get Notified on Telegram when deploy is finished  🔔

- create a telegram bot

- and set NOTIFY to true and your TELEGRAM_BOT_TOKEN on .env file

## TODOS ✅

- [ ] add secret check
- [ ] refactor
- [ ] improve documentation
- [ ] spell check
- [ ] create a youtube tutorial(you-dont-need-vercel)
