/**
 * ห้องเล่นออนไลน์ของเกมจับคู่คำศัพท์ (Cloudflare Pages Function)
 * เส้นทาง: POST /api/room   ส่ง JSON { action: "...", ... }
 *
 * เซิร์ฟเวอร์เป็นคนตัดสินทุกอย่าง: ใครถึงตาเล่น การ์ดใบไหนเปิดอยู่ ใครได้คะแนน
 * เครื่องของผู้เล่นแค่วาดตามที่เซิร์ฟเวอร์บอก เกมจึงตรงกันทุกเครื่อง
 */

const PEEK_MS = 3000;          // เปิดการ์ดให้ดูตอนเริ่ม 3 วินาที
const HOLD_MATCH = 700;        // จับคู่ถูก ค้างให้ดูก่อนติ๊กถูก
const HOLD_MISS = 1200;        // จับคู่ผิด ค้างให้ดูก่อนคว่ำกลับ
const MAX_PLAYERS = 6;
const MAX_CARDS = 40;
const ROOM_TTL = 12 * 60 * 60 * 1000;   // ห้องเก่ากว่า 12 ชม. ลบทิ้ง
const PTS = { 1: 10, 2: 20, 3: 30 };

const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function reply(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: HEADERS });
}
function fail(msg, status) {
  return reply({ ok: false, error: msg }, status || 400);
}
function now() { return Date.now(); }

/* ---------- อ่าน/เขียนห้อง ---------- */

async function loadRoom(db, code) {
  const row = await db.prepare("SELECT state, ver FROM game_rooms WHERE code = ?").bind(code).first();
  if (!row) return null;
  try {
    return { st: JSON.parse(row.state), ver: row.ver };
  } catch (e) {
    return null;
  }
}

// เขียนกลับแบบเช็ครุ่น: ถ้ามีคนอื่นเขียนแทรกไปก่อน จะเขียนไม่สำเร็จ แล้วให้ลองใหม่
async function saveRoom(db, code, st, ver) {
  const res = await db
    .prepare("UPDATE game_rooms SET state = ?, ver = ver + 1, updated_at = ? WHERE code = ? AND ver = ?")
    .bind(JSON.stringify(st), now(), code, ver)
    .run();
  return res.meta && res.meta.changes > 0;
}

/* ---------- กติกาของเกม ---------- */

// เคลียร์การ์ดคู่ที่ค้างอยู่ (ถูก = ติ๊กถูก, ผิด = คว่ำกลับแล้วเปลี่ยนตา)
function settle(st, t) {
  if (!st.pending || t < st.pending.until) return false;
  const a = st.cards[st.up[0]], b = st.cards[st.up[1]];
  if (a && b && a.pair === b.pair) {
    a.done = true; b.done = true;
    st.found++;
    const p = st.players[st.turn];
    if (p) { p.score += PTS[a.lv] || 10; p.pairs++; }
    st.lastGood = { by: st.turn, pts: PTS[a.lv] || 10, at: t };
  } else if (st.players.length) {
    st.turn = (st.turn + 1) % st.players.length;
  }
  st.up = [];
  st.pending = null;
  if (st.found >= st.pairs) { st.status = "done"; st.endedAt = t; }
  return true;
}

function cleanCards(cards) {
  if (!Array.isArray(cards) || cards.length < 2 || cards.length > MAX_CARDS) return null;
  const out = [];
  for (const c of cards) {
    if (!c || typeof c.pair !== "number" || !c.w) return null;
    out.push({
      pair: c.pair | 0,
      lv: (c.lv === 2 || c.lv === 3) ? c.lv : 1,
      kind: String(c.kind || "pic").slice(0, 8),
      w: {
        e: String(c.w.e || "").slice(0, 8),
        th: String(c.w.th || "").slice(0, 40),
        en: String(c.w.en || "").slice(0, 40)
      },
      done: false
    });
  }
  return out;
}

function cleanName(n, fallback) {
  const s = String(n == null ? "" : n).trim().slice(0, 14);
  return s || fallback;
}

function newId() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}

/* ---------- จัดการคำสั่ง ---------- */

async function createRoom(db, body) {
  const cards = cleanCards(body.cards);
  if (!cards) return fail("ข้อมูลการ์ดไม่ถูกต้อง");

  await db.prepare("DELETE FROM game_rooms WHERE updated_at < ?").bind(now() - ROOM_TTL).run();

  const pid = newId();
  const st = {
    lang: String(body.lang || "th").slice(0, 8),
    stage: body.stage | 0,
    status: "lobby",
    cards: cards,
    pairs: cards.length / 2,
    up: [],
    pending: null,
    players: [{ id: pid, name: cleanName(body.name, "เจ้าของห้อง"), score: 0, pairs: 0 }],
    turn: 0,
    found: 0,
    moves: 0,
    startedAt: null,
    endedAt: null,
    lastGood: null
  };

  // สุ่มรหัส 4 หลักที่ยังไม่มีใครใช้ ลองได้ 12 ครั้ง
  for (let i = 0; i < 12; i++) {
    const code = String(1000 + Math.floor(Math.random() * 9000));
    try {
      await db
        .prepare("INSERT INTO game_rooms (code, state, ver, updated_at) VALUES (?, ?, 0, ?)")
        .bind(code, JSON.stringify(st), now())
        .run();
      return reply({ ok: true, code: code, pid: pid, state: st, ver: 0 });
    } catch (e) { /* รหัสชนกัน สุ่มใหม่ */ }
  }
  return fail("ห้องเต็มชั่วคราว ลองใหม่อีกครั้ง", 503);
}

// อ่านห้อง แก้ไข แล้วเขียนกลับ ถ้าชนกับคนอื่นให้ลองใหม่ได้ 3 รอบ
async function mutate(db, code, fn) {
  for (let i = 0; i < 3; i++) {
    const room = await loadRoom(db, code);
    if (!room) return fail("ไม่พบห้องนี้ ตรวจรหัสอีกครั้งนะ", 404);
    const t = now();
    settle(room.st, t);
    const err = fn(room.st, t);
    if (err) return fail(err);
    if (await saveRoom(db, code, room.st, room.ver)) {
      return reply({ ok: true, state: room.st, ver: room.ver + 1 });
    }
  }
  return fail("มีคนกดพร้อมกันพอดี ลองอีกครั้ง", 409);
}

async function handle(db, body) {
  const action = String(body.action || "");
  const code = String(body.code || "").replace(/\D/g, "").slice(0, 4);

  if (action === "create") return createRoom(db, body);
  if (!code) return fail("ต้องใส่รหัสห้อง");

  if (action === "state") {
    const room = await loadRoom(db, code);
    if (!room) return fail("ไม่พบห้องนี้ ตรวจรหัสอีกครั้งนะ", 404);
    const t = now();
    if (settle(room.st, t)) {
      if (await saveRoom(db, code, room.st, room.ver)) {
        return reply({ ok: true, state: room.st, ver: room.ver + 1 });
      }
      const again = await loadRoom(db, code);
      if (again) return reply({ ok: true, state: again.st, ver: again.ver });
    }
    return reply({ ok: true, state: room.st, ver: room.ver });
  }

  if (action === "join") {
    let pid = null;
    const res = await mutate(db, code, function (st) {
      if (st.status !== "lobby") return "ห้องนี้เริ่มเล่นไปแล้ว รอเกมนี้จบก่อนนะ";
      if (st.players.length >= MAX_PLAYERS) return "ห้องเต็มแล้ว (สูงสุด " + MAX_PLAYERS + " คน)";
      pid = newId();
      st.players.push({ id: pid, name: cleanName(body.name, "ผู้เล่น " + (st.players.length + 1)), score: 0, pairs: 0 });
      return null;
    });
    if (res.status !== 200) return res;
    const data = await res.json();
    data.pid = pid;
    return reply(data);
  }

  if (action === "start") {
    return mutate(db, code, function (st, t) {
      if (!st.players.length || st.players[0].id !== body.pid) return "เจ้าของห้องเท่านั้นที่กดเริ่มได้";
      if (st.players.length < 2) return "รออีกอย่างน้อย 1 คนเข้าห้องก่อนนะ";
      if (st.status === "playing") return null;
      st.status = "playing";
      st.startedAt = t;
      return null;
    });
  }

  if (action === "flip") {
    const id = body.id | 0;
    return mutate(db, code, function (st, t) {
      if (st.status !== "playing") return "ยังไม่ถึงเวลาเล่น";
      if (t < (st.startedAt || 0) + PEEK_MS) return "กำลังเปิดให้จำอยู่ รอแป๊บนึง";
      if (st.pending) return "รอการ์ดคู่ที่แล้วก่อนนะ";
      const idx = st.players.findIndex(function (p) { return p.id === body.pid; });
      if (idx < 0) return "คุณไม่ได้อยู่ในห้องนี้";
      if (idx !== st.turn) return "ยังไม่ถึงตาของคุณ";
      const c = st.cards[id];
      if (!c || c.done || st.up.indexOf(id) >= 0) return "เลือกใบอื่นนะ";
      st.up.push(id);
      if (st.up.length === 2) {
        st.moves++;
        const m = st.cards[st.up[0]].pair === st.cards[st.up[1]].pair;
        st.pending = { until: t + (m ? HOLD_MATCH : HOLD_MISS), matched: m };
      }
      return null;
    });
  }

  if (action === "again") {
    const cards = cleanCards(body.cards);
    if (!cards) return fail("ข้อมูลการ์ดไม่ถูกต้อง");
    return mutate(db, code, function (st, t) {
      if (!st.players.length || st.players[0].id !== body.pid) return "เจ้าของห้องเท่านั้นที่เริ่มรอบใหม่ได้";
      st.cards = cards;
      st.pairs = cards.length / 2;
      st.up = []; st.pending = null; st.found = 0; st.moves = 0;
      st.turn = 0; st.status = "playing"; st.startedAt = t; st.endedAt = null; st.lastGood = null;
      st.players.forEach(function (p) { p.score = 0; p.pairs = 0; });
      if (body.stage != null) st.stage = body.stage | 0;
      if (body.lang) st.lang = String(body.lang).slice(0, 8);
      return null;
    });
  }

  if (action === "leave") {
    return mutate(db, code, function (st) {
      const i = st.players.findIndex(function (p) { return p.id === body.pid; });
      if (i < 0) return null;
      if (st.status === "lobby") {
        st.players.splice(i, 1);
        if (st.turn >= st.players.length) st.turn = 0;
      } else {
        st.players[i].left = true;
      }
      return null;
    });
  }

  return fail("ไม่รู้จักคำสั่งนี้");
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: HEADERS });
  if (request.method !== "POST") return fail("ใช้ POST เท่านั้น", 405);
  if (!env.DB) return fail("ยังไม่ได้ผูกฐานข้อมูล D1 (ตั้งชื่อ binding ว่า DB ใน Cloudflare Pages)", 500);

  let body;
  try { body = await request.json(); } catch (e) { return fail("ข้อมูลที่ส่งมาไม่ถูกต้อง"); }

  try {
    return await handle(env.DB, body);
  } catch (e) {
    return fail("เซิร์ฟเวอร์มีปัญหา: " + (e && e.message ? e.message : String(e)), 500);
  }
}
