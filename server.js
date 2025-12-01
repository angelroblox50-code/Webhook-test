// server.js
const express = require("express");
const fetch = require("node-fetch"); // node-fetch@2
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ======== CONFIG ========
const AUTOJOINER_KEY = "alezchangito69";
const AUTOJOINER_BUFFER_CLEAN_SEC = 120;

// ======== WEBHOOKS ========
const WEBHOOKS = {
  "1-9m":    "URL_WEBHOOK_1_9M",
  "10-49m":  "URL_WEBHOOK_10_49M",
  "50-99m":  "URL_WEBHOOK_50_99M",
  "100m+":   "URL_WEBHOOK_100M_PLUS"
};

const ROLE_MENTIONS = {
  "1-9m":   "<@&ROLE_1_9M>",
  "10-49m": "<@&ROLE_10_49M>",
  "50-99m": "<@&ROLE_50_99M>",
  "100m+":  "<@&ROLE_100M_PLUS>"
};


const HIGHLIGHT_WEBHOOK = "";

// ======== PRIORITY NAMES ======
const PRIORITY_NAMES = [
  "La Taco Combinasion","La Secret Combinasion","Tang Tang Keletang",
  "Chipso and Queso","Garama and Madundung","La Casa Boo","Tictac Sahur",
  "Spooky and Pumpky","Dragon Cannelloni","Meowl","Strawberry Elephant",
  "Burguro And Fryuro","Ketchuru and Musturu","La Supreme Combinasion",
  "Ketupat Kepat","Capitano Moby","Headless Horseman","Money Money Puggy",
  "Spaghetti Tualetti","Nuclearo Dinossauro","Tralaledon","Los Hotspotsitos",
  "Chillin Chili","Los Primos","Los Tacoritas","Los Spaghettis",
  "Fragrama and Chocrama","Celularcini Viciosini"
];

// ======== THUMBNAILS ======
const BRAINROT_THUMBNAILS = {
  "Strawberry Elephant": "https://static.wikia.nocookie.net/stealabr/images/5/58/Strawberryelephant.png",
  "Meowl": "https://static.wikia.nocookie.net/stealabr/images/b/b8/Clear_background_clear_meowl_image.png",
  "Dragon Cannelloni": "https://static.wikia.nocookie.net/stealabr/images/0/02/Dragoncanneloni.png",
  "Garama and Madundung": "https://static.wikia.nocookie.net/stealabr/images/e/ee/Garamadundung.png",
  "Burguro and Fryuro": "https://static.wikia.nocookie.net/stealabr/images/6/65/Burguro-And-Fryuro.png",
  "La Secret Combinasion": "https://static.wikia.nocookie.net/stealabr/images/f/f2/Lasecretcombinasion.png",
  "Tang Tang Keletang": "https://static.wikia.nocookie.net/stealabr/images/c/ce/TangTangVfx.png",
  "Tictac Sahur": "https://static.wikia.nocookie.net/stealabr/images/6/6f/Time_moving_slow.png",
  "Chipso and Queso": "https://static.wikia.nocookie.net/stealabr/images/f/f8/Chipsoqueso.png",
  "Spooky and Pumpky": "https://static.wikia.nocookie.net/stealabr/images/d/d6/Spookypumpky.png",
  "Nuclearo Dinossauro": "https://static.wikia.nocookie.net/stealabr/images/9/99/THERE_ARE_BUGS_UNDER_YOUR_SKIN.png",
  "Spaghetti Tualetti": "https://static.wikia.nocookie.net/stealabr/images/b/b8/Spaghettitualetti.png",
  "Ketchuru and Musturu": "https://static.wikia.nocookie.net/stealabr/images/1/14/Ketchuru.png",
  "Ketupat Kepat": "https://static.wikia.nocookie.net/stealabr/images/a/ac/KetupatKepat.png",
  "La Casa Boo": "https://static.wikia.nocookie.net/stealabr/images/d/de/Casa_Booo.png",
  "Money Money Puggy": "https://static.wikia.nocookie.net/stealabr/images/0/09/Money_money_puggy.png",
  "Headless Horseman": "https://static.wikia.nocookie.net/stealabr/images/f/f3/Headlesshorsemancool.png",
  "La Supreme Combinasion": "https://static.wikia.nocookie.net/stealabr/images/5/52/SupremeCombinasion.png",
  "La Taco Combinasion": "https://cdn.discordapp.com/attachments/1434317271949639842/1434833778580131925/Latacocombi.webp",
  "Chillin Chili": "https://cdn.discordapp.com/attachments/1434317271949639842/1434834419570577408/Chilin.png",
  "Tralaledon": "https://cdn.discordapp.com/attachments/1434317271949639842/1434834728451571733/Brr_Brr_Patapem.webp",
  "Eviledon": "https://cdn.discordapp.com/attachments/1434317271949639842/1434834937302880256/Eviledonn.png",
  "Esok Sekolah": "https://cdn.discordapp.com/attachments/1434317271949639842/1434835137278906368/EsokSekolah2.png",
  "Celularcini Viciosini": "https://cdn.discordapp.com/attachments/1434317271949639842/1434835501969313873/DO_NOT_GRAB_MY_PHONE212121.webp",
  "La Spooky Grande": "https://cdn.discordapp.com/attachments/1434317271949639842/1434835711395106876/Spooky_Grande.png",
  "Los Spooky Combinasionas": "https://cdn.discordapp.com/attachments/1434317271949639842/1434835980044468275/Lospookycombi.webp",
  "Los 67": "https://cdn.discordapp.com/attachments/1434317271949639842/1434836206155468800/Los-67.png",
  "Los Bros": "https://static.wikia.nocookie.net/stealabr/images/5/53/BROOOOOOOO.png",
  "Los Combinasionas": "https://static.wikia.nocookie.net/stealabr/images/3/36/Stop_taking_my_chips_im_just_a_baybeh.png",
"Chicleteira Bicicleteira": "https://static.wikia.nocookie.net/stealabr/images/5/5a/Chicleteira.png",
"Los Primos": "https://static.wikia.nocookie.net/stealabr/images/9/96/LosPrimos.png",
  "Las Sis": "https://static.wikia.nocookie.net/stealabr/images/e/e8/Las_Sis.png",
"67": "https://static.wikia.nocookie.net/stealabr/images/8/83/BOIIIIIII_SIX_SEVEN_%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82.png",
"Los Nooo My Hotpotsitos": "https://static.wikia.nocookie.net/stealabr/images/c/cb/LosNooMyHotspotsitos.png",
"Spooky and Pumpky": "https://static.wikia.nocookie.net/stealabr/images/d/d6/Spookypumpky.png",
"Mieteteira Bicicleteira": "https://static.wikia.nocookie.net/stealabr/images/6/6d/24_sin_t%C3%ADtulo_20251023155436.png",
"Los Mobilis": "https://static.wikia.nocookie.net/stealabr/images/2/27/Losmobil.png",
"La Grande Combinasion": "https://static.wikia.nocookie.net/stealabr/images/d/d8/Carti.png",
  "Orcaledon": "https://static.wikia.nocookie.net/stealabr/images/a/a6/Orcaledon.png",
"Los Tacoritas": "https://static.wikia.nocookie.net/stealabr/images/4/40/My_kids_will_also_rob_you.png",
"Los Chicleteiras": "https://static.wikia.nocookie.net/stealabr/images/5/5a/Los_ditos.png",
"W or L": "https://static.wikia.nocookie.net/stealabr/images/2/28/Win_Or_Lose.png",
"Los Hotspotsitos": "https://static.wikia.nocookie.net/stealabr/images/6/69/Loshotspotsitos.png",
"Los Spaghettis": "https://static.wikia.nocookie.net/stealabr/images/d/db/LosSpaghettis.png",
"La Supreme Combinasion": "https://static.wikia.nocookie.net/stealabr/images/5/52/SupremeCombinasion.png",
"Tacorita Bicicleta": "https://static.wikia.nocookie.net/stealabr/images/1/14/Gonna_rob_you_twin.png",
"Los Puggies": "https://static.wikia.nocookie.net/stealabr/images/c/c8/LosPuggies2.png",
"Fragrama and Chocrama": "https://static.wikia.nocookie.net/stealabr/images/5/56/Fragrama.png",
"Swag Soda": "https://static.wikia.nocookie.net/stealabr/images/9/9f/Swag_Soda.png",
"Lavadorito Spinito": "https://static.wikia.nocookie.net/stealabr/images/f/ff/Lavadorito_Spinito.png",
"Capitano Moby": "https://static.wikia.nocookie.net/stealabr/images/e/ef/Moby.png"
  
};

// ======== IN-MEMORY STRUCTURES ========
let serverBuffers = {};
let highlightBuffer = [];
let sentMessages = new Set();
let autoJoinQueue = [];
let jobBestMap = {};
let autoJoinerServers = [];
const AUTOJOINER_MAX_BUFFER = 5000;

// ======== LIMPIEZA ========
setInterval(() => { sentMessages.clear(); console.log("🧹 Limpieza cache duplicados"); }, 15*60*1000);
setInterval(() => { autoJoinerServers = []; console.log(`🧹 Limpieza autoJoinerServers`); }, AUTOJOINER_BUFFER_CLEAN_SEC*1000);

// ======== HELPERS ========
async function sendEmbed(webhook, content, embed, uniqueKey) {
  const now = new Date().toLocaleTimeString("es-ES",{hour12:false});
  if(uniqueKey && sentMessages.has(uniqueKey)){ console.log(`[${now}] ⚠️ Duplicado: ${uniqueKey}`); return; }
  if(uniqueKey) sentMessages.add(uniqueKey);
  try {
    await fetch(webhook,{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ content: content||" ", embeds:[embed] })});
    console.log(`[${now}] ✅ Enviado: ${embed.title} (${uniqueKey||"no-key"})`);
  } catch(err){ console.error(`[${now}] ❌ Error:`, err); }
}

function getPriorityBrainrot(brainrots){
  if(!brainrots || brainrots.length===0) return null;
  const priorityList = brainrots.filter(b=>PRIORITY_NAMES.includes(b.name));
  if(priorityList.length===0) return null;
  priorityList.sort((a,b)=>b.value-b.value);
  return priorityList[0];
}

function getThumbnail(brainrots){
  if(!brainrots || brainrots.length===0) return null;
  const priority = getPriorityBrainrot(brainrots);
  if(priority && BRAINROT_THUMBNAILS[priority.name]) return BRAINROT_THUMBNAILS[priority.name];
  const withThumb = brainrots.filter(b=>BRAINROT_THUMBNAILS[b.name]);
  if(withThumb.length===0) return null;
  withThumb.sort((a,b)=>b.value-b.value);
  return BRAINROT_THUMBNAILS[withThumb[0].name];
}

// ======== SENDER LOOP ========
setInterval(async ()=>{
  const promises = [];
  for(const jobId in serverBuffers){
    const buffer = serverBuffers[jobId];
    if(!buffer || buffer.length===0) continue;

    // ======== DETECCIÓN DE TIERS ========
    
  let tiersToSend = {
  "1_9m":    buffer.filter(b => b.value < 10_000_000),
  "10_49m":  buffer.filter(b => b.value >= 10_000_000 && b.value < 50_000_000),
  "50_99m":  buffer.filter(b => b.value >= 50_000_000 && b.value < 100_000_000),
  "100m":    buffer.filter(b => b.value >= 100_000_000)
};
for(const tierKey of Object.keys(tiersToSend)){
  const list = tiersToSend[tierKey];
  if(!list || list.length===0) continue;
  list.sort((a,b)=>b.value-a.value);

  const lines = [`\`\`\`${list[0].serverId}\`\`\``];
  for(let i=0;i<list.length;i++){
    let line = `**${list[i].name} — ${list[i].gen}**`;
    if(i===0 && tierKey!=="1_9m") line = `🥇 **__${list[i].name} — ${list[i].gen}__**`;
    lines.push(line);
  }
  lines.push(`\n👥 **Jugadores:** ${list[0].players}`);

  const priority = getPriorityBrainrot(list);

  const embed = {
    title: priority?`⚡ ${priority.name} — ${priority.gen}`:`⚡ Nova Notifier`,
    description: lines.join("\n"),
    color:
      tierKey === "1_9m"   ? 0x00AEEF :   // Azul
      tierKey === "10_49m" ? 0x00FF00 :   // Verde
      tierKey === "50_99m" ? 0xFFA500 :   // Naranja
      0xFF0000,                           // Rojo para 100m+
    footer:{text:`Made by Kyurem • Nova Notifier`},
    timestamp:new Date(list[0].timestamp*1000).toISOString(),
    thumbnail:{url:getThumbnail(list)}
  };

  const namesKey = list.map(b=>`${b.name}-${b.gen}`).sort().join("_");
  const key = `main_${jobId}_${tierKey}_${namesKey}`;
  promises.push(sendEmbed(WEBHOOKS[tierKey], ROLE_MENTIONS[tierKey], embed, key));
}


    
// ======== HIGHLIGHT FILTER 150M OR PRIORITY ========
const seen = new Set(); 
const unique = [];

for (const b of buffer) {
  const isPriority = PRIORITY_NAMES.includes(b.name);
  const is150mPlus = b.value >= 150_000_000;

  // Solo acepta: 150M+ O Priority
  if (!isPriority && !is150mPlus) continue;

  const k = `${b.serverId}_${b.name}_${b.gen}`;
  if (seen.has(k)) continue;
  seen.add(k);
  unique.push(b);
}

if (unique.length > 0) {
  unique.sort((a,b)=>b.value - a.value);
  const top = unique[0];

  const lines = unique.map(b => `**${b.name} — ${b.gen}**`);
  lines.push(`\n👥 **Jugadores:** ${top.players}`);

  const priorityForHighlight = getPriorityBrainrot(unique);

  const highlightEmbed = {
    title: priorityForHighlight
      ? `🌟 ${priorityForHighlight.name} — ${priorityForHighlight.gen}`
      : `🌟 ${top.name} — ${top.gen}`,
    description: lines.join("\n"),
    color: 16766720,
    footer: { text: `Alpha Highlights` },
    timestamp: new Date(top.timestamp * 1000).toISOString(),
    thumbnail: { url: getThumbnail(unique) }
  };

  const highlightKey = `highlight_${jobId}_${unique.map(b=>`${b.name}-${b.gen}`).sort().join("_")}`;
  promises.push(sendEmbed(HIGHLIGHT_WEBHOOK, " ", highlightEmbed, highlightKey));
}


    delete serverBuffers[jobId];
  }
  await Promise.all(promises);
},500);

// ======== ENDPOINTS ========

app.post("/add-server",(req,res)=>{
  try{
    const {jobId,players,brainrots,timestamp} = req.body;
    if(!brainrots||!Array.isArray(brainrots)||brainrots.length===0) return res.sendStatus(400);
    if(!jobId) return res.status(400).json({error:"missing jobId"});
    if(!serverBuffers[jobId]) serverBuffers[jobId]=[];

    for(let b of brainrots){
      let tier = (b.tier||"").toLowerCase();
      // AutoJoiner
      if(b.value>=10_000_000 && autoJoinerServers.length<AUTOJOINER_MAX_BUFFER){
        autoJoinerServers.push({jobId,numericMPS:b.value,name:b.name,gen:b.gen,players:players||0,brainrots,detectedAt:new Date().toISOString()});
      }
      // Buffer para sender loop
      serverBuffers[jobId].push({serverId:jobId,name:b.name,gen:b.gen,value:b.value,tier:tier,players:players||0,timestamp:Math.floor(Date.now()/1000)});
      // HighlightBuffer
      if(tier && WEBHOOKS[tier] && b.value>=50_000_000) highlightBuffer.push(b);
      // AutoJoinQueue
      const existing = jobBestMap[jobId];
      if(!existing||b.value>(existing.value||0)){
        jobBestMap[jobId]={jobId,name:b.name,ms:b.gen,value:b.value,players:players||0,timestamp:Math.floor(Date.now()/1000)};
        if(!autoJoinQueue.some(e=>e.jobId===jobId)) autoJoinQueue.push(jobBestMap[jobId]);
        else autoJoinQueue=autoJoinQueue.map(e=>e.jobId===jobId?jobBestMap[jobId]:e);
      }
    }
    console.log(`📩 Recibido ${jobId} | ${brainrots.length} brainrots | ${players} jugadores`);
    return res.sendStatus(200);
  }catch(err){ console.error("add-server error:",err); return res.sendStatus(500);}
});

// AutoJoiner
app.get("/Autojoiner",(req,res)=>res.json(autoJoinerServers.slice()));
app.get("/get-server",(req,res)=>{
  if(!autoJoinQueue||autoJoinQueue.length===0) return res.status(404).json({error:"no servers available"});
  const entry=autoJoinQueue.shift(); if(entry&&entry.jobId) delete jobBestMap[entry.jobId]; return res.json(entry);
});
app.get("/get-servers",(req,res)=>res.json({job_ids:autoJoinQueue.map(e=>({jobId:e.jobId,name:e.name,ms:e.ms,players:e.players}))}));

// Status
app.get("/status",(req,res)=>res.json({
  serverBuffers:Object.keys(serverBuffers).length,
  highlightBuffered:highlightBuffer.length,
  queuedForAutoJoin:autoJoinQueue.length,
  sentMessagesCacheSize:sentMessages.size,
  autoJoinerBuffered:autoJoinerServers.length
}));

// Add pool
app.post("/add-pool",(req,res)=>{
  const data=req.body;
  if(!data||!Array.isArray(data.servers)) return res.status(400).json({error:"missing 'servers' array"});
  let added=0;
  for(const j of data.servers){
    if(!j) continue;
    if(!jobBestMap[j] && !autoJoinQueue.some(e=>e.jobId===j)){
      const entry={jobId:j,name:null,ms:null,value:0,players:0,timestamp:Math.floor(Date.now()/1000)};
      jobBestMap[j]=entry;
      autoJoinQueue.push(entry);
added++;
    }
  }
  return res.json({added});
});

// ======== START SERVER ========
app.listen(PORT,()=>console.log(`✅ API corriendo en puerto ${PORT}`));
