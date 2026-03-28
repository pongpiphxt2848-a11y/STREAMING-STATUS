import discord
from discord.ext import tasks
import psutil
import os
import datetime
import pytz
from keep_alive import keep_alive  # เพิ่มบรรทัดนี้

# ดึง Token จากช่อง Secrets (รูปแม่กุญแจ)
TOKEN = os.getenv('TOKEN')
APP_ID = 1487130863304179934 

class MyClient(discord.Client):
    async def on_ready(self):
        print(f'✅ บอท Python ออนไลน์แล้ว: {self.user}')
        self.update_presence.start()

    @tasks.loop(seconds=3)
    async def update_presence(self):
        # 1. จัดการข้อมูล วันที่ และเวลา (โซนไทย)
        tz = pytz.timezone('Asia/Bangkok')
        now = datetime.datetime.now(tz)

        time_str = now.strftime("%H:%M")
        day = now.day
        month = now.strftime("%B")
        year = now.year

        # 2. ดึงค่าสเปคเครื่อง
        cpu = psutil.cpu_percent()
        ram = psutil.virtual_memory().percent
        ping = round(self.latency * 1000)

        # 3. ตั้งค่า Rich Presence แบบ Streaming (สีม่วง)
        assets = discord.ActivityAssets(
            large_image='https://cdn.discordapp.com/attachments/1276206630043648103/1487302740425314304/3870d1fcd484fb466bffc0b80300afc7.gif?ex=69c8a61e&is=69c7549e&hm=74275fb97bb1d8a93045b77d3e5f420a49577b236e54a27065df783acd01533b&',
            large_text=f"🕙 ( {time_str} ) ✧ ( 🗓️ {day} / {month} / {year} )"
        )

        activity = discord.Activity(
            type=discord.ActivityType.streaming,
            name="Twitch",
            url="https://www.twitch.tv/ariana_grande",
            details="𝗛𝗘𝗔𝗥𝗧 𝗣𝗔𝗜𝗛𝗔𝗜𝗦𝗨𝗧𝗛",
            state=f"📊 | 𝗖𝗣𝗨: {cpu}% 𝗥𝗔𝗠: {ram}%",
            application_id=APP_ID,
            assets=assets
        )

        await self.change_presence(activity=activity, status=discord.Status.idle)

client = MyClient()

keep_alive()
client.run(TOKEN)
