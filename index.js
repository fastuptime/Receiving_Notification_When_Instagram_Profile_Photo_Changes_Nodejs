global.sorgu = require('./query.js').sorgu;
global.axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
global.bot = new TelegramBot("TELEGRAM BOT TOKEN", { polling: true });

const {
    JsonDatabase
} = require("wio.db");

global.db = new JsonDatabase({
  databasePath:"./fastuptime.json"
});

function addUser(username, telegramId) {
    db.set(`${username}_${telegramId}`,
    {
        username: username,
        telegramId: telegramId,
        pic: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1188.jpg",
        id: telegramId
    });
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if(msg.text.startsWith("/takipet")) {
        let username = msg.text.split(" ")[1];
        if(username == undefined) return bot.sendMessage(chatId, "Kullanıcı adı belirtmediniz!");
        if(db.has(`${username}_${chatId}`)) return bot.sendMessage(chatId, "Bu kullanıcı zaten takip ediliyor!");
        addUser(username, chatId);
        bot.sendMessage(chatId, "Kullanıcı takip listesine eklendi!");
    } else if(msg.text.startsWith("/takipbırak")) {
        let username = msg.text.split(" ")[1];
        if(username == undefined) return bot.sendMessage(chatId, "Kullanıcı adı belirtmediniz!");
        if(!db.has(`${username}_${chatId}`)) return bot.sendMessage(chatId, "Bu kullanıcı zaten takip edilmiyor!");
        db.delete(`${username}_${chatId}`);
        bot.sendMessage(chatId, "Kullanıcı takip listesinden çıkarıldı!");
    } else if(msg.text.startsWith("/takipliste")) {
        let list = db.all();
        list = list.filter(x => x.data.telegramId === chatId);
        if(list.length == 0) return bot.sendMessage(chatId, "Takip edilen kullanıcı bulunamadı!");
        let msg = "";
        list.forEach(x => {
            msg += `Kullanıcı adı: ${x.data.username}\n`;
        });
        bot.sendMessage(chatId, msg);
    } else {
        bot.sendMessage(chatId, "Komutlar:\n/takipet <kullanıcı adı>\n/takipbırak <kullanıcı adı>\n/takipliste");
    }
});

setInterval(async () => {
    let list = db.all();
    list.forEach(async x => {
        let z = await sorgu(x.data.username, x.data.telegramId);
        console.log(z);
    });
}, 1000 * 60); // 1 dakika
