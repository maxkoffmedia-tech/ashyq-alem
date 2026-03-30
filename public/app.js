// Инициализация Firebase (использует firebaseConfig из index.html)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

// Элементы
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const langSel = document.getElementById('langSel');
const loginBtn = document.getElementById('loginBtn');
const daysEl = document.getElementById('days');
const pointsEl = document.getElementById('points');
const moneyEl = document.getElementById('money');
const barFill = document.getElementById('barFill');
const marker = document.getElementById('marker');
const yurta = document.getElementById('yurta');
const tree = document.getElementById('tree');
const badgeEl = document.getElementById('badge');
const quoteEl = document.getElementById('quote');
const plusDayBtn = document.getElementById('plusDay');
const undoDayBtn = document.getElementById('undoDay');
const shareBtn = document.getElementById('shareBtn');
const aiInput = document.getElementById('aiInput');
const askAiBtn = document.getElementById('askAi');
const aiOut = document.getElementById('aiOut');

let uid = null;
let lang = localStorage.getItem('lang') || 'ru';

const DAILY_KZT = 1000;
const FIRST_YURT = 7, FIRST_AUL = 30, BIG_TOI = 90;
const QUOTES = {
  ru: ['Еңбек етсең ерінбей — тояды қарның тіленбей.','Сен де бір кірпіш дүниеге, кетігін тап та бар қалан.'],
  kz: ['Еңбек етсең ерінбей — тояды қарның тіленбей.','Адамзаттың бәрін сүй бауырым деп.']
};

// Tabs
tabs.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    tabs.forEach(b=>b.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Lang
langSel.value = lang;
langSel.onchange = ()=>{ lang = langSel.value; localStorage.setItem('lang',lang); setQuote(); };

// Anonymous auth
loginBtn.addEventListener('click', async ()=>{
  if (auth.currentUser) return alert('Уже вошли анонимно');
  await auth.signInAnonymously();
});

auth.onAuthStateChanged(async user=>{
  if (!user) return;
  uid = user.uid;
  loginBtn.textContent = 'Вход выполнен';
  await ensureUser();
  await loadUserProgress();
  subscribePublicChat();
  setQuote();
});

async function ensureUser(){
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) await ref.set({ days:0, points:0, treeLevel:0, lastUpdated:null, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}

function renderProgress(data={days:0, points:0, treeLevel:0}){
  const days=data.days||0, points=data.points||0, treeLevel=data.treeLevel||0;
  daysEl.textContent = days;
  pointsEl.textContent = points;
  moneyEl.textContent = (days*DAILY_KZT).toLocaleString('ru-RU');
  barFill.style.width = Math.min(100, Math.round(days/FIRST_AUL*100)) + '%';
  marker.style.left = (6 + Math.min(1, days/FIRST_AUL)*72) + '%';
  yurta.style.display = days>=FIRST_YURT ? 'block':'none';
  tree.style.display = points>=50 ? 'block':'none';
  if (days>=BIG_TOI) badgeEl.textContent='Батыр'; else if (days>=FIRST_AUL) badgeEl.textContent='Ауыл иесі'; else if (days>=FIRST_YURT) badgeEl.textContent='Киіз үй'; else badgeEl.textContent='Жас қыран';
}

async function loadUserProgress(){
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (snap.exists) renderProgress(snap.data());
}

plusDayBtn.addEventListener('click', async ()=>{
  const ref = db.collection('users').doc(uid);
  await db.runTransaction(async tx=>{
    const snap = await tx.get(ref);
    const cur = snap.exists ? snap.data() : {days:0, points:0};
    const days = (cur.days||0)+1;
    const points = (cur.points||0)+10;
    tx.set(ref, { days, points, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { merge:true });
  });
  await loadUserProgress();
});

undoDayBtn.addEventListener('click', async ()=>{
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get(); if (!snap.exists) return;
  const last = snap.data().lastUpdated;
  if (!last) return alert('Нет операции за 24ч');
  const ms = Date.now() - last.toMillis();
  if (ms>24*60*60*1000) return alert('Прошло >24ч — отмена недоступна');
  const days = Math.max(0, (snap.data().days||0)-1);
  const points = Math.max(0, (snap.data().points||0)-10);
  await ref.set({ days, points, lastUpdated:null }, { merge:true });
  renderProgress({ days, points, treeLevel: snap.data().treeLevel || 0 });
});

shareBtn.addEventListener('click', ()=>{
  const days = daysEl.textContent;
  const text = `Мой прогресс в Ashyq Alem: ${days} дней здоровья.`;
  if (navigator.share) navigator.share({ title:'Ashyq Alem', text, url: location.href });
  else { navigator.clipboard.writeText(text+' '+location.href); alert('Скопировано!'); }
});

// AI demo (локально, без API)
askAiBtn.addEventListener('click', ()=>{
  const q = (aiInput.value||'').toLowerCase();
  let reply = "Я рядом. Маленький шаг: глубокий вдох, стакан воды, прогулка 5 минут.";
  if (q.includes('срыв')||q.includes('сорв')) reply = "Остановись, напиши, что триггерит, нажми SOS если нужно.";
  aiOut.textContent = '🤖 ' + reply + ' (демо)';
});

// --- Public chat (RTDB)
const publicChat = document.getElementById('publicChat');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
function renderMsg(box, m){
  const div=document.createElement('div');
  const t = new Date(m.ts||Date.now()).toLocaleTimeString();
  const who = m.uid===uid ? '<b>Я:</b>' : '<span style="opacity:.7">Участник:</span>';
  div.innerHTML = `${who} ${escapeHtml(m.text)} <span style="opacity:.6">· ${t}</span>`;
  box.appendChild(div); box.scrollTop = box.scrollHeight;
}
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function subscribePublicChat(){
  const ref = rtdb.ref(`chat/public/messages`).limitToLast(100);
  ref.off();
  ref.on('child_added', snap => renderMsg(publicChat, snap.val()));
}
chatSend.addEventListener('click', ()=>{ const txt=chatInput.value; if(!txt) return; const ref=rtdb.ref(`chat/public/messages`).push(); ref.set({ id: ref.key, uid, text: txt.trim(), ts: Date.now() }); chatInput.value=''; });

// SOS
const sosText = document.getElementById('sosText'), sosSend = document.getElementById('sosSend');
sosSend.addEventListener('click', async ()=>{
  const text = (sosText.value||'').trim(); if(!text) return alert('Опишите ситуацию.');
  const ref = rtdb.ref(`sos/queue`).push(); await ref.set({ id: ref.key, uid, text, ts: Date.now(), status: 'new' });
  sosText.value=''; alert('SOS отправлен.');
});

// Load small initial content (12 steps)
const twelveSteps = [
  'Признать бессилие перед зависимостью',
  'Поверить в силу, способную вернуть нам здравомыслие',
  'Принять решение поверить этой силе',
  'Выявить свои ошибки',
  'Признать ошибки перед собой и другими',
  'Готовность к изменениям',
  'Просить устранения недостатков',
  'Составить список причинённого вреда',
  'Возместить ущерб, где возможно',
  'Продолжать самоинвентаризацию',
  'Духовная практика/рефлексия',
  'Делиться опытом с другими'
];
document.getElementById('twelveSteps').innerHTML = twelveSteps.map(s => `<li>${s}</li>`).join('');

// Helpers
function setQuote(){ const arr = QUOTES[lang] || QUOTES.ru; quoteEl.textContent = arr[Math.floor(Math.random()*arr.length)]; }
setQuote();
