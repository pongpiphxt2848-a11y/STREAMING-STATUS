const Discord = require('discord.js-selfbot-v13');
const si = require('systeminformation');
const client = new Discord.Client({ checkUpdate: false });

const keepAlive = require('./server.js');
keepAlive();

// ฟังก์ชันดึงข้อมูล วันที่ เวลา และสเปคคอม
async function getSystemStats() {
    const now = new Date();
    // ฟอร์แมตวันที่: 13 / December / 2023
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // ดึงค่า CPU และ RAM
    const load = await si.currentLoad();
    const mem = await si.mem();
    const cpuUsage = load.currentLoad.toFixed(1);
    const ramUsage = ((mem.active / mem.total) * 100).toFixed(1);

    return {
        timeStr: `( ⏰ ${time} ) ✧ ( 🗓️ ${day} / ${month} / ${year} )`,
        statsStr: `✨ • HEART | CPU: ${cpuUsage}% RAM: ${ramUsage}%`,
        pingStr: `📡 My Ping : ${client.ws.ping} ms`
    };
}

client.on('ready', async () => {
    console.clear();
    console.log(`Logged in as ${client.user.tag}!`);

    const updatePresence = async () => {
        const data = await getSystemStats();
        
        const r = new Discord.RichPresence(client)
            .setApplicationId('1487130863304179934')
            .setType('STREAMING')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // ลิงก์ที่ต้องการ
            .setName('YOUTUBE') // จะขึ้นว่า ถ่ายทอดสดบน YOUTUBE
            .setDetails(data.timeStr)
            .setState(data.statsStr)
            .setStartTimestamp(Date.now()) // ตัวนับเวลา "ผ่านไปแล้ว"
            .setAssetsLargeImage('https://cdn.discordapp.com/attachments/1276206630043648103/1487145047941054484/bbfa30a752409dc211bda11676d4a2d8.gif?ex=69c81341&is=69c6c1c1&hm=8b530fe1a28e7b043553bb432a1a8ccb7c074e303c65b7d8b5df2a8e3c234ef6&') 
            .setAssetsLargeText(data.pingStr) // เอาเมาส์วางที่รูปจะขึ้น Ping
            .addButton('JOIN DISCORD', 'https://discord.com')
            .addButton('CONTACT', 'https://www.facebook.com/profile.php?id=61565692229208');

        client.user.setActivity(r);
    };

    updatePresence();
    setInterval(updatePresence, 30000); // อัปเดตทุก 30 วินาที
    client.user.setPresence({ status: "idle" });
});

client.login(process.env.TOKEN);
