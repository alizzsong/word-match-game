/* ทดสอบตรรกะห้องออนไลน์: ผลัดตา, จับคู่ถูก/ผิด, จบเกม */
var OFF = 0, realNow = Date.now;
Date.now = function(){ return realNow.call(Date) + OFF; };
function advance(ms){ OFF += ms; }

/* Response จำลอง */
function Response(body, init){ this._b = body; this.status = (init && init.status) || 200; }
Response.prototype.json = function(){ return Promise.resolve(JSON.parse(this._b)); };

/* D1 จำลอง */
var TABLE = {};
function DB(){}
DB.prototype.prepare = function(sql){
  var self = this, args = [];
  var stmt = {
    bind: function(){ args = Array.prototype.slice.call(arguments); return stmt; },
    first: function(){
      if(sql.indexOf("SELECT") === 0){
        var r = TABLE[args[0]];
        return Promise.resolve(r ? {state:r.state, ver:r.ver} : null);
      }
      return Promise.resolve(null);
    },
    run: function(){
      if(sql.indexOf("UPDATE") === 0){
        var code = args[2], ver = args[3], row = TABLE[code];
        if(row && row.ver === ver){ row.state = args[0]; row.ver++; row.updated_at = args[1];
          return Promise.resolve({meta:{changes:1}}); }
        return Promise.resolve({meta:{changes:0}});
      }
      if(sql.indexOf("INSERT") === 0){
        if(TABLE[args[0]]) return Promise.reject(new Error("UNIQUE"));
        TABLE[args[0]] = {state:args[1], ver:0, updated_at:args[2]};
        return Promise.resolve({meta:{changes:1}});
      }
      if(sql.indexOf("DELETE") === 0) return Promise.resolve({meta:{changes:0}});
      return Promise.resolve({meta:{changes:0}});
    }
  };
  return stmt;
};

var src = readFile("functions/api/room.js").replace(/^export\s+/gm, "");
var mod = new Function("Response", src + "\n return {onRequest:onRequest};")(Response);

var env = { DB: new DB() };
function call(body){
  var req = { method:"POST", json:function(){ return Promise.resolve(body); } };
  return mod.onRequest({request:req, env:env}).then(function(r){
    return r.json().then(function(j){ j._status = r.status; return j; });
  });
}

/* การ์ด 3 คู่: A A B B C C */
var CARDS = [
  {pair:0, lv:1, kind:"pic", w:{e:"🐘", th:"ช้าง", en:"Elephant"}},
  {pair:1, lv:2, kind:"pic", w:{e:"🐱", th:"แมว", en:"Cat"}},
  {pair:0, lv:1, kind:"pic", w:{e:"🐘", th:"ช้าง", en:"Elephant"}},
  {pair:2, lv:3, kind:"pic", w:{e:"🐶", th:"หมา", en:"Dog"}},
  {pair:1, lv:2, kind:"w-th", w:{e:"🐱", th:"แมว", en:"Cat"}},
  {pair:2, lv:3, kind:"w-en", w:{e:"🐶", th:"หมา", en:"Dog"}}
];
var pass = 0, failn = 0;
function ok(name, cond, extra){
  if(cond){ pass++; print("  ✓ " + name); }
  else { failn++; print("  ✗ " + name + (extra ? "  → " + extra : "")); }
}

var code, host, guest;
call({action:"create", cards:CARDS, lang:"th", stage:0, name:"ออม"})
.then(function(j){
  ok("สร้างห้องได้ มีรหัส 4 หลัก", j.ok && /^\d{4}$/.test(j.code), JSON.stringify(j).slice(0,120));
  ok("เริ่มที่สถานะห้องรอ", j.state.status === "lobby");
  ok("นับคู่ถูก (3 คู่)", j.state.pairs === 3, j.state.pairs);
  code = j.code; host = j.pid;
  return call({action:"start", code:code, pid:host});
})
.then(function(j){
  ok("คนเดียวยังเริ่มไม่ได้", !j.ok, j.error);
  return call({action:"join", code:code, name:"ตี๋"});
})
.then(function(j){
  ok("เพื่อนเข้าห้องได้", j.ok && j.state.players.length === 2);
  guest = j.pid;
  return call({action:"flip", code:code, pid:guest, id:0});
})
.then(function(j){
  ok("ยังไม่เริ่ม เปิดการ์ดไม่ได้", !j.ok, j.error);
  return call({action:"start", code:code, pid:guest});
})
.then(function(j){
  ok("คนที่ไม่ใช่เจ้าของห้องกดเริ่มไม่ได้", !j.ok, j.error);
  return call({action:"start", code:code, pid:host});
})
.then(function(j){
  ok("เจ้าของห้องกดเริ่มได้", j.ok && j.state.status === "playing");
  return call({action:"flip", code:code, pid:host, id:0});
})
.then(function(j){
  ok("ช่วงเปิดให้จำ ยังกดไม่ได้", !j.ok, j.error);
  advance(3200);
  return call({action:"flip", code:code, pid:guest, id:0});
})
.then(function(j){
  ok("ยังไม่ถึงตา กดไม่ได้", !j.ok, j.error);
  return call({action:"flip", code:code, pid:host, id:0});
})
.then(function(j){
  ok("เจ้าของห้องเปิดใบแรกได้", j.ok && j.state.up.length === 1);
  return call({action:"flip", code:code, pid:host, id:2});
})
.then(function(j){
  ok("เปิดใบที่สองแล้วรอเฉลย", j.ok && j.state.pending && j.state.pending.matched === true);
  advance(900);
  return call({action:"state", code:code});
})
.then(function(j){
  ok("จับคู่ถูก การ์ดติ๊กถูก", j.state.cards[0].done && j.state.cards[2].done);
  ok("ได้คะแนนตามระดับ (⭐ = 10)", j.state.players[0].score === 10, j.state.players[0].score);
  ok("จับคู่ถูกได้เล่นต่อ ตายังไม่เปลี่ยน", j.state.turn === 0, j.state.turn);
  return call({action:"flip", code:code, pid:host, id:1});
})
.then(function(){ return call({action:"flip", code:code, pid:host, id:3}); })
.then(function(j){
  ok("จับคู่ผิด ขึ้นรอเฉลย", j.state.pending && j.state.pending.matched === false);
  advance(1400);
  return call({action:"state", code:code});
})
.then(function(j){
  ok("จับคู่ผิด การ์ดคว่ำกลับ", j.state.up.length === 0 && !j.state.cards[1].done);
  ok("จับคู่ผิด เปลี่ยนตาให้อีกคน", j.state.turn === 1, j.state.turn);
  return call({action:"flip", code:code, pid:guest, id:1});
})
.then(function(){ return call({action:"flip", code:code, pid:guest, id:4}); })
.then(function(j){
  advance(900);
  return call({action:"state", code:code});
})
.then(function(j){
  ok("เพื่อนจับคู่ ⭐⭐ ได้ 20 คะแนน", j.state.players[1].score === 20, j.state.players[1].score);
  return call({action:"flip", code:code, pid:guest, id:3});
})
.then(function(){ return call({action:"flip", code:code, pid:guest, id:5}); })
.then(function(j){
  advance(900);
  return call({action:"state", code:code});
})
.then(function(j){
  ok("จับคู่ครบ เกมจบ", j.state.status === "done", j.state.status);
  ok("คะแนนรวมถูก (ออม 10 / ตี๋ 50)",
     j.state.players[0].score === 10 && j.state.players[1].score === 50,
     j.state.players[0].score + "/" + j.state.players[1].score);
  return call({action:"again", code:code, pid:host, cards:CARDS, stage:0, lang:"th"});
})
.then(function(j){
  ok("เจ้าของห้องเริ่มรอบใหม่ได้ คะแนนรีเซ็ต",
     j.ok && j.state.status === "playing" && j.state.players[0].score === 0 && j.state.found === 0);
  print("");
  print(failn === 0 ? ("ผ่านทั้งหมด " + pass + " ข้อ ✅") : ("ผ่าน " + pass + " · ไม่ผ่าน " + failn + " ❌"));
})
.catch(function(e){ print("ERROR: " + e + "\n" + (e && e.stack)); });
