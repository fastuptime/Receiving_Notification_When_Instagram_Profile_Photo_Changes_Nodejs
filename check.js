const fs = require("fs");
let delay = ms => new Promise(res => setTimeout(res, ms));
async function sendMsg(username, telegramId, newPic, oldPic) {
    newPic = await axios.get(newPic, { responseType: 'arraybuffer' });
    oldPic = await axios.get(oldPic, { responseType: 'arraybuffer' });
    newPic = Buffer.from(newPic.data, 'binary').toString('base64');
    oldPic = Buffer.from(oldPic.data, 'binary').toString('base64');
    if (!fs.existsSync("cache")) fs.mkdirSync("cache");
    fs.writeFileSync(`cache/newPic_${username}.jpg`, newPic, 'base64');
    fs.writeFileSync(`cache/oldPic_${username}.jpg`, oldPic, 'base64');
    await delay(200);
    bot.sendMessage(telegramId, `${username} profil fotoğrafını değiştirdi!\n\nInstagram: https://www.instagram.com/${username}/ \n\nGithub:https://github.com/fastuptime`);
    await delay(400);
    bot.sendPhoto(telegramId, `cache/newPic_${username}.jpg`, { caption: "Yeni profil fotoğrafı" });
    await delay(400);
    bot.sendPhoto(telegramId, `cache/oldPic_${username}.jpg`, { caption: "Eski profil fotoğrafı" });
    await delay(400);
    fs.unlinkSync(`cache/newPic_${username}.jpg`);
    fs.unlinkSync(`cache/oldPic_${username}.jpg`);
    return { status: true, message: "Mesaj gönderildi."}
}

async function check(data, telegramId) {
    let {
        id,
        pic,
        username
    } = data;
    if (id == undefined || pic == undefined) return { status: false, message: "Bir hata oluştu." };
    if(db.has(`${username}_${telegramId}`)) {
        let old = db.get(`${username}_${telegramId}`);
        if(old.pic == pic) return { status: false, message: "Profil fotoğrafı değişmedi." };
        if(pic.includes("44884218_345707102882519_2446069589734326272_n")) return { status: false, message: "Profil fotoğrafı değişmedi." };
        db.set(`${username}_${telegramId}`, { username: username, telegramId: old.telegramId, pic: pic, id: id });
        await sendMsg(old.username, old.telegramId, pic, old.pic);
        return { status: true, message: "Profil fotoğrafı değişti." };
    } else {
        return { status: true, message: "Bu kullanıcı takip için eklenmedi!" };
    }
}

module.exports = { check };