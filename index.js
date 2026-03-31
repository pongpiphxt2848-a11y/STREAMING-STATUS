const { Client, RichPresence } = require('discord.js-selfbot-v13');
const os = require('os-utils');
require('dotenv').config();

const client = new Client({
    checkUpdate: false
});

const keepAlive = require("./server.js");
keepAlive();

// ฟังก์ชันสำหรับจัดรูปแบบเวลาและวันที่ (โซนไทย)
const getThaiTime = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Bangkok' };
    
    const timeStr = now.toLocaleTimeString('th-TH', { ...options, hour: '2-digit', minute: '2-digit', hour12: false });
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { ...options, month: 'long' });
    const year = now.getFullYear();

    return { timeStr, day, month, year };
};

client.on("ready", async () => {
  console.clear();
  console.log(`${client.user.tag} - rich presence started!`);

    // ตั้งลูปอัปเดตสถานะทุก 3 วินาทีตามโค้ด Python
    setInterval(() => {
        os.cpuUsage((cpuPercent) => {
            const { timeStr, day, month, year } = getThaiTime();
            
            // คำนวณค่า RAM (Percent)
            const ramUsage = ((1 - os.freememPercentage()) * 100).toFixed(1);
            const cpuUsage = (cpuPercent * 100).toFixed(1);

            // ตั้งค่า Rich Presence แบบ Streaming
            const r = new RichPresence(client)
                .setApplicationId('1469150529002148083') // APP_ID จากโค้ด Python
                .setType('STREAMING')
                .setURL('https://www.twitch.tv/h3artpaihaisuth') // URL จากโค้ด Python
                .setName('Twitch')
                .setDetails('𝗛𝗘𝗔𝗥𝗧 𝗣𝗔𝗜𝗛𝗔𝗜𝗦𝗨𝗧𝗛') // ข้อความบรรทัดที่ 1
                .setState(`📊 | 𝗖𝗣𝗨: ${cpuUsage}% 𝗥𝗔𝗠: ${ramUsage}%`); // ข้อความบรรทัดที่ 2

            // การใส่ URL รูปภาพโดยตรง
            // คุณสามารถเปลี่ยนลิงก์ด้านล่างนี้เป็น URL รูปภาพใดก็ได้ที่คุณต้องการ
            const largeImageUrl = 'https://cdn.discordapp.com/attachments/1276206630043648103/1488443517465530509/download.gif?ex=69cccc8c&is=69cb7b0c&hm=5304ac1659dac556f6f1ccf62a6a296d64b658cec0fbec8bac062351b8dd2f3d&';
            r.setAssetsLargeImage(largeImageUrl); // ใส่ URL รูปภาพตรงนี้

            r.setAssetsLargeText(`𝐈𝟓-𝟏𝟐𝟒𝟎𝟎𝐅`); // ข้อความเมื่อเอาเมาส์ชี้รูป

            r.addButton('ดู', 'https://www.twitch.tv/h3artpaihaisuth');

            client.user.setPresence({ 
                activities: [r], 
                status: 'streaming' // สถานะ Idle (ปุ่มเหลือง) ตาม Python
            });
        });
    }, 3000); // อัปเดตทุก 3 วินาที
});

// ดึง Token จาก .env หรือ Secrets
client.login(process.env.TOKEN);